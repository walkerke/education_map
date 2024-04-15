library(tidycensus)
library(tidyverse)

vars <- load_variables(2022, "acs5/profile") 

# Grab data without geometry as we'll want to wrangle the geometry separately
state_codes <- c(state.abb, "DC")

education_data <- map_dfr(state_codes, ~{
  get_acs(geography = "tract",
          state = .x,
          variables = c(
            less_than_hs = "DP02_0060",
            less_than_hs = "DP02_0061",
            high_school = "DP02_0062",
            some_college = "DP02_0063",
            some_college = "DP02_0064",
            bachelors = "DP02_0065",
            graduate = "DP02_0066"
          ),
          year = 2022) %>%
    summarize(n = sum(estimate, na.rm = TRUE), 
              .by = c(GEOID, variable)) %>%
    rename(group = variable)
})


write_rds(education_data, "data/education_grouped.rds")

  