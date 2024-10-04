# Use an official Node.js runtime as a parent image
FROM node:16

# Set the working directory
WORKDIR /usr/src

# Copy package.json and package-lock.json
COPY src/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY ./src .

# Expose the port the app runs on
EXPOSE 3001

# Command to run the application
CMD ["node", "server.js"]
