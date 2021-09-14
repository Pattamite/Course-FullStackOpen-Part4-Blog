function info(...params) {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params);
  }
}

function error(...params) {
  if (process.env.NODE_ENV !== 'test') {
    console.error(...params);
  }
}

const logger = {
  info,
  error,
};

module.exports = logger;