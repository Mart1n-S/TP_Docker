# Utilise une image officielle Node.js
FROM node:18-alpine

# Installe curl et bash
RUN apk add --no-cache curl bash

# Définit le dossier de travail
WORKDIR /app

# Copie les fichiers nécessaires
COPY package*.json ./

# Installe toutes les dépendances (y compris devDependencies)
RUN npm install

# Copie tous les fichiers de l'application
COPY . .

# Définit l'utilisateur (utile pour éviter d'exécuter en root)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup && chown -R appuser:appgroup /app
USER appuser

# Le port ici sert plus à documenter qu'à exposer le port puisqu'on veut rendre le changement de port plus facile via le compose 
# où des variables d'environnement on ne met pas de port ici
# EXPOSE 5173

# Exécute le script bash pour générer settings.json
CMD ["sh", "-c", "bash ./generate-settings.sh && npm run dev"]
