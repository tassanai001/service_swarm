#!/bin/bash
docker rmi -f nginxlab
docker build -t nginxlab .