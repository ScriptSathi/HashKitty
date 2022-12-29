FROM node:hydrogen-slim

WORKDIR /app
COPY src/ /app/src/
COPY public /app/public/
COPY package.json tsconfig.json /app/
RUN npm i

ARG SERVER_ENDPOINT
ARG API_PORT
ENV REACT_APP_SERVER_ENDPOINT $SERVER_ENDPOINT
ENV REACT_APP_API_PORT $API_PORT

# RUN useradd -m unpriv
# USER unpriv
# WORKDIR /app

EXPOSE $PORT
CMD npm start