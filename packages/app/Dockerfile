# Use an official Node runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /home/encre/packages/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

RUN yarn add react-scripts

# Install the app dependencies
RUN yarn install

# Copy the app source code to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Define environment variable
ENV REACT_APP_ENV testing

# Define environment variable
RUN yarn build

# Command to run the application
CMD ["yarn", "start"]
