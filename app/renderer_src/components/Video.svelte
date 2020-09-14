<script>
  export let stream;
  export let width = null;
  export let height = 720;

  let video;

  $: if (stream && video) {
    video.srcObject = stream;
  };
</script>

<video bind:this={video} {width} {height} autoplay></video>
