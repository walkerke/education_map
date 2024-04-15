library(tigris)
library(tidycensus)
library(tidyverse)
library(sf)
library(tictoc)
library(mapboxapi) 
options(tigris_use_cache = TRUE)
sf_use_s2(FALSE)

state_codes <- c(state.abb, "DC")
names(state_codes) <- state_codes
education_groups <- read_rds("data/education_grouped.rds")
  
# Cache the blocks to prevent download errors
# purrr::walk(state_codes, ~blocks(state = .x, year = 2020))

# Create a CT crosswalk between 2020 blocks and the new 2022 IDs
ct_blocks <- blocks("CT", year = 2020) %>%
  st_point_on_surface() %>%
  select(STATEFP20:GEOID20)

ct_counties <- counties("CT", year = 2022) %>%
  select(NEWCOUNTYFP = COUNTYFP)

ct_blocks_joined <- ct_blocks %>%
  st_join(ct_counties) %>%
  transmute(GEOID22 = paste0(STATEFP20, NEWCOUNTYFP, 
                             TRACTCE20, BLOCKCE20),
            GEOID20 = GEOID20) %>%
  st_drop_geometry()

ct_blocks_to_use <- blocks("CT", year = 2020) %>%
  select(GEOID20, POP20) %>%
  left_join(ct_blocks_joined, by = "GEOID20") %>%
  mutate(GEOID20 = GEOID22) %>%
  select(GEOID20, POP20)
  

state_dots <- purrr::map(state_codes, ~{
  print(sprintf("Processing %s...", .x))
  
  if (.x == "CT") {
    state_blocks <- ct_blocks_to_use
  } else {
    state_blocks <- blocks(.x, year = 2020)
  }

  tic()
  state_with_pop <- state_blocks %>%
    filter(POP20 > 0) %>%
    transmute(tract_id = str_sub(GEOID20, end = -5)) %>%
    group_by(tract_id) %>%
    summarize()
  toc()
  

  joined_tracts <- state_with_pop %>%
    left_join(education_groups, by = c("tract_id" = "GEOID")) %>%
    mutate(n = ifelse(is.na(n), 0, n))
  
  # Check to see if any groups need to be removed
  cleaned_tracts <- joined_tracts %>%
    group_by(group) %>%
    filter(max(n, na.rm = TRUE) >= 25) %>%
    ungroup()
  
  all_dots <- as_dot_density(
    input_data = cleaned_tracts, 
    value = "n",
    values_per_dot = 25,
    group = "group"
  )
  
  # Write state dataset to temp file to guard against unforeseen errors
  write_rds(all_dots, glue::glue("data/temp/{.x}_dots.rds"))
  
  return(all_dots)
})


# Write full dataset to guard against unforeseen errors
state_dots <- list.files("data/temp", 
                         pattern = "_dots.rds$", 
                         full.names = TRUE) %>%
  map(~read_rds(.x))

write_rds(state_dots, "data/temp/state_dots_list.rds")

# Then, combine
# state_dots_combined <- read_rds("data/temp/state_dots_list.rds")
state_dots_combined <- state_dots %>%
  data.table::rbindlist() %>%
  st_as_sf(crs = 4326)

tippecanoe(state_dots_combined, 
           output = "data/education_dots_2022_acs.mbtiles", 
           layer_name = "education_dots_2022_acs",
           max_zoom = 12,
           min_zoom = 3,
           drop_rate = 2)

upload_tiles("data/education_dots_2022_acs.mbtiles", 
             username = "kwalkertcu",
             tileset_name = "education_dots_2022_acs")


