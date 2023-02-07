<template>
  <div class="calendar-view">
    <div class="calendar-view__controls">
      <div class="calendar-view__controls-inner">
        <button class="calendar-view__control-left" type="button" aria-label="Previous month"
          @click="goToPrevMonth"></button>
        <div class="calendar-view__date">{{ headerMonth }}</div>
        <button class="calendar-view__control-right" type="button" aria-label="Next month"
          @click="goToNextMonth"></button>
      </div>
    </div>

    <div class="calendar-view__grid">
      <div v-for="day in currentGrid" :key="day.id" class="calendar-view__cell"
        :class="{ 'calendar-view__cell_inactive': day.inactive }" tabindex="0">
        <div class="calendar-view__cell-day">{{ day.date.getDate() }}</div>
        <div v-if="day.meetups.length" class="calendar-view__cell-content">
          <a v-for="meetup in meetupCache[day.id]" :key="meetup.id" href="/meetups/1" class="calendar-event">{{
            meetup.title
          }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

type Data = {
  activeMonth: Date,
  gridCache: {
    [key: number]: Array<GridDay>
  }
}

type Meetup = {
  id: number;
  date: number;
  title: string;
};

type MeetupCache = {
  [key: string]: Array<Meetup>
}

type GridDay = {
  id: string;
  date: Date;
  inactive: boolean;
  meetups: Array<Meetup>;
};

export default {
  name: 'MeetupsCalendar',

  props: {
    meetups: {
      type: Array<Meetup>,
      required: true,
    },
  },

  data(): Data {
    return {
      activeMonth: this.getFirstDayOfMonth(new Date()),
      gridCache: {},
    };
  },

  computed: {
    prevMonth(): number {
      const prevMonth = this.activeMonth.getMonth() - 1;
      return prevMonth < 0 ? 11 : prevMonth;
    },
    nextMonth(): number {
      const nextMonth = this.activeMonth.getMonth() + 1;
      return nextMonth > 11 ? 0 : nextMonth;
    },
    headerMonth(): string {
      return this.activeMonth.toLocaleDateString(navigator.language, {
        month: 'long',
        year: 'numeric',
      });
    },

    meetupCache(): MeetupCache {
      const cache: MeetupCache = {}
      this.meetups.forEach(meetup => {
        const id = this.getISODate(new Date(meetup.date))

        if (cache[id]) cache[id].push(meetup)
        else cache[id] = [meetup]
      })

      return cache
    },

    currentGrid(): Array<GridDay> {
      if (this.gridCache[this.activeMonth.valueOf()]) {
        return this.gridCache[this.activeMonth.valueOf()];
      }

      return this.createNewGrid()
    },
  },

  methods: {
    createNewGrid(): Array<GridDay> {
      const grid: Array<GridDay> = [];
      const firstDay = this.activeMonth;
      const lastDay = new Date(Date.UTC(this.activeMonth.getFullYear(), this.activeMonth.getMonth() + 1, 0));
      const MS_PER_DAY = 24 * 60 * 60 * 1000;

      let newDay: Date = firstDay;

      // Add current month days
      newDay = firstDay;
      do {
        grid.push(this.createGridDay(newDay));
        newDay = new Date(newDay.getTime() + MS_PER_DAY);
      } while (newDay <= lastDay);

      // Add preceding days
      newDay = firstDay;
      for (let i = newDay.getDay(); i > 1; i--) {
        newDay = new Date(newDay.getTime() - MS_PER_DAY);
        grid.unshift(this.createGridDay(newDay));
      }

      // Add following days
      newDay = lastDay;
      for (let i = newDay.getDay(); i < 7; i++) {
        if (i === 0) break;
        newDay = new Date(newDay.getTime() + MS_PER_DAY);
        grid.push(this.createGridDay(newDay));
      }

      this.gridCache[this.activeMonth.valueOf()] = grid;
      return grid;
    },

    goToPrevMonth(): void {
      this.activeMonth = new Date(Date.UTC(this.activeMonth.getFullYear(), this.activeMonth.getMonth() - 1, 1));
    },
    goToNextMonth(): void {
      this.activeMonth = new Date(Date.UTC(this.activeMonth.getFullYear(), this.activeMonth.getMonth() + 1, 1));
    },

    getFirstDayOfMonth(date: Date): Date {
      return new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1));
    },

    isInactive(date: Date): boolean {
      return date.getMonth() === this.prevMonth || date.getMonth() === this.nextMonth;
    },

    getISODate(date: Date): string {
      return date.toISOString().slice(0, 10)
    },

    createGridDay(date: Date): GridDay {
      return {
        id: this.getISODate(date),
        date,
        inactive: this.isInactive(date),
        meetups: this.meetups.filter((meetup) => {
          const meetupDate = new Date(meetup.date);
          return (
            meetupDate.getFullYear() === date.getFullYear() &&
            meetupDate.getMonth() === date.getMonth() &&
            meetupDate.getDate() === date.getDate()
          );
        })
      }
    }
  },
};
</script>

<style scoped>
.calendar-view {}

.calendar-view__controls {
  text-align: center;
  font-weight: 700;
  font-size: 24px;
  line-height: 1;
  color: var(--blue);
  background-color: var(--blue-extra);
  padding: 24px;
  display: flex;
  justify-content: center;
}

.calendar-view__controls-inner {
  max-width: 325px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  text-transform: capitalize;
}

.calendar-view__controls-inner button {
  border: none;
  padding: 0;
}

.calendar-view__control-left,
.calendar-view__control-right {
  width: 30px;
  height: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  transition: 0.3s all;
  background: url('@/assets/icons/icon-pill-active.svg') left center no-repeat;
  background-size: cover;
}

.calendar-view__control-left:hover,
.calendar-view__control-right:hover {
  opacity: 0.8;
}

.calendar-view__control-right {
  transform: rotate(180deg);
}

.calendar-view__grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
}

.calendar-view__grid {
  border: 1px solid var(--grey);
  border-bottom: none;
}

.calendar-view__cell {
  position: relative;
  height: auto;
  padding: 6px 8px;
  background-color: var(--white);
  color: var(--grey-8);
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  border-bottom: 1px solid var(--grey);
  border-left: 1px solid var(--grey);
  text-align: right;
}

.calendar-view__cell.calendar-view__cell_inactive {
  background-color: var(--grey-light);
}

@media all and (max-width: 767px) {
  .calendar-view__cell:nth-child(5n + 1) {
    border-left: none;
  }
}

@media all and (min-width: 767px) {
  .calendar-view__grid {
    grid-template-columns: repeat(7, 1fr);
  }

  .calendar-view__cell {
    height: 144px;
  }

  .calendar-view__cell:nth-child(7n + 1) {
    border-left: none;
  }
}

.calendar-event {
  --max-lines: 2;
  --line-height: 16px;

  display: block;
  text-align: left;
  text-decoration: none;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 14px;
  font-weight: 600;
  line-height: var(--line-height);
  color: var(--white);
  padding: 4px 6px;
  border-radius: 2px;
  background-color: var(--blue);
  margin-top: 4px;
}

@media all and (min-width: 767px) {
  .calendar-event {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    max-height: calc(var(--max-lines) * var(--line-height) + 6px);
  }
}
</style>
