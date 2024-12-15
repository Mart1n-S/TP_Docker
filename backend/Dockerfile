# Utilise une image Node.js officielle
FROM node:18-alpine

# Crée un utilisateur non root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Définit le dossier de travail
WORKDIR /app

# Copie les fichiers nécessaires
COPY package*.json ./
COPY index.js ./

# Installe les dépendances
RUN npm install

# Change l'utilisateur
USER appuser

# Expose le port
EXPOSE 3000

# Commande de démarrage
CMD ["node", "index.js"]
