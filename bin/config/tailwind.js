const purge = !process.argv.includes("--dev");

module.exports = {
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true
  },
  purge: {
    enabled: purge,
    content: ["app/renderer/**/*"]
  }
};
