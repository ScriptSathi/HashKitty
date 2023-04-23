# Docker install

## Prerequesites

**For NVIDIA**
If you want to install the API inside a docker container, you'll need to bind your GPU to the container. So for this, nvidia must be fonctionnal at first, and then you need to install an additional package for docker `nvidia-container-toolkit`.

### Check NVIDIA is working and set the correct version

To check if nvidia is correctly installed and also grab the exact driver version, type the below command

```
$ nvidia-smi

# Output should look like this
+---------------------------------------------------------------------------------------+
| NVIDIA-SMI 530.41.03              Driver Version: 530.41.03    CUDA Version: 12.1     |
|-----------------------------------------+----------------------+----------------------+
```

So the exact version I have is `CUDA Version: 12.1`, this is the image you need to set in the [API Dockerfile](./hashkitty-server/Dockerfile)
For example in this case, according to the available tags for [Cuda container](https://hub.docker.com/r/nvidia/cuda/tags)
```
FROM nvidia/cuda:12.1.0-base-ubuntu20.04
```

### Install the docker plugin for NVIDIA

The below plugin is needed to bind you GPU to the docker container which can then be used by Hashcat.

```
sudo apt install nvidia-container-toolkit
```

## Install

Based on the version you want to deploy, production or developpement, both of the compose are present.

The installation process is in 2 steps:
- Build and start the docker-compose
- Add the traefik endpoint to the `/etc/hosts` file

The docker composes are all-in-one configurations. It mount all the services inside the same network. But if you want to split your API and frontend to different endpoints, make sure to change the [frontend environnement variables](./hashkitty-front//docker/.env) and also the docker compose environnement variables.

### Deploy for production

Traefik configuration is also provided to make it easier to deploy. Refer to the [documentation](https://doc.traefik.io/traefik/) for more configurations.

To start the docker compose, jump into the wanted directory and run

```
docker-compose -p hashkitty up -d
```

### Deploy for developpement

If you want to contribute or simply want to try in test mode first, this docker compose mount the code as [volumes](https://docs.docker.com/storage/volumes/) inside the containers. 

For the frontend developpement, it will automatically recompile the code, so you won't need to restart the container. But for the API, it is necessary to do so.

**This is why i do not recommand to use the API inside a docker container for developpement**. The best solution is to run the API on you localhost and configure the frontend to connect to it.

Traefik configuration is also provided to make it easier to deploy. Refer to the [documentation](https://doc.traefik.io/traefik/) for more configurations.

To start the docker compose, jump into the wanted directory and run

```
docker-compose -p hashkitty up -d
```

## Add traefik to `/etc/hosts`

If you did not change the default endpoints and ips, the line you need to add to your hosts file should look like this

```
# Add this inside your /etc/hosts file
172.123.0.2     traefik.lan  api.hashkitty.lan  hashkitty.lan
```