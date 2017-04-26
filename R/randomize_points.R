library(tidyverse)

set.seed(1983)

randomize_and_write <- function(csv) {
  
  dir <- "data/march7/"
  
  df <- read_csv(paste0(dir, csv))
  
  rand <- sample(nrow(df))
  
  df_rand <- df[rand, ]
  
  out <- paste0(dir, "shuffle_", csv)
  
  write_csv(df_rand, out)
  
}


files <- list.files("data/march7")

walk(files, randomize_and_write)


