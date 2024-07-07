# React Library Book

## Description

Ce projet est une application web basée sur React conçue pour gérer une bibliothèque de livres. Les utilisateurs peuvent consulter, ajouter, mettre à jour et supprimer des entrées de livres. L'application se connecte à un serveur backend qui gère les opérations de la base de données pour stocker et récupérer les informations des livres.

## Installation et Démarrage du Projet

### Frontend (React)

1. **Installation des dépendances** :
    ```bash
    npm install
    ```

2. **Démarrage de l'application** :
    ```bash
    npm start
    ```

### Backend (API)

L'API se trouve dans le dossier `API` du repository.

#### Création de la Base de Données

1. **Exécutez les commandes SQL suivantes pour créer les tables et insérer des données** :

    ```sql
    -- Création de la table `users`
    CREATE TABLE `users` (
      `id` int NOT NULL AUTO_INCREMENT,
      `nom` varchar(100) NOT NULL,
      `prenom` varchar(100) NOT NULL,
      `email` varchar(255) NOT NULL,
      `password` varchar(255) NOT NULL,
      `solde` int DEFAULT '0',
      `iban` char(34) NOT NULL,
      PRIMARY KEY (`id`),
      UNIQUE KEY `email` (`email`),
      UNIQUE KEY `iban` (`iban`)
    ) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

    -- Ajout des utilisateurs
    INSERT INTO users (nom, prenom, email, password, solde, iban) VALUES 
    ('Doe', 'John', 'john.doe@example.com', 'password123', 1000, 'FR7630006000011234567890189'),
    ('Smith', 'Jane', 'jane.smith@example.com', 'password456', 2000, 'DE89370400440532013000');

    -- Création de la table `checkbook_requests`
    CREATE TABLE `checkbook_requests` (
      `id` int NOT NULL AUTO_INCREMENT,
      `user_iban` char(34) NOT NULL,
      `checkbook_type` varchar(50) NOT NULL,
      `request_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      `status` varchar(50) DEFAULT 'Pending',
      PRIMARY KEY (`id`),
      KEY `user_iban` (`user_iban`),
      CONSTRAINT `checkbook_requests_ibfk_1` FOREIGN KEY (`user_iban`) REFERENCES `users` (`iban`)
    ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

    -- Ajout des demandes de chéquier
    INSERT INTO checkbook_requests (user_iban, checkbook_type) VALUES 
    ('FR7630006000011234567890189', 'Standard'),
    ('DE89370400440532013000', 'Premium');
    ```

#### Configuration de l'Environnement Virtuel et Démarrage de l'API

1. **Créer un environnement virtuel** :
    ```bash
    python -m venv venv
    ```

2. **Activer l'environnement virtuel** :
    - Sous Windows :
        ```bash
        venv\Scripts\activate
        ```
    - Sous macOS et Linux :
        ```bash
        source venv/bin/activate
        ```

3. **Installer les dépendances** :
    ```bash
    pip install -r requirements.txt
    ```

4. **Démarrer l'API** :
    ```bash
    python mainbank.py
    ```

## Accès au Projet

Une fois que le frontend et le backend sont démarrés, vous pouvez accéder à l'application web via votre navigateur en ouvrant `http://localhost:8001` et interagir avec l'API backend qui fonctionne sur `http://127.0.0.1:7000`.
