FROM node:hydrogen-slim

WORKDIR /app
COPY src/ /app/src/
COPY public /app/public/
COPY package.json tsconfig.json /app/
RUN npm i

# RUN useradd -m unpriv
# USER unpriv
# WORKDIR /app

EXPOSE 3000
CMD npm start