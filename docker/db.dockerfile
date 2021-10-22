FROM node:16

# create app directory
WORKDIR /app

# app dependencies
COPY package*.json ./

# install app dependencies
RUN npm install

# install nodemon for hot reloading
RUN npm install nodemon -g

# add our source code into the image
COPY /services/db .

# run container command
CMD [ "node", "index.js" ]
