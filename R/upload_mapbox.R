library(httr)
library(aws.s3)

retrieve_mb_credentials <- function(username, token) {
  
  base <- sprintf("https://api.mapbox.com/uploads/v1/%s/credentials", username)
  
  request <- GET(url = base, query = list(access_token = token))
  
}

token <- "sk.eyJ1Ijoia3dhbGtlcnRjdSIsImEiOiJjaXliZ3FybWIwMDBtMzNwZXhrdTZjNWRnIn0.C-_cQRK0KzOGuESNeycJJQ"

r <- retrieve_mb_credentials("kwalkertcu", token)


b <- GET("https://api.mapbox.com/uploads/v1/kwalkertcu/credentials?access_token=sk.eyJ1Ijoia3dhbGtlcnRjdSIsImEiOiJjaXliZ3FybWIwMDBtMzNwZXhrdTZjNWRnIn0.C-_cQRK0KzOGuESNeycJJQ")
