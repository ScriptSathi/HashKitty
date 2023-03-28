# [Hashkitty](https://github.com/ScriptSathi/HashKitty)

Hashkitty is another web user interface for Hashcat, fully written in Typescript.

## Disclaimer

This is a first draft so you may encounter bugs

## Prerequisites

- `Hashcat v6.2.6 or later` 
- `Node v18.15.0 or later` 
- `Docker Compose` (for deploying mysql server)

## Install

If you do not have the `Hashcat` binary install, you can use the docker for this. But make sure you have the same version of `Cuda` install on you machine. To check the version in docker image, refere to the [Dockerfile](./hashkitty-server/Dockerfile)

### Docker warning

Due to big changes in the front-end, the front docker is not operationnal, so please keep using the below configuration 

### Basic install

First start the mysql server with the docker compose

```
cd deploy-dev
docker-compose up -d
```

Now, compile the front-end for producton environnement and start it

```
cd hashkitty-front
npm ci
npm run build
npm run preview
```

Then compile the api and start it

```
cd hashkitty-server
npm ci
npm run build
node build/src/index.js
```
