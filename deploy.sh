#!/bin/bash

# Set variables
IMAGE_NAME="test-docker"
CONTAINER_NAME="test-docker"
HOST_PORT=3000

# Build the Docker image
docker build -t "$IMAGE_NAME" .
docker rm -f "$CONTAINER_NAME"

# Run the Docker container
docker run -p "$HOST_PORT:3000" --name "$CONTAINER_NAME" -v /var/run/docker.sock:/var/run/docker.sock "$IMAGE_NAME"
