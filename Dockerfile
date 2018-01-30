FROM node:8-stretch
WORKDIR /home/node/app

COPY package.json /home/node/app/
RUN npm install

COPY * /home/node/app/

CMD node index.js
