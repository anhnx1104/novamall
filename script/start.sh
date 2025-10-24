#!/bin/bash

if [ $# -eq 0 ]; then
    echo "인자가 없습니다. 스크립트를 호출할 때 인자를 전달해주세요."
    exit 1
elif [ $1 = "stg" ]; then
    echo "Deploy to STG"
    pm2 start ecosystem.config.js --only "novamall-$1"
elif [ $1 = "prod" ]; then
    echo "Deploy to PROD"
    pm2 start ecosystem.config.js --only "novamall-$1"
else
    echo "인자가 잘못되었습니다."
    exit 1
fi
