<template>
  <div class="toasts">
    <ui-toast
      v-for="toast in toasts"
      :key="toast.id"
      :message="toast.message"
      :toast-type="toast.toastType"
      @close="removeToast(toast.id)"
    />
  </div>
</template>

<script lang="ts">
import UiToast from './UiToast.vue';

type Toast = {
  id: number;
  toastType: 'success' | 'error';
  message: string;
};

export default {
  name: 'TheToaster',

  components: { UiToast },

  props: {
    toastDuration: {
      type: Number,
      default: 5000,
    },
  },

  data() {
    return {
      id: 0,
      toasts: [] as Array<Toast>,
    };
  },

  methods: {
    success(message: string): void {
      this.createToast('success', message);
    },

    error(message: string): void {
      this.createToast('error', message);
    },

    createToast(toastType: Toast['toastType'], message: string): void {
      const currentId = this.id;
      this.toasts.push({ id: currentId, toastType, message });
      setTimeout(() => {
        this.removeToast(currentId);
      }, this.toastDuration);
      this.id++;
    },

    removeToast(id: number): void {
      const indexToRemove: number = this.toasts.findIndex((toast) => toast.id === id);
      this.toasts.splice(indexToRemove, 1);
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
</style>
