# [Hashkitty](https://github.com/ScriptSathi/HashKitty)

![GitHub License](https://img.shields.io/github/license/ScriptSathi/HashKitty?style=flat-square)
![GitHub top language](https://img.shields.io/github/languages/top/ScriptSathi/HashKitty?style=flat-square)
![Github commits](https://img.shields.io/github/commit-activity/m/ScriptSathi/HashKitty?style=flat-square)

Hashkitty is another web user interface for Hashcat, fully written in Typescript.

## Disclaimer

The project is currently in **Alpha Version**. It may encounter bugs or any weird behaviours. If you notice any, please submit an issue with as much details as possible.

## Prerequisites

- `Hashcat v6.2.6 or later` 
- `Docker Compose`

## Install

If you want to deploy this project with Docker, please check the [Docker README](DOCKER.md)

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
