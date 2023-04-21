# # syntax = docker/dockerfile:1.4

# FROM nvidia/cuda:11.7.0-base-ubuntu22.04

# RUN apt update -y
# RUN DEBIAN_FRONTEND=noninteractive TZ=Etc/UTC apt install -y hashcat cuda git curl
# RUN apt install -f

# #RUN git clone https://github.com/hashcat/hashcat.git && cd hashcat && git checkout v6.2.6 && make install -j4

# #install nvm
# RUN curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
# RUN . ~/.nvm/nvm.sh && nvm install v19.8.1

# ENV PATH /bin/versions/node/v19.8.1/bin:$PATH
# ENV NVM_BIN /bin/versions/node/v19.8.1/bin
# ENV NVM_INC /bin/versions/node/v19.8.1/include/node

# WORKDIR /app
# COPY src/ /app/src/
# COPY package.json tsconfig.json /app/
# RUN --mount=type=cache,target=/usr/src/app/.npm \
#     npm set cache /usr/src/app/.npm && \
#     npm i
# RUN npm run compile

# CMD node /app/build/src/index.js

# syntax = docker/dockerfile:1.4

FROM node:hydrogen-slim

WORKDIR /app
COPY src/ /app/src/
COPY package.json tsconfig.json /app/
RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm i
RUN npm run compile

ENV PORT 80

CMD node /app/build/src/index.js
