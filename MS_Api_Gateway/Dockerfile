# Start from the official Golang image
FROM golang:1.21-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy go.mod and go.sum if you have them (optional)
# COPY go.mod go.sum ./
# RUN go mod download

# Copy the source code
COPY . .

# Build the Go app
RUN go build -o api-gateway main.go

# Expose the port the app runs on
EXPOSE 8080

# Run the executable
CMD ["./api-gateway"]
