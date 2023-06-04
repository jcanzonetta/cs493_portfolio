import express from 'express';

import {getSelfUrl} from '../utils/general.utils.js';
import {postLoad, getLoad} from '../models/loads.models.js';

// eslint-disable-next-line new-cap
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended: true}));

router.post('/', async (req, res) => {
  if (!req.accepts(['application/json'])) {
    res.status(406).send({Error: 'Response body must be JSON'});
    return;
  }

  const key = await postLoad(
      req.body.item,
      req.body.creation_date,
      req.body.volume,
  );

  res.status(201).send({
    id: key.id,
    item: req.body.item,
    creation_date: req.body.creation_date,
    volume: req.body.volume,
    carrier: null,
    self: getSelfUrl(req, key.id),
  });
});

router.get('/:load_id', async (req, res) => {
  if (!req.accepts(['application/json'])) {
    res.status(406).send({Error: 'Response body must be JSON'});
    return;
  }

  const load = await getLoad(req.params.load_id);

  if (load[0] === undefined || load[0] === null) {
    res.status(404).send({Error: 'No load with this load_id exists'});
    return;
  }

  load[0].self = getSelfUrl(req, req.params.load_id);
  res.status(200).json(load[0]);
});

export default router;
