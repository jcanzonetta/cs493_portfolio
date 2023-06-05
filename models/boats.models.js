import {datastore as ds} from '../datastore.js';
import {fromDatastore} from '../datastore.js';
import {getLoad, clearLoadCarrier} from './loads.models.js';

const datastore = ds.datastore;

const BOAT = 'Boat';

/*
 *  Boat Models
 */

/**
 * Returns a boat from Datastore.
 * @param {string} boatId
 * @return {Object} Datastore Object
 */
async function getBoat(boatId) {
  const key = datastore.key([BOAT, parseInt(boatId, 10)]);

  const entity = await datastore.get(key);
  if (entity[0] === undefined || entity[0] === null) {
    return entity;
  } else {
    return entity.map(fromDatastore);
  }
}

/**
 * Creates a boat in Datastore.
 * @param {string} name
 * @param {string} type
 * @param {string} length
 * @param {string} sub
 * @return {Object} Datastore Object
 */
async function postBoat(name, type, length, sub) {
  const key = datastore.key(BOAT);
  const newBoat = {
    name: name,
    type: type,
    length: length,
    loads: [],
    owner: sub,
  };

  await datastore.save({
    key: key,
    data: newBoat,
  });

  return key;
}

/**
 * Gets a Datastore Object containing all boats (limit 5).
 * @param {Object} req
 * @param {string} owner
 * @return {Object} Datastore Object
 */
async function getAllBoats(req, owner) {
  let query = datastore.createQuery(BOAT).filter('owner', '=', owner);
  const allBoats = await datastore.runQuery(query);
  const count = allBoats[0].length;
  query.limit(5);
  const results = {};

  if (Object.keys(req.query).includes('cursor')) {
    query = query.start(req.query.cursor);
  }

  const entities = await datastore.runQuery(query);
  results.boats = entities[0].map(fromDatastore);
  results.total = count;

  if (entities[1].moreResults !== datastore.NO_MORE_RESULTS) {
    results.next =
      req.protocol +
      '://' +
      req.get('host') +
      req.baseUrl +
      '?cursor=' +
      entities[1].endCursor;
  }
  return results;
}

/**
 * Updates all properties of a boat.
 * @param {Object} boat Datastore object
 * @param {string} name
 * @param {string} type
 * @param {string} length
 * @return {Object} Datastore object
 */
function updateBoat(boat, name, type, length) {
  const key = datastore.key([BOAT, parseInt(boat[0].id, 10)]);

  const data = {
    name: name,
    type: type,
    length: length,
    loads: boat[0].loads,
    owner: boat[0].owner,
  };

  return datastore.save({key: key, data: data});
}

/**
 * Removes a boat from Datastore and unloads from it carrier if necessary.
 * @param {string} boatId
 */
async function deleteBoat(boatId) {
  const key = datastore.key([BOAT, parseInt(boatId, 10)]);
  const boat = await getBoat(boatId);

  if (boat[0].loads !== null) {
    boat[0].loads.forEach(async (element) => {
      const load = await getLoad(element.id);
      clearLoadCarrier(load);
    });
  }

  datastore.delete(key);
}

/**
 * Removes a load from a boat.
 * @param {Object} boat
 * @param {Object} load
 */
function removeLoadFromBoat(boat, load) {
  const boatKey = datastore.key([BOAT, parseInt(boat[0].id, 10)]);

  const newLoads = boat[0].loads.filter((element) => element.id !== load[0].id);

  datastore.update({
    key: boatKey,
    data: {
      name: boat[0].name,
      type: boat[0].type,
      length: boat[0].length,
      loads: newLoads,
      owner: boat[0].owner,
    },
  });
}

/**
 * Returns true if the name already exists in the database.
 * @param {string} name
 * @return {bool}
 */
async function isDuplicateBoatName(name) {
  const nameQuery = datastore.createQuery(BOAT).filter('name', '=', name);
  const matches = await datastore.runQuery(nameQuery);

  if (matches[0].length > 0) {
    return true;
  } else {
    return false;
  }
}

/**
 * Assigns a load to a boat and updates properties for both in Datastore.
 * @param {string} loadId
 * @param {Object} boat
 */
function putLoad(loadId, boat) {
  const boatKey = datastore.key([BOAT, parseInt(boat[0].id, 10)]);
  boat[0].loads.push({id: loadId});
  datastore.update({
    key: boatKey,
    data: {
      name: boat[0].name,
      type: boat[0].type,
      length: boat[0].length,
      loads: boat[0].loads,
      owner: boat[0].owner,
    },
  });
}

export {
  getBoat,
  postBoat,
  getAllBoats,
  updateBoat,
  deleteBoat,
  removeLoadFromBoat,
  isDuplicateBoatName,
  putLoad,
};
