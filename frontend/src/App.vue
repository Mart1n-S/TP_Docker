<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-8 p-4">
    <!-- Formulaire -->
    <div class="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
      <!-- Messages d'alerte -->
      <div v-if="successMessage"
        class="mb-4 p-3 bg-green-100 text-green-700 rounded transition-opacity duration-500 ease-in-out">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage"
        class="mb-4 p-3 bg-red-100 text-red-700 rounded transition-opacity duration-500 ease-in-out">
        {{ errorMessage }}
      </div>

      <h2 class="text-2xl font-bold mb-6 text-center text-gray-700">
        Formulaire d'ajout d'utilisateur
      </h2>
      <form @submit.prevent="sendData">
        <div class="mb-4">
          <label for="firstName" class="block text-gray-600 font-semibold mb-2">
            Prénom
          </label>
          <input type="text" id="firstName" v-model="formData.firstName" placeholder="Entrez votre prénom"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div class="mb-4">
          <label for="lastName" class="block text-gray-600 font-semibold mb-2">
            Nom
          </label>
          <input type="text" id="lastName" v-model="formData.lastName" placeholder="Entrez votre nom"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button type="submit"
          class="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200">
          Envoyer
        </button>
      </form>
    </div>

    <!-- Tableau des utilisateurs -->
    <div class="bg-white shadow-md rounded-lg p-8 w-full max-w-4xl">
      <h2 class="text-2xl font-bold mb-6 text-center text-gray-700">
        Liste des utilisateurs
      </h2>
      <div v-if="users.length === 0" class="text-center text-gray-500">
        Aucun utilisateur
      </div>
      <table v-else class="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr class="bg-gray-100">
            <th class="border border-gray-300 px-4 py-2">ID</th>
            <th class="border border-gray-300 px-4 py-2">Prénom</th>
            <th class="border border-gray-300 px-4 py-2">Nom</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td class="border border-gray-300 px-4 py-2">{{ user.id }}</td>
            <td class="border border-gray-300 px-4 py-2">{{ user.firstName }}</td>
            <td class="border border-gray-300 px-4 py-2">{{ user.lastName }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<script>
import axios from "axios";

export default {
  data() {
    return {
      VITE_API_URL: "",
      successMessage: "",
      errorMessage: "",
      formData: {
        firstName: "",
        lastName: "",
      },
      users: [],
      retryInterval: 5,
      maxRetries: 30,
    };
  },
  async created() {
    await this.loadSettings();
    if (this.VITE_API_URL) {
      await this.retryFetchBackend(); // Vérifie la disponibilité du backend
    } else {
      this.showMessage("error", "URL de l'API non définie.");
    }
  },
  methods: {
    async loadSettings() {
      try {
        // Récupérer les settings depuis le fichier settings.json
        const response = await fetch("/settings.json");
        if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);
        const settings = await response.json();
        // Assigne l'URL de l'API à la variable
        this.VITE_API_URL = settings.VITE_API_URL;
        console.log(this.VITE_API_URL);
      } catch (error) {
        console.error("Erreur lors du chargement des settings:", error);
      }
    },
    showMessage(type, message) {
      if (type === "success") {
        this.successMessage = message;
        setTimeout(() => {
          this.successMessage = "";
        }, 3000); // 3 secondes
      } else if (type === "error") {
        this.errorMessage = message;
        setTimeout(() => {
          this.errorMessage = "";
        }, 3000);
      }
    },
    async sendData() {
      if (!this.VITE_API_URL) {
        this.showMessage("error", "URL de l'API non définie.");
        console.error("URL de l'API non définie.");
        return;
      }
      try {
        const response = await axios.post(`${this.VITE_API_URL}/users`, {
          firstName: this.formData.firstName,
          lastName: this.formData.lastName,
        });
        this.showMessage("success", response.data || "Données envoyées avec succès !");
        this.fetchUsers();
        confetti({
          particleCount: 300,
          spread: 90,
          colors: ["#ff0000", "#00ff00", "#0000ff", "#ff00ff", "#ffff00"],
          ticks: 100,
        });
        this.formData.firstName = "";
        this.formData.lastName = "";
      } catch (error) {
        this.showMessage("error", "Une erreur est survenue lors de l'envoi.");
        console.error("Erreur lors de l'envoi:", error);
      }
    },
    async fetchUsers() {
      if (!this.VITE_API_URL) {
        this.showMessage("error", "URL de l'API non définie.");
        console.error("URL de l'API non définie.");
        return;
      }
      try {
        const response = await axios.get(`${this.VITE_API_URL}/users`);
        this.users = response.data;
      } catch (error) {
        this.showMessage("error", "Erreur lors de la récupération des utilisateurs.");
        console.error("Erreur lors de la récupération des utilisateurs:", error);
      }
    },
    async retryFetchBackend() {
      let attempts = 0;
      let remainingSeconds = this.retryInterval;
      let interval = null;

      const checkBackend = async () => {
        if (!this.VITE_API_URL) {
          console.error("URL de l'API non définie. Tentative échouée.");
          this.showMessage("error", "URL de l'API non définie.");
          return false;
        }

        try {
          const response = await axios.get(`${this.VITE_API_URL}/health`);
          if (response.status === 200 && response.data === "OK") {
            this.errorMessage = ""; // Supprime le message d'erreur
            this.showMessage("success", "Backend disponible !");
            await this.fetchUsers();
            return true;
          }
        } catch (error) {
          attempts++;
          if (attempts >= this.maxRetries) {
            this.errorMessage = "Le backend est toujours indisponible après plusieurs tentatives.";
            return false;
          }

          // Mettre à jour dynamiquement les secondes restantes
          remainingSeconds = this.retryInterval;
          this.errorMessage = `Backend non disponible. Nouvelle tentative dans ${remainingSeconds} secondes. (${attempts}/${this.maxRetries})`;

          // Nettoyer tout interval existant avant d'en créer un nouveau
          if (interval) clearInterval(interval);

          interval = setInterval(() => {
            remainingSeconds--;
            if (remainingSeconds <= 0) {
              clearInterval(interval);
            } else {
              this.errorMessage = `Backend non disponible. Nouvelle tentative dans ${remainingSeconds} secondes. (${attempts}/${this.maxRetries})`;
            }
          }, 1000);

          // Attendre avant la prochaine tentative
          await new Promise((resolve) => setTimeout(resolve, this.retryInterval * 1000));

          // Relancer le check
          return checkBackend();
        }
      };

      const success = await checkBackend();

      // Nettoyer l'interval à la fin
      if (interval) clearInterval(interval);

      // Si le backend devient disponible, supprimer tous les messages d'erreur
      if (success) {
        this.errorMessage = "";
      }
    }


  },
};
</script>
