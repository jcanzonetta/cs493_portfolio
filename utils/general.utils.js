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
    return req.protocol + '://' + req.get('host') + '/' + baseUrl + '/' + id;
  }
}

export {getSelfUrl};
