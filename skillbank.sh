#!/bin/bash

if [ "$#" -lt 1 ]; then
    echo "Invalid command."
    exit 1
fi

COMMAND=$1
ENVIRONMENT=$2

case $COMMAND in 
    start)
        if [ "$ENVIRONMENT" == "production" ]; then
            docker compose -f compose.yml -f compose.production.yml up --build
        elif [ "$ENVIRONMENT" == "develop" ]; then
            docker compose up --build --watch
        fi
        ;;
    stop)
        docker compose down
        ;;
    migrate)
        docker compose run --rm migrate
        ;;
esac
