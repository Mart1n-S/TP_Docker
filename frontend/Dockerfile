# Utilise une image officielle Node.js
FROM node:18-alpine

# Crée un utilisateur non root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Définit le dossier de travail
WORKDIR /app

# Copie les fichiers package.json et package-lock.json (si présents)
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie tous les fichiers du projet
COPY . .

# Change le propriétaire des fichiers copiés pour l'utilisateur 'appuser'
RUN chown -R appuser:appgroup /app

# Donne les bonnes permissions pour les fichiers dans /app
RUN chmod -R 755 /app

# Change l'utilisateur pour exécuter le conteneur sous 'appuser'
USER appuser

# Expose le port
EXPOSE 5000

# Commande de démarrage
CMD ["npm", "run", "dev"]
