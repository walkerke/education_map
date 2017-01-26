library(tidyverse)
library(tigris)
library(sf)
library(sp)
library(maptools)
library(purrr)
library(mapview)

us_tracts <- st_read(dsn = "data", layer = "tracts10m", stringsAsFactors = FALSE)

df <- read_csv("data-raw/nhgis0076_csv/nhgis0076_ds215_20155_2015_tract.csv")

df2 <- df %>%
  transmute(geoid = paste0(STATEA, COUNTYA, TRACTA), 
            less_than_hs = rowSums(df[,39:53]), 
            high_school = ADMZE017 + ADMZE018, 
            some_college = ADMZE019 + ADMZE020 + ADMZE021, 
            bachelors = ADMZE022, 
            graduate = ADMZE023 + ADMZE024 + ADMZE025, 
            total = ADMZE001)

full_tracts <- us_tracts %>%
  geo_join(df2, "GEOID", "geoid") %>%
  st_transform(4326)

# st_write(full_tracts, dsn = "data", layer = "educationshp", driver = "ESRI Shapefile")

# Define dot-making function

educ_to_xy <- function(df, scaling_factor) {
  
  levels <- c("less_than_hs", "high_school", "some_college", "bachelors", "graduate")
  
  xys <- map_df(levels, function(level) {
      
      df[[level]] <- as.integer(df[[level]] / scaling_factor)
      
      dfsp <- as(df, "Spatial")
      
      dots <- dotsInPolys(dfsp, dfsp[[level]])
      
      dots$longitude <- coordinates(dots)[,1]
      dots$latitude <- coordinates(dots)[,2]
      
      dots$level <- level
      
      return(dots@data)
      
    })
}

# Reproducible

set.seed(1983)

scales <- c(25, 50, 100, 200, 500)

scales %>%
  map(function(x){
    path <- paste0("data/us_", as.character(x), ".csv")
    
    xys <- educ_to_xy(full_tracts, x)
    
    write_csv(xys, path = path)
    
  })

# # Test it
# 
# tarrant <- filter(full_tracts, STATEFP == "48" & COUNTYFP == "439")
# 
# tarrant_xy <- educ_to_xy(tarrant, 10)
# 
# write_csv(tarrant_xy, "data/tarrantxy.csv")
# 
# # Test it for the us with a scaling factor of 200 - takes a while!
# 
# us_200 <- educ_to_xy(full_tracts, 200)
# 
# write_csv(us_200, "data/us200.csv")
# 
# # Code to do it all
# 
# scales <- c(25, 50, 100, 500)
# 
# scales %>%
#   map(function(x){
#     path <- paste0("data/us_", as.character(x), ".csv")
#     
#     xys <- educ_to_xy(full_tracts, x)
#     
#     write_csv(xys, path = path)
#     
#   })



#############
# library(tigris)
# library(sf)
# library(mapview)
# options(tigris_class = "sf")
# 
# orleans <- tracts("LA", "Orleans", cb = TRUE)
# orleans_water <- area_water("LA", "Orleans")
# 
# diff <- st_difference(orleans, orleans_water)
