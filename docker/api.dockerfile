FROM node:16

# create app directory
WORKDIR /app

# app dependencies
COPY package*.json ./

# install nodemon for hot reloading
RUN npm install nodemon -g

# install app dependencies
RUN npm install

# add our source code into the image
COPY /services/api .

# run container command
CMD [ "node", "index.js"]
