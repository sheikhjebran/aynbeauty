module.exports = {
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
  api: {
    bodyParser: {
      sizeLimit: "100mb",
    },
    responseLimit: "100mb",
  },
};
