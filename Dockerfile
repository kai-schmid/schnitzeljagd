FROM node:18 as base

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev

# Bundle app source
COPY . .

# install MongoDB
RUN apt-get update && apt-get upgrade -y
RUN apt-get -y install systemctl
RUN wget security.debian.org/debian-security/pool/updates/main/o/openssl/libssl1.1_1.1.1n-0+deb11u5_amd64.deb
RUN dpkg -i libssl1.1_1.1.1n-0+deb11u5_amd64.deb
RUN apt-get install curl apt-transport-https software-properties-common gnupg2 -y
RUN wget -qO - https://pgp.mongodb.com/server-7.0.asc | apt-key add -
RUN echo "deb http://repo.mongodb.org/apt/debian buster/mongodb-org/7.0 main" | tee /etc/apt/sources.list.d/mongodb-org.list
RUN apt-get -y update
RUN apt-get update && apt-get install mongodb-org -y
EXPOSE 3000
CMD [ "node", "app.js", "&&", "systemctl", "start mongod", "&&", "systemctl", "enable mongod" ]