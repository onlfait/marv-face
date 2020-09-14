<script>
  export let stream;
  export let width = null;
  export let height = null;

  let video;

  $: if (stream && video) {
    video.srcObject = stream;

    const track = stream.getVideoTracks()[0];
    const { aspectRatio, ...size } = track.getSettings();

    if (!width && !height) {
      width = size.width;
      height = size.height;
    } else if (!width) {
      width = height * aspectRatio;
    } else if (!height) {
      height = width / aspectRatio;
    }
  };

  $: style = `width:${width}px;height:${height}px;max-width:none;`
</script>

<video bind:this={video} {style} autoplay></video>
