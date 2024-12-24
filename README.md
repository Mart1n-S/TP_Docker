<h1> 📘 Guide de Déploiement</h1>

<h2> 📑 Sommaire </h2>

- [Prérequis](#prérequis)
- [Étapes pour construire et déployer](#étapes-pour-construire-et-déployer)
  - [1️⃣ **Construire les images Docker**](#1️⃣-construire-les-images-docker)
  - [2️⃣ **Configurer les variables d'environnement**](#2️⃣-configurer-les-variables-denvironnement)
    - [Windows](#windows)
    - [Linux / macOS](#linux--macos)
  - [3️⃣ **Initialiser Docker Swarm**](#3️⃣-initialiser-docker-swarm)
  - [4️⃣ **Créer les secrets Docker**](#4️⃣-créer-les-secrets-docker)
  - [5️⃣ **Déployer la stack Docker Swarm**](#5️⃣-déployer-la-stack-docker-swarm)
  - [6️⃣ **Mettre à l’échelle un service**](#6️⃣-mettre-à-léchelle-un-service)
- [URL des services](#url-des-services)
- [🔧 Utilisation de Portainer pour gérer votre cluster Docker](#-utilisation-de-portainer-pour-gérer-votre-cluster-docker)
  - [Accéder à Portainer](#accéder-à-portainer)
  - [Gérer les réplicas avec Portainer](#gérer-les-réplicas-avec-portainer)
- [Configuration des sondes avec Uptime Kuma](#configuration-des-sondes-avec-uptime-kuma)
  - [Introduction](#introduction)
  - [Étapes de configuration](#étapes-de-configuration)
    - [1. Connexion à Uptime Kuma](#1-connexion-à-uptime-kuma)
    - [2. Ajouter une sonde pour le Backend](#2-ajouter-une-sonde-pour-le-backend)
    - [3. Ajouter une sonde pour le Frontend](#3-ajouter-une-sonde-pour-le-frontend)
    - [4. Ajouter une sonde pour la Base de Données](#4-ajouter-une-sonde-pour-la-base-de-données)
- [Commandes utiles](#commandes-utiles)
  - [Afficher les stacks](#afficher-les-stacks)
  - [Afficher l’état des services](#afficher-létat-des-services)
  - [Mettre à jour les variables d’environnement](#mettre-à-jour-les-variables-denvironnement)
  - [Arrêter la stack](#arrêter-la-stack)
  - [Supprimer les secrets](#supprimer-les-secrets)
  - [Supprimer les variables d'environnement](#supprimer-les-variables-denvironnement)
    - [Windows](#windows-1)
    - [Linux / macOS](#linux--macos-1)
  - [Vérifier l'état des healthchecks d'un conteneur](#vérifier-létat-des-healthchecks-dun-conteneur)

# Prérequis
1. Avoir **Docker Desktop** et **Docker Compose** installés sur votre machine.

---

# Étapes pour construire et déployer

## 1️⃣ **Construire les images Docker**

Commencez par construire les images nécessaires pour le frontend et le backend. Depuis la racine du projet, exécutez :

```bash
docker build -t frontend-vue ./frontend
docker build -t backend-node ./backend
```

## 2️⃣ **Configurer les variables d'environnement**
Si nécessaire, personnalisez les ports ou d'autres paramètres. Voici tout ce qui est paramétrable avec les variables d'environnement :
> **NOTE :** Les valeurs données ci-dessous sont les valeurs par défaut si vous ne définissez pas vous-mêmes les variables d'environnement. Compose utilisera celles-ci par défaut.

### Windows
```powershell
# Configuration des ports des containers
$env:FRONTEND_PORT="5173"
$env:BACKEND_PORT="3000"
$env:PHPMYADMIN_PORT="80"
$env:PORTAINER_PORT="9000"
$env:KUMA_PORT="3001"

# Configuration des ports de votre machine
$env:MACHINE_FRONTEND_PORT="5173"
$env:MACHINE_BACKEND_PORT="3000"
$env:MACHINE_PHPMYADMIN_PORT="80"
$env:MACHINE_PORTAINER_PORT="9000"
$env:MACHINE_KUMA_PORT="3001"

# Si en prod, possibilité de changer l'hôte à un seul endroit
$env:HOST="http://localhost"
```
> **INFO :** Si vous avez initialisé des variables d'environnement, vous pouvez vérifier qu'elles ont bien été prises en compte :
```bash
$env:FRONTEND_PORT
$env:BACKEND_PORT
...
```

### Linux / macOS
```bash
export FRONTEND_PORT=5173
export BACKEND_PORT=3000
export PHPMYADMIN_PORT=80
export PORTAINER_PORT=9000
export KUMA_PORT=3001

export MACHINE_FRONTEND_PORT=5173
export MACHINE_BACKEND_PORT=3000
export MACHINE_PHPMYADMIN_PORT=80
export MACHINE_PORTAINER_PORT=9000
export MACHINE_KUMA_PORT=3001

export HOST=http://localhost

# Pour vérifier
echo $FRONTEND_PORT
echo $BACKEND_PORT
...
```

## 3️⃣ **Initialiser Docker Swarm**
Ensuite, mettez en place Docker Swarm :
```bash
docker swarm init
```

## 4️⃣ **Créer les secrets Docker**

Si vous voulez modifier les identifiants de connexion à la base de données, modifiez ce qui se trouve dans les différents fichiers texte, puis créez les secrets :

```bash
docker secret create mysql_database secrets/mysql_database.txt

docker secret create mysql_root_password secrets/mysql_root_password.txt

docker secret create mysql_user_password secrets/mysql_user_password.txt

docker secret create mysql_user secrets/mysql_user.txt
```
> **INFO :** Pour vérifier que les secrets ont bien été pris en compte :
```bash
docker secret ls
```

## 5️⃣ **Déployer la stack Docker Swarm**

Une fois les images construites et les secrets créés, déployez la stack :

```bash
docker stack deploy -c compose.yml <nom_de_la_stack>

#Exemple :
docker stack deploy -c compose.yml projet-docker
```

## 6️⃣ **Mettre à l’échelle un service**

Par défaut, ce service a 0 réplicas. Pour activer **phpMyAdmin** en augmentant les réplicas, utilisez la commande suivante :
```bash
docker service scale <nom_de_la_stack>_phpmyadmin=1

#Exemple:
docker service scale projet-docker_phpmyadmin=1
```

---

# URL des services
Une fois le déploiement terminé, vous pouvez accéder aux différents services via les URL suivantes (en supposant que vous avez utilisé les valeurs par défaut pour les ports, sinon remplacez les ports par ceux de votre configuration) :

> **Frontend (Vue.js ou autre framework)** : [http://localhost:5173](http://localhost:5173)

> **Backend (API ou serveur Node.js, etc.)** : [http://localhost:3000](http://localhost:3000)

> **phpMyAdmin (gestion de base de données MySQL)** : [http://localhost:80](http://localhost:80)

> **Portainer (interface de gestion de Docker)** : [http://localhost:9000](http://localhost:9000)


# 🔧 Utilisation de Portainer pour gérer votre cluster Docker

Portainer est une interface de gestion Docker très pratique qui permet de superviser et gérer vos containers, images, volumes, réseaux et stacks de manière intuitive. Une fois que vous avez déployé votre stack avec Docker Swarm, vous pouvez utiliser Portainer pour effectuer diverses actions de gestion, comme l'augmentation du nombre de réplicas de vos services.

## Accéder à Portainer
Une fois que vous avez démarré vos services Docker, vous pouvez accéder à Portainer via l'URL suivante :

- **Portainer (interface de gestion de Docker)** : [http://localhost:9000](http://localhost:9000)

## Gérer les réplicas avec Portainer

Une des fonctionnalités utiles de Portainer est la possibilité de mettre à l’échelle vos services, par exemple, augmenter le nombre de réplicas d'un service. Voici comment procéder :

1. **Se connecter à Portainer** : Accédez à Portainer à l'adresse `http://localhost:9000` et connectez-vous avec vos identifiants.
2. **Accéder à votre Stack Docker** : Dans l'interface de Portainer, choisissez votre environnement et allez dans la section **"Stacks"** pour voir la liste des stacks déployées.
3. **Sélectionner votre stack** : Cliquez sur la stack que vous souhaitez gérer.
4. **Modifier le nombre de réplicas** : Dans la section des services de votre stack, vous pouvez voir les services déployés. Pour augmenter le nombre de réplicas d'un service (par exemple, pour phpMyAdmin), il suffit de modifier le champ **"Replicas"** et d'indiquer le nombre de réplicas souhaité.
5. **Appliquer les changements** : Une fois les réplicas modifiés, cliquez sur **"Deploy the stack"** pour appliquer les changements. Docker Swarm mettra automatiquement à l’échelle votre service en fonction des nouvelles valeurs spécifiées.

# Configuration des sondes avec Uptime Kuma

## Introduction
Ce guide explique comment configurer **Uptime Kuma** pour surveiller les différents services du projet Docker, à savoir le backend (node), le frontend (vuejs), et la base de données (MySQL).

---

## Étapes de configuration

### 1. Connexion à Uptime Kuma
1. Une fois la stack lancée, allez sur l'URL suivante (en supposant que vous avez utilisé la valeur par défaut pour le port, sinon remplacez le port par celui de votre configuration) :
   
   **Uptime Kuma** : [http://localhost:3001](http://localhost:3001)
2. Connectez-vous avec des identifiants, par exemple :
   > **Nom d'utilisateur :** admin

   > **Mot de passe :** adminPassword
   
3. Une fois connecté, cliquez sur le bouton **Add New Monitor** (ou **Ajouter un nouveau moniteur**).

---

### 2. Ajouter une sonde pour le Backend
- **Type de moniteur** : HTTP(s).
- **Nom** : `Backend`.
- **URL** *(vérifiez que cette URL pointe bien vers votre backend)* : http://backend:3000/health  
- **Méthode HTTP** : `GET`.
- **Intervalle** : 60 secondes (modifiable selon vos besoins).
- Cliquez sur **Save**.
  
---

### 3. Ajouter une sonde pour le Frontend
- **Type de moniteur** : HTTP(s).
- **Nom** : `Frontend`.
- **URL** *(vérifiez que cette URL pointe bien vers votre frontend)* : http://frontend:5173  
- **Méthode HTTP** : `GET`.
- **Intervalle** : 60 secondes.
- Cliquez sur **Save**.

---

### 4. Ajouter une sonde pour la Base de Données
- **Type de moniteur** : TCP.
- **Nom** : `BDD`.
- **Adresse/Host** : `db`.
- **Port** : `3306`.
- **Intervalle** : 60 secondes.
- Cliquez sur **Save**.

---

# Commandes utiles

## Afficher les stacks
```bash
docker stack ls
```
## Afficher l’état des services
```bash
docker service ls
```

## Mettre à jour les variables d’environnement
Pour modifier une variable d’environnement comme le port du frontend :
```bash
$env:MACHINE_FRONTEND_PORT="5173"

docker stack deploy -c compose.yml <nom_de_la_stack>
```

## Arrêter la stack
```bash
docker stack rm <nom_de_la_stack>

# Exemple:
docker stack rm projet-docker
```

## Supprimer les secrets
```bash
docker secret rm mysql_root_password mysql_database mysql_user mysql_user_password
```
## Supprimer les variables d'environnement 

### Windows
```powershell
Remove-Item Env:FRONTEND_PORT
Remove-Item Env:BACKEND_PORT
Remove-Item Env:PHPMYADMIN_PORT
Remove-Item Env:PORTAINER_PORT
Remove-Item Env:KUMA_PORT

Remove-Item Env:MACHINE_FRONTEND_PORT
Remove-Item Env:MACHINE_BACKEND_PORT
Remove-Item Env:MACHINE_PHPMYADMIN_PORT
Remove-Item Env:MACHINE_PORTAINER_PORT
Remove-Item Env:MACHINE_KUMA_PORT

Remove-Item Env:HOST
```

### Linux / macOS
```bash
unset FRONTEND_PORT
unset BACKEND_PORT
unset PHPMYADMIN_PORT
unset PORTAINER_PORT
unset KUMA_PORT

unset MACHINE_FRONTEND_PORT
unset MACHINE_BACKEND_PORT
unset MACHINE_PHPMYADMIN_PORT
unset MACHINE_PORTAINER_PORT
unset MACHINE_KUMA_PORT

unset HOST
```

## Vérifier l'état des healthchecks d'un conteneur
```bash
docker inspect --format='{{json .State.Health}}' <container_name_or_id>
```

--- 