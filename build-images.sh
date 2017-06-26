#!/usr/bin/env bash
docker rm -f serviceswarm_nginx_1 serviceswarm_express_1 serviceswarm_mysql_1
docker rmi -f serviceswarm_nginx serviceswarm_express serviceswarm_mysql
docker-compose -f docker-compose-local.yml down
docker-compose -f docker-compose-local.yml up