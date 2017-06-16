#!/bin/bash
docker stop nginxlab
docker rm -f nginxlab
docker run -it -p 8091:80 --name nginxlab nginxlab