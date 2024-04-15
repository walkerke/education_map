library(tidyverse)

folders <- list.files("data-raw/blocks/nhgis0079_shape/", pattern = ".zip", 
                      full.names = TRUE)

unzip_and_move <- function(x) {
  unzip(x, exdir = "data/blocks")
}

map(folders, unzip_and_move)
