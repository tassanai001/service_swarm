#!/usr/bin/env bash
docker tag serviceswarm_nginx tassanai/serviceswarm_nginx:V1
docker tag serviceswarm_express tassanai/serviceswarm_express:V1
docker tag serviceswarm_mysql tassanai/serviceswarm_mysql:V1
docker push tassanai/serviceswarm_nginx
docker push tassanai/serviceswarm_express
docker push tassanai/serviceswarm_mysql