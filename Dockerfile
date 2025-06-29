# Use the official Node.js 18 LTS image as the base
FROM node:18

# Create and set the working directory
WORKDIR /app

# Copy package.json and package-lock.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Define the command to run the app
CMD ["node", "index.js"]