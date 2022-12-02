#Case Study API

A restful API made with Golang for interfacing with postgres. Implements Mux framework because I accidentally glossed over the part about using Echo until I was in to deep to start over, and implements Squirrel up until I was no longer to discern how to use some of its methods from its documentation.

##Usage

You will need your own .env file with a valid postgres connection string. In the root of ./API, paste the following command in your terminal to start the API 

```go run main.go

