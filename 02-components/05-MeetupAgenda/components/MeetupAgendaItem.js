import { defineComponent } from '../vendor/vue.esm-browser.js';
import { agendaItemIcons, agendaItemDefaultTitles } from '../meetupService.js';

export default defineComponent({
  name: 'MeetupAgendaItem',

  agendaItemIcons,
  agendaItemDefaultTitles,

  props: {
    agendaItem : {
      type: Object
      // {
      //   id: Number,
      //   startsAt: String,
      //   endsAt: String,
      //   type: String,
      //   title: String,
      //   description: String,
      //   speaker: String,
      //   language: String,
      // }
    }},

  template: `
    <div class="agenda-item">
      <div class="agenda-item__col">
        <img
          class="icon"
          :src="\`../../assets/icons/icon-\${this.$options.agendaItemIcons[this.agendaItem.type]}.svg\`"
          :alt="$options.agendaItemIcons[agendaItem.type]" />
      </div>
      <div class="agenda-item__col">
        {{ agendaItem.startsAt }} - {{ agendaItem.endsAt }}
      </div>
      <div class="agenda-item__col">
        <h3 class="agenda-item__title">
          {{ agendaItem.title ?? $options.agendaItemDefaultTitles[agendaItem.type] }}
        </h3>
        <p class="agenda-item__talk" v-if="agendaItem.type === 'talk'">
          <span> {{ agendaItem.speaker }} </span>
          <span class="agenda-item__dot"></span>
          <span class="agenda-item__lang">{{ agendaItem.language }}</span>
        </p>
        <p>{{ agendaItem.description }}</p>
      </div>
    </div>`,
});
