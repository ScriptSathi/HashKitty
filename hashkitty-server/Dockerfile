FROM nvidia/cuda:11.3.0-base-ubuntu20.04

RUN apt update -y
RUN DEBIAN_FRONTEND=noninteractive TZ=Etc/UTC apt install -y hashcat cuda git curl
RUN apt install -f

#RUN git clone https://github.com/hashcat/hashcat.git && cd hashcat && git checkout v6.2.6 && make install -j4

#install nvm
RUN curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
RUN . ~/.nvm/nvm.sh && nvm install v18.12.1

ENV PATH /bin/versions/node/v18.12.1/bin:$PATH
ENV NVM_BIN /bin/versions/node/v18.12.1/bin
ENV NVM_INC /bin/versions/node/v18.12.1/include/node

WORKDIR /app
COPY src/ /app/src/
COPY package.json tsconfig.json /app/
RUN npm i
RUN npm run compile

ARG PORT
ARG PORT $PORT
EXPOSE $PORT

CMD node /app/build/src/index.js
