FROM node:18.13.0-alpine3.15 as frontend-builder

WORKDIR /app

RUN npm install -g @angular/cli@17.0.1

COPY package.json /app
RUN npm install
COPY . .

CMD ng serve --host 0.0.0.0 --poll 2000
