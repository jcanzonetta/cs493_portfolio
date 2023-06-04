/*
 *  Helper Functions
 */

/**
 * Determines if the request has all required parameters.
 * @param {Array} requiredParameters
 * @param {Object} request
 * @return {bool}
 */
function hasAllParameters(requiredParameters, request) {
  let isValid = true;
  requiredParameters.forEach((key) => {
    if (!request.hasOwnProperty(key)) {
      isValid = false;
    }
  });

  return isValid;
}

/**
 * Creates the url for 'self'.
 * @param {Object} req
 * @param {string} id
 * @param {string} baseUrl (optional)
 * @return {string} url of item
 */
function getSelfUrl(req, id, baseUrl) {
  if (baseUrl === undefined) {
    return req.protocol + '://' + req.get('host') + req.baseUrl + '/' + id;
  } else {
    return req.protocol + '://' + req.get('host') + baseUrl + '/' + id;
  }
}

/**
 * Returns true if the name is valid.
 * @param {bool} name
 * @return {bool}
 */
function isValidString(name) {
  if (name.length > 15 || name.length < 1) {
    return false;
  } else if (!isAlphanumeric(name)) {
    return false;
  } else {
    return true;
  }
}

/**
 * Determines if the passed value is a positive integer.
 * @param {any} num
 * @return {bool}
 */
function isPositiveInteger(num) {
  if (Number.isInteger(num) && num > 0) {
    return true;
  } else {
    return false;
  }
}

/**
 * Returns true if the provided string is alphanumeric.
 * @param {string} str
 * @return {bool}
 */
function isAlphanumeric(str) {
  const regex = /^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/;
  return regex.test(str);
}

export {hasAllParameters, getSelfUrl, isValidString, isPositiveInteger};
