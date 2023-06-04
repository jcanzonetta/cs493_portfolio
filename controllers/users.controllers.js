import express from 'express';
import {getAllUsers} from '../models/users.models.js';

// eslint-disable-next-line new-cap
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended: true}));

router.get('/', async (req, res) => {
  if (!req.accepts(['application/json'])) {
    res.status(406).send({Error: 'Response body must be JSON'});
    return;
  }

  const users = await getAllUsers();
  res.status(200).send(users);
});

export default router;
