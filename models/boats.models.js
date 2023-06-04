import {datastore as ds} from '../datastore.js';
import {fromDatastore} from '../datastore.js';

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
 * @param {string/null} owner
 * @return {Object} Datastore Object
 */
async function getAllBoats(owner) {
  let query = datastore.createQuery(BOAT).filter('owner', '=', owner).limit(5);
  const results = {};

  if (Object.keys(req.query).includes('cursor')) {
    query = query.start(req.query.cursor);
  }

  const entities = await datastore.runQuery(query);
  results.boats = entities[0].map(ds.fromDatastore);

  if (entities[1].moreResults !== ds.Datastore.NO_MORE_RESULTS) {
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

  datastore.delete(key);
}

/**
 * Returns true if the name already exists in the database.
 * @param {string} name
 * @return {bool}
 */
async function isDuplicateBoatName(name) {
  const nameQuery = datastore.createQuery(BOAT).filter('name', name);
  const matches = await datastore.runQuery(nameQuery);

  if (matches[0].length > 0) {
    return true;
  } else {
    return false;
  }
}

export {
  getBoat,
  postBoat,
  getAllBoats,
  updateBoat,
  deleteBoat,
  isDuplicateBoatName,
};
