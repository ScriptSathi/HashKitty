# syntax = docker/dockerfile:1.4

FROM node:hydrogen-slim

WORKDIR /app
COPY src/ /app/src/
COPY public /app/public/
COPY package.json tsconfig.json /app/
RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm i

ARG API_ENDPOINT
ARG API_PORT
ENV REACT_APP_API_ENDPOINT $API_ENDPOINT
ENV REACT_APP_API_PORT $API_PORT

# RUN useradd -m unpriv
# USER unpriv
# WORKDIR /app

EXPOSE $PORT
CMD npm start