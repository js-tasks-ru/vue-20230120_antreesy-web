<template>
  <div class="toast" :class="`toast_${toastType}`">
    <ui-icon class="toast__icon" :icon="iconType" />
    <span>{{ message }}</span>
    <button v-if="canClose" class="toast__button" @click="closeToast">close</button>
  </div>
</template>

<script lang="ts">
import UiIcon from './UiIcon.vue';

export default {
  name: 'ToastBubble',

  components: { UiIcon },

  props: {
    toastType: {
      type: String,
      required: true,
      validator(value: string): boolean {
        return ['success', 'error'].includes(value);
      },
    },
    message: {
      type: String,
      required: true,
    },
    canClose: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['close'],

  computed: {
    iconType(): string {
      if (this.toastType === 'success') return 'check-circle';
      return 'alert-circle';
    },
  },

  methods: {
    closeToast(): void {
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
.toasts {
  position: fixed;
  bottom: 8px;
  right: 8px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  white-space: pre-wrap;
  z-index: 999;
}

@media all and (min-width: 992px) {
  .toasts {
    bottom: 72px;
    right: 112px;
  }
}

.toast {
  display: flex;
  flex: 0 0 auto;
  flex-direction: row;
  align-items: center;
  padding: 16px;
  background: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  font-size: 18px;
  line-height: 28px;
  width: auto;
}

.toast + .toast {
  margin-top: 20px;
}

.toast__icon,
.toast > span:not(:last-child) {
  margin-right: 12px;
}

.toast.toast_success {
  color: var(--green);
}

.toast.toast_error {
  color: var(--red);
}

.toast__button {
  margin-left: auto;
  padding: 2px;
  border: 1px solid var(--red);
  border-radius: 4px;
  background-color: transparent;
  color: var(--red);
}

.toast__button:hover {
  background-color: var(--red);
  color: #ffffff;
}
</style>
