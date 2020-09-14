<script>
  import { camera } from "./stores/camera";
</script>

{#if $camera}
<div>
  {$camera.track.label}
</div>
{:else}
<div>
  Waiting for camera...
</div>
{/if}
