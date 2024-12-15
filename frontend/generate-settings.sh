#!/bin/bash

echo "Début du script generate-settings.sh"

# Vérifie si la variable d'environnement VITE_API_URL est définie
if [ -z "$VITE_API_URL" ]; then
  echo "La variable d'environnement VITE_API_URL n'est pas définie !"
  exit 1
fi

# Crée ou écrase le fichier settings.json dans le dossier public
echo "{
  \"VITE_API_URL\": \"$VITE_API_URL\"
}" > ./public/settings.json

echo "Fichier settings.json créé dans le dossier public du projet local."
