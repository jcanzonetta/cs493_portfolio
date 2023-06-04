import express from 'express';

import {requireJwt} from '../utils/jwt.utils.js';
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

router.post('/', requireJwt, async (req, res) => {
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

router.get('/:boat_id', requireJwt, async (req, res) => {
  if (!req.accepts(['application/json'])) {
    res.status(406).send({Error: 'Response body must be JSON'});
    return;
  }

  const boat = await getBoat(req.params.boat_id);

  if (boat[0] === undefined || boat[0] === null) {
    res.status(404).send({Error: 'No boat with this boat_id exists'});
    return;
  }

  if (boat[0].owner != req.auth.sub) {
    res.status(401).send({Error: 'Unauthorized'});
    return;
  }

  boat[0].self = getSelfUrl(req, req.params.boat_id);
  res.status(200).json(boat[0]);
});

router.get('/', requireJwt, async (req, res) => {
  if (!req.accepts(['application/json'])) {
    res.status(406).send({Error: 'Response body must be JSON'});
    return;
  }

  const boats = await getBoats(req.auth.sub);

  res.status(200).send(boats);
});

router.patch('/:boat_id', requireJwt, async (req, res) => {
  if (!req.accepts(['application/json'])) {
    res.status(406).send({Error: 'Response body must be JSON'});
    return;
  }

  const boat = await getBoat(req.params.boat_id);
  if (boat[0] === undefined || boat[0] === null) {
    res.status(401).send({Error: 'Unauthorized'});
    return;
  }

  if (req.body.name !== undefined && boat[0].name !== req.body.name) {
    const duplicateName = await isDuplicateBoatName(req.body.name);
    if (duplicateName) {
      res.status(403).send({Error: 'The requested name is already taken'});
      return;
    }
  }

  const name = 'name' in req.body ? req.body['name'] : boat[0].name;
  const type = 'type' in req.body ? req.body['type'] : boat[0].type;
  const length = 'length' in req.body ? req.body['length'] : boat[0].length;

  const key = await updateBoat(boat, name, type, length);
  res.status(200).send({
    id: key.id,
    name: name,
    type: type,
    length: length,
    loads: boat[0].loads,
    owner: boat[0].owner,
    self: getSelfUrl(req, key.id),
  });
});

router.delete('/:boat_id', requireJwt, async (req, res) => {
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
