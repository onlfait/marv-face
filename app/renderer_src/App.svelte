<script>
  import { camera } from "./stores/camera";
  import Video from "./components/Video.svelte";

  $: stream = $camera && $camera.stream;
</script>

{#if stream}
<Video {stream} height={200} />
{:else}
<div>
  Waiting for camera...
</div>
{/if}
