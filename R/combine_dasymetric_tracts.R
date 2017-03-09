library(tidyverse)
library(tigris)
library(sf)
library(sp)
library(maptools)
library(purrr)
library(mapview)
library(stringr)


# Get continental US states

state = unique(fips_codes$state)[1:51]
state_name = unique(fips_codes$state_name)[1:51]

df <- read_csv("data-raw/nhgis0076_csv/nhgis0076_ds215_20155_2015_tract.csv")

df2 <- df %>%
  transmute(GISJOIN = GISJOIN, 
            less_than_hs = rowSums(df[,39:53]), 
            high_school = ADMZE017 + ADMZE018, 
            some_college = ADMZE019 + ADMZE020 + ADMZE021, 
            bachelors = ADMZE022, 
            graduate = ADMZE023 + ADMZE024 + ADMZE025, 
            total = ADMZE001)

sf_list <- map(state, function(x) {
  
  dir <- "data/dissolve"
  
  layer <- paste0(x, "_dissolve")
  
  st_read(dsn = dir, layer = layer, stringsAsFactors = FALSE)
  
})

dtracts <- Reduce(rbind, sf_list)


joined <- dtracts %>% left_join(df2, by = "GISJOIN")

# Get back the CRS
al <- st_read(dsn = "data/dissolve", layer = "AL_dissolve")

st_crs(joined) <- st_crs(al)

st_write(joined2, dsn = "data/dissolve", layer = "full_dissolved", 
         driver = "ESRI Shapefile")
