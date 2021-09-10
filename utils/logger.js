function info(...params) {
  console.log(...params);
}

function error(...params) {
  console.error(...params);
}

const logger = {
  info,
  error,
};

module.exports = logger;