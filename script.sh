#!/bin/bash

echo "Begin automated deployment..."

echo "DATABASE_URL=postgresql://root:meow@dev-db:5432/nest?schema=public" >>  ./backend/.env

docker build backend -t survey-gallery-backend

docker build frontend -t survey-gallery-frontend

docker compose up -d