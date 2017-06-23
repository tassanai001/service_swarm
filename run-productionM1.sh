#!/usr/bin/env bash
docker rm -f serviceswarm_nginx_1 serviceswarm_express_1 serviceswarm_mysql_1
docker rmi -f serviceswarm_nginx serviceswarm_express serviceswarm_mysql
docker pull tassanai/serviceswarm_nginx
docker pull tassanai/serviceswarm_express
docker pull tassanai/serviceswarm_mysql
docker stack deploy --compose-file docker-compose-master1.yml web_stack