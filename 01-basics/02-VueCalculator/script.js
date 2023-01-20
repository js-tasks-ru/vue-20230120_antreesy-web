import { createApp } from './vendor/vue.esm-browser.js';

// Создайте Vue приложение

const app = createApp({
  data() {
    return {
      inputFirst: 0,
      inputSecond: 0,
      operator: null,
    };
  },

  computed: {
    result() {
      switch (this.operator) {
        case 'sum': {
          return this.inputFirst + this.inputSecond;
        }
        case 'subtract': {
          return this.inputFirst - this.inputSecond;
        }
        case 'multiply': {
          return this.inputFirst * this.inputSecond;
        }
        case 'divide': {
          return this.inputFirst / this.inputSecond;
        }
        default:
          return 'Pick an operator';
      }
    },
  },

  methods: {
    changeOperator(event) {
      this.operator = event.target.value;
    },
  },
});

app.mount('#app');
