FROM node:16.15.1-alpine3.14
WORKDIR /opt/app
COPY package.json package-lock.json
RUN npm install
ADD . .
COPY ./dist ./dist
CMD ["npm", "run", "dev"]
