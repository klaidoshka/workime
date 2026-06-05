<script lang="ts">
    import { portal } from "$lib/utils/ui";

  interface Props {
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onClose: () => void;
  }

  let {
    open = $bindable(false),
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    onConfirm: onconfirm,
    onClose: onclose,
  }: Props = $props();

  let dialogElement = $state() as HTMLDialogElement;

  $effect(() => {
    if (dialogElement) {
      if (open && !dialogElement.open) {
        dialogElement.showModal();
      } else if (!open && dialogElement.open) {
        dialogElement.close();
      }
    }
  });

  function handleCancel() {
    open = false;
    onclose?.();
  }

  function handleConfirm() {
    open = false;
    onconfirm?.();
  }

  function handleCancelEvent(e: Event) {
    e.preventDefault();
    handleCancel();
  }
</script>

{#if open}
  <dialog
    bind:this={dialogElement}
    oncancel={handleCancelEvent}
    use:portal
    class="fixed inset-0 m-auto max-w-sm w-full bg-s1 border border-bd rounded-2xl p-5 shadow-2xl
           backdrop:bg-black/40 backdrop:backdrop-blur-sm focus:outline-none">
    <div class="flex flex-col items-center text-center gap-4">
      <div class="flex flex-col gap-1">
        <h3 class="text-base font-semibold text-tx">{title}</h3>
        <p class="text-xs text-tx-dim leading-relaxed">{message}</p>
      </div>

      <div class="grid grid-cols-2 gap-2 w-full mt-2">
        <button
          type="button"
          onclick={handleCancel}
          class="w-full py-2 px-3 text-xs font-medium text-tx-dim bg-s2 border border-bd rounded-xl
                 hover:bg-s3 hover:text-tx transition-all focus:outline-none focus:ring-2 focus:ring-bd">
          {cancelLabel}
        </button>

        <button
          type="button"
          onclick={handleConfirm}
          class="w-full py-2 px-3 text-xs font-medium rounded-xl transition-all focus:outline-none focus:ring-2 bg-ac text-white hover:bg-ac-br focus:ring-ac/30">
          {confirmLabel}
        </button>
      </div>
    </div>
  </dialog>
{/if}
