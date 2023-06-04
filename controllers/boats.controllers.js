import express from 'express';

import {requiredJwt, checkJwt} from '../utils/jwt.utils.js';
import {
  getBoat,
  postBoat,
  deleteBoat,
  getBoats,
  isDuplicateBoatName,
} from '../models/boats.models.js';
import {getSelfUrl} from '../utils/general.utils.js';

// eslint-disable-next-line new-cap
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended: true}));

/*
 *  Boat Endpoints
 */

router.post('/', requiredJwt, async (req, res) => {
  if (!req.accepts(['application/json'])) {
    res.status(406).send({Error: 'Response body must be JSON'});
    return;
  }

  const duplicateName = await isDuplicateBoatName(req.body.name);
  if (duplicateName) {
    res.status(403).send({Error: 'The requested name is already taken'});
    return;
  }

  const key = await postBoat(
      req.body.name,
      req.body.type,
      req.body.length,
      req.auth.sub,
  );

  res.status(201).send({
    id: key.id,
    name: req.body.name,
    type: req.body.type,
    length: req.body.length,
    loads: [],
    owner: req.auth.sub,
    self: getSelfUrl(req, key.id),
  });
});

router.get('/:boat_id', checkJwt, async (req, res) => {
  if (!req.accepts(['application/json'])) {
    res.status(406).send({Error: 'Response body must be JSON'});
    return;
  }

  const boat = await getBoat(req.params.boat_id);

  if (boat[0] === undefined || boat[0] === null) {
    res.status(404).send({Error: 'No boat with this boat_id exists'});
    return;
  }

  boat[0].self = getSelfUrl(req, req.params.boat_id);
  res.status(200).json(boat[0]);
});

router.get('/', checkJwt, async (req, res) => {
  if (!req.accepts(['application/json'])) {
    res.status(406).send({Error: 'Response body must be JSON'});
    return;
  }

  const boats = await getBoats();

  res.status(200).send(boats);
});

router.delete('/:boat_id', requiredJwt, async (req, res) => {
  const boat = await getBoat(req.params.boat_id);
  if (boat[0] === undefined || boat[0] === null) {
    res.status(403).send({Error: 'No boat with this boat_id exists'});
  } else if (boat[0].owner !== req.auth.sub) {
    res.status(403).send({Error: 'You don\'t own this boat'});
  } else {
    deleteBoat(req.params.boat_id);
    res.status(204).send();
  }
});

export default router;
