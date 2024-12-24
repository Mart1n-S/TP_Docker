# Utilise une image Node.js officielle
FROM node:18-alpine

# Installe curl
RUN apk add --no-cache curl

# Définit le dossier de travail
WORKDIR /app

# Copie les fichiers nécessaires
COPY package*.json ./
COPY index.js ./

# Installe les dépendances
RUN npm install

# Définit un utilisateur non-root
RUN addgroup -S appgroup && adduser -S totoUser -G appgroup && chown -R totoUser:appgroup /app
USER totoUser

# Le port ici sert plus à documenter qu'à exposer le port puisqu'on veut rendre le changement de port plus facile via le compose 
# où des variables d'environnement on ne met pas de port ici
# EXPOSE 3000

# Lancer l'application
CMD ["node", "index.js"]
