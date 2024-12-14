<template>
  <div>
    <button @click="sendData">Envoyer</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  methods: {
    async sendData() {
      try {
        const response = await axios.post('http://localhost:3000/save');
        console.log(response.data);
      } catch (error) {
        console.error('Erreur lors de l\'envoi:', error);
      }
    }
  }
}
</script>
