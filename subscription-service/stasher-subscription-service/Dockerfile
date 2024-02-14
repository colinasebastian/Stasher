FROM --platform=linux/amd64 node:18.9.0
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN ls
EXPOSE 6061

CMD [ "node", "-r", "newrelic", "index.js" ]