import express from 'express';

import {getSelfUrl} from '../utils/general.utils.js';
import {
  postLoad,
  getLoad,
  getAllLoads,
  updateLoad,
  deleteLoad,
} from '../models/loads.models.js';

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

  if (load[0].carrier !== null) {
    load[0].carrier.self = getSelfUrl(req, load[0].carrier.id, 'boats');
  }

  res.status(200).json(load[0]);
});

router.get('/', async (req, res) => {
  if (!req.accepts(['application/json'])) {
    res.status(406).send({Error: 'Response body must be JSON'});
    return;
  }

  const loads = await getAllLoads(req);

  loads.loads.forEach((load) => {
    load.self = getSelfUrl(req, load.id, 'loads');

    if (load.carrier !== null) {
      load.carrier.self = getSelfUrl(req, load.carrier.id, 'boats');
    }
  });

  res.status(200).send(loads);
});

router.patch('/:load_id', async (req, res) => {
  if (!req.accepts(['application/json'])) {
    res.status(406).send({Error: 'Response body must be JSON'});
    return;
  }

  const load = await getLoad(req.params.load_id);
  if (load[0] === undefined || load[0] === null) {
    res.status(404).send({Error: 'No load with this load_id exists'});
    return;
  }

  const item = 'item' in req.body ? req.body['item'] : load[0].item;
  const creationDate =
    'creation_date' in req.body ?
      req.body['creation_date'] :
      load[0].creation_date;
  const volume = 'volume' in req.body ? req.body['volume'] : load[0].volume;

  await updateLoad(load, item, creationDate, volume);

  const updatedLoad = {
    id: load[0].id,
    item: item,
    creation_date: creationDate,
    volume: volume,
    carrier: load[0].carrier,
    self: getSelfUrl(req, load[0].id),
  };

  if (updatedLoad.carrier !== null) {
    updatedLoad.carrier.self = getSelfUrl(req, updatedLoad.carrier.id, 'boats');
  }

  res.status(200).send(updatedLoad);
});

router.put('/:load_id', async (req, res) => {
  if (!req.accepts(['application/json'])) {
    res.status(406).send({Error: 'Response body must be JSON'});
    return;
  }

  const load = await getLoad(req.params.load_id);
  if (load[0] === undefined || load[0] === null) {
    res.status(404).send({Error: 'No load with this load_id exists'});
    return;
  }

  const item = 'item' in req.body ? req.body['item'] : load[0].item;
  const creationDate =
    'creation_date' in req.body ?
      req.body['creation_date'] :
      load[0].creation_date;
  const volume = 'volume' in req.body ? req.body['volume'] : load[0].volume;

  await updateLoad(load, item, creationDate, volume);

  const updatedLoad = {
    id: load[0].id,
    item: item,
    creation_date: creationDate,
    volume: volume,
    carrier: load[0].carrier,
    self: getSelfUrl(req, load[0].id),
  };

  if (updatedLoad.carrier !== null) {
    updatedLoad.carrier.self = getSelfUrl(req, updatedLoad.carrier.id, 'boats');
  }

  res.status(200).send(updatedLoad);
});

router.delete('/:load_id', async (req, res) => {
  const load = await getLoad(req.params.load_id);

  if (load[0] === undefined || load[0] === null) {
    res.status(404).send({Error: 'No load with this load_id exists'});
  } else {
    deleteLoad(load);
    res.status(204).send();
  }
});

export default router;
