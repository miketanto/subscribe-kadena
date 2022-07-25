FROM node:16

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Download node packages
COPY package*.json ./
# install all dependencies (since we use devDepd 'nodemon')
RUN npm install
# npm ci is faster than npm install BUT requires package-lock.json
#RUN npm ci --only=production

# Bundle app source
COPY . .

CMD [ "npm", "run", "deploy-dev" ]
#CMD [ "./node_modules/nodemon/bin/nodemon.js", "src/index.js" ]
