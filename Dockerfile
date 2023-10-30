FROM node:18.10.0-alpine3.15 as frontend-builder

WORKDIR /app

RUN npm install -g @angular/cli@16.2.0

COPY package.json /app
RUN npm install
COPY . .

CMD ng serve --host 0.0.0.0 --poll 2000
