// a => a && typeof a === "object" && a.constructor === Array, // alt for no ES5
export const isArray = (a) => Array.isArray(a)
export const isObject = (o) => o && typeof o === 'object' && o.constructor === Object
export const isDictionary = (d) => isObject(d) && !isArray(d)

export function deepExtend(...extend) {
  /* eslint-disable guard-for-in,no-restricted-syntax */
  let end = {}
  for (const val of extend) {
    if (isDictionary(val)) {
      // contains dictionary
      if (!isObject(end)) end = {} // change end to {} if end is not object
      for (const k in val) end[k] = deepExtend(end[k], val[k]) // loops through all nested objects
    } else end = val
  }
  return end
  /* eslint-enable guard-for-in,no-restricted-syntax */
}

export const spaceOutCourseCode = (courseCode) => {
  const subject = courseCode.replace(/[1-9]/g, '')
  const course = courseCode.replace(subject, '')
  return `${subject} ${course}`
}

/**
 * Validates block/tx hash
 * @param {string} hash
 * @return {boolean}
 */
export function validateHash(hash) {
  return /^0x([A-Fa-f0-9]{64})$/.test(hash)
}
