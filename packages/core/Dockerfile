FROM node:20

# Set the working directory in container
WORKDIR /home/encre/packages/core

# Copy package.json and package-lock.json
COPY package*.json ./

# Install any needed packages specified in package.json
RUN yarn install

# Bundle app source
COPY . .

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Define environment variable
ENV NODE_ENV testing

RUN yarn build

# Run app when the container launches
CMD ["yarn", "start"]
