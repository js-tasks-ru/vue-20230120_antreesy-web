import { createApp } from './vendor/vue.esm-browser.js';

const API_URL = 'https://course-vue.javascript.ru/api';

function fetchMeetupById(meetupId) {
  return fetch(`${API_URL}/meetups/${meetupId}`).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      return response.json().then((error) => {
        throw error;
      });
    }
  });
}

// Требуется создать Vue приложение

const app = createApp({
  data() {
    return {
      title: '',
      idList: [1, 2, 3, 4, 5],
      activeId: null,
    };
  },
  watch: {
    activeId() {
      fetchMeetupById(this.activeId).then((res) => (this.title = res.title));
    },
  },
});

app.mount('#app');
