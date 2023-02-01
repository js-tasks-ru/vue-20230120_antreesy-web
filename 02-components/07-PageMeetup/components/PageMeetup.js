import { defineComponent } from '../vendor/vue.esm-browser.js';

import MeetupView from '../../06-MeetupView/components/MeetupView.js';
import UiContainer from './UiContainer.js';
import UiAlert from './UiAlert.js';

import { fetchMeetupById } from '../meetupService.js';

export default defineComponent({
  name: 'PageMeetup',

  components: {
    MeetupView,
    UiAlert,
    UiContainer,
  },

  props: {
    meetupId: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      meetup: null,
      isLoading: true,
      error: null,
    };
  },

  watch: {
    meetupId: {
      immediate: true,
      handler(newId) {
        this.loadMeetupById(newId);
      },
    },
  },

  methods: {
    async loadMeetupById(id) {
      this.isLoading = true;
      this.meetup = null;
      this.error = null;

      try {
        this.meetup = await fetchMeetupById(id);
      } catch (err) {
        this.error = err;
      } finally {
        this.isLoading = false;
      }
    },
  },

  template: `
    <div class="page-meetup">
      <MeetupView v-if="meetup" :meetup='meetup' />

      <UiContainer v-if="isLoading">
        <UiAlert>Загрузка...</UiAlert>
      </UiContainer>

      <UiContainer v-if="error">
        <UiAlert>{{ error.message }}</UiAlert>
      </UiContainer>
    </div>`,
});
