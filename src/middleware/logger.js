
//Logs to console middleware example (install morgan package instead)

const consoleLogger = (req, res, next) => {

  const { method, protocol, originalUrl } = req;
  const url = `${protocol}://${req.get('host')}${originalUrl}`;

  console.log(`${method} ${url}`);

  next();
};

export default consoleLogger;
