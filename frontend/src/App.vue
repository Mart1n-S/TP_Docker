<template>
  <div>
    <button @click="sendData">Envoyer</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      VITE_API_URL: ''
    };
  },
  async created() {
    // Charger les settings dès le démarrage
    await this.loadSettings();
  },
  methods: {
    async loadSettings() {
      try {
        // Récupère le fichier settings.json
        const response = await fetch('/settings.json');
        if (!response.ok) {
          throw new Error(`Erreur HTTP ${response.status}`);
        }
        const settings = await response.json();
        // Assigne l'URL de l'API à la variable
        this.VITE_API_URL = settings.VITE_API_URL;
        console.log(this.VITE_API_URL);
      } catch (error) {
        console.error('Erreur lors du chargement des settings:', error);
      }
    },
    async sendData() {
      if (!this.VITE_API_URL) {
        console.error("URL de l'API non définie.");
        return;
      }
      try {
        const response = await axios.post(`${this.VITE_API_URL}/save`);
        console.log(response.data);
      } catch (error) {
        console.error('Erreur lors de l\'envoi:', error);
      }
    }
  }
}
</script>
