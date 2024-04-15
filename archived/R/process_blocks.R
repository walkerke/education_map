library(tidyverse)
library(sf)
library(tigris)

df <- read_csv("data-raw/nhgis0078_csv/nhgis0078_csv/nhgis0078_ds172_2010_block.csv")

nopop <- df %>%
   select(GISJOIN, totalpop = H7V001) %>%
   filter(totalpop == 0)

# saveRDS(nopop, "data/nopop.rds")

# nopop <- read_rds("data/nopop.rds")

state_vec <- unique(fips_codes$state)[1:51]

merge_and_write <- function(state) {
  
  message("Processing ", state, "...")
  
  layer_name = paste0(state, "_block_2010")
  
  blks <- st_read(dsn = "data/blocks", layer = layer_name, 
                  stringsAsFactors = FALSE)
  
  blks_nopop <- inner_join(blks, nopop, by = "GISJOIN")
  
  out_name <- paste0(state, "_nopop")
  
  st_write(blks_nopop, dsn = "data/blocks/nopop", layer = out_name, 
           driver = "ESRI Shapefile")
  
}

walk(state_vec, merge_and_write)




