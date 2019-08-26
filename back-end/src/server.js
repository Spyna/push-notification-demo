const app = require("./app");

const port = process.env.PORT || 8080;
const host = process.env.HOSTNAME || "0.0.0.0";

// Launch Node.js server
const server = app.listen(port, host, () => {
  console.log(`Node.js API server is listening on http://${host}:${port}/`);
});

function handleExit(err) {
  if (err) {
    errors.report(err);
  }
  if (options.exit) {
    process.exit();
  }
}

process.on("exit", handleExit.bind(null));
process.on("SIGINT", handleExit.bind(null));
process.on("SIGTERM", handleExit.bind(null));
process.on("uncaughtException", handleExit.bind(null));
