#!/usr/bin/env bash
docker rm -f serviceswarm_nginx_1 serviceswarm_express_1 serviceswarm_mysql_1
docker rmi -f serviceswarm_nginx serviceswarm_express serviceswarm_mysql
docker tag serviceswarm_nginx tassanai/serviceswarm_nginx:V1
docker tag serviceswarm_express tassanai/serviceswarm_express:V1
docker tag serviceswarm_mysql tassanai/serviceswarm_mysql:V1
docker push tassanai/serviceswarm_nginx
docker push tassanai/serviceswarm_express
docker push tassanai/serviceswarm_mysql