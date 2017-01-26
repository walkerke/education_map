# devtools::install_github("walkerke/tigris@sf")

library(tigris)
library(sf)

options(tigris_class = "sf")

# Get continental US states

us_states <- unique(fips_codes$state)[1:51]

us_tracts <- rbind_tigris(
  lapply(us_states, function(x) {
    tracts(state = x, cb = TRUE)
  })
)

saveRDS(us_tracts, "data/tracts2015sf.rds")
