import { defineComponent } from '../vendor/vue.esm-browser.js';

export default defineComponent({
  name: 'MeetupCover',

  props: {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String
    },
  },

  template: `
    <div class="meetup-cover" :style="image ? \`--bg-url: url(\${image})\` : undefined">
        <h1 class="meetup-cover__title">{{ title }}</h1>
    </div>
  `,
});
