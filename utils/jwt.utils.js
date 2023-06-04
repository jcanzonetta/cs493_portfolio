import {expressjwt} from 'express-jwt';
import jwksRsa from 'jwks-rsa';

import {DOMAIN} from '../controllers/index.controllers.js';

const requireJwt = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${DOMAIN}/.well-known/jwks.json`,
  }),

  // Validate the audience and the issuer.
  issuer: `https://${DOMAIN}/`,
  algorithms: ['RS256'],
});

export {requireJwt};
