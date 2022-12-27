FROM node:16.17.0

WORKDIR /app

COPY package*.json ./

RUN npm install glob rimraf

RUN npm install

COPY . .

EXPOSE 5000
CMD [ "npm", "run", "start:prod" ]