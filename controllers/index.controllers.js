import express from 'express';
import path from 'path';
import json2html from 'node-json2html';
import {auth} from 'express-openid-connect';

***REMOVED***
***REMOVED***
  ***REMOVED***
***REMOVED***
***REMOVED***

// eslint-disable-next-line new-cap
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended: true}));

const config = {
  authRequired: false,
  auth0Logout: true,
  baseURL: BASEURL,
  clientID: CLIENT_ID,
  issuerBaseURL: 'https://' + DOMAIN,
  secret: CLIENT_SECRET,
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
router.use(auth(config));

router.get('/', async (req, res) => {
  if (req.oidc.isAuthenticated()) {
    const outputJSON = {
      name: req.oidc.user['name'],
      token: req.oidc.idToken,
    };

    const template = [
      {
        '<>': 'div',
        'html': [
          {
            '<>': 'h2',
            'text': 'Your Profile Data:',
            '<>': 'ul',
            'html': [
              {'<>': 'li', 'html': 'name: ${name}'},
              {'<>': 'li', 'html': 'access token: ${token}'},
            ],
          },
        ],
      },
      {
        '<>': 'a',
        'href': 'BASEURL' + 'logout',
        'text': 'Logout',
      },
    ];
    res.send(json2html.render(outputJSON, template));
  } else {
    res.sendFile(path.resolve('./views', './index.loggedOut.views.html'));
  }
});

export {router, DOMAIN};