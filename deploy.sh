#!/bin/bash

echo "Begin automated deployment..."

echo "DATABASE_URL=postgresql://postgres:yourpassword@survey-gallery-db:5432/nest?schema=public" >>  ./backend/.env
echo "JWT_SECRET=jwtsecret" >>  ./backend/.env

echo "REACT_APP_API_HOST=http://77.221.139.160:5000" >>  ./frontend/.env

docker build backend -t survey-gallery-backend

docker build frontend -t survey-gallery-frontend

docker compose up -d