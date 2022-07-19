/**
 * Returns a function that, when called, catches any error in async callback (for router)
 * @param {function} callback
 * @return {() => Promise<any>}
 */
export default function catchAsync(callback) {
  return (req, res, next) => {
    Promise.resolve(callback(req, res, next)).catch((err) => next(err))
  }
}
