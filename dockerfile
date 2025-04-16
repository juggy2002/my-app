# Use official Node.js image as base image
FROM node:16-slim

# Set working directory inside container
WORKDIR /app

# Copy frontend app into container
COPY ./webapp-frontend /app

# Install http-server globally
RUN npm install -g http-server

# Expose the port the app will run on
EXPOSE 8080

# Command to start the server
CMD ["http-server", ".", "-p", "8080"]
