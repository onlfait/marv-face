<script>
  import { camera } from "./stores/camera";
  import VideoStream from "./components/VideoStream.svelte";

  $: stream = $camera && $camera.stream;
</script>

{#if stream}
<VideoStream {stream} width={600} />
{:else}
<div>
  Waiting for camera...
</div>
{/if}
