FROM node:12.16.1

# Setting working directory. All the path will be relative to WORKDIR
WORKDIR /usr/src/app

# Installing dependencies
COPY package*.json ./

RUN yarn

# Copying source files
COPY . .

ENV ELASTIC=elastic

# Building app
RUN yarn build

# Running the app
CMD [ "yarn", "start" ]