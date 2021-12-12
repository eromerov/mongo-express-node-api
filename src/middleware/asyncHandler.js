/**
 * handle errors
 * https://stackoverflow.com/questions/67404243/how-does-this-asynchandler-function-work
 */
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
export default asyncHandler;
