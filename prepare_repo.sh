#!/bin/bash

git clone https://github.com/keumul/SurveyGallery.git
cd SurveyGallery || exit 
git checkout feature/script_for_automatic_deployment

sudo chmod +x infrastructure-setup.sh
sudo chmod +x deploy.sh
sudo ./infrastructure-setup.sh
sudo ./deploy.sh 
