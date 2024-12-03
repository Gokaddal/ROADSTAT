# Use Node.js image
FROM node:20.9.0

# Set environment variables
ENV VITE_MONGO_URL="mongodb+srv://gokaddalUser:gokaddal_pass@gokaddal.qicnveb.mongodb.net/roadstat?retryWrites=true&w=majority&appName=Gokaddal"
ENV JWT_SECRET="fake-jwt-token"
ENV VITE_API_URL="http://3.91.228.87:3000/api"
ENV VITE_GOOGLE_MAP_API="AIzaSyBSZ3Eyv8164jlCMU5eChvG9ZQ7_E-52Fk"
ENV VITE_OPEN_WEATHER_API="d2a641017dd53f2f6698656f593251ca"

# Set working directory
WORKDIR /app

# Copy package.json files for both Backend and Frontend
COPY package*.json ./

# Copy the Backend and Frontend directories (ensure these exist locally)
COPY Backend /app/Backend
COPY Frontend /app/Frontend

# Install backend dependencies
RUN cd Backend && npm install

# Install frontend dependencies
RUN cd Frontend && npm install

# Install nodemon globally
RUN npm install -g nodemon

# Install nodemon globally
RUN npm install concurrently --save-dev

# Install npm
RUN npm install vite

# Expose application ports
EXPOSE 3000
EXPOSE 5173

# Copy the rest of the application files
COPY . .

# Command to run the application
CMD ["npm", "run", "dev"]
