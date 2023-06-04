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
 * Gets a Datastore Object containing all boats (limit 3).
 * @param {string/null} owner
 * @return {Object} Datastore Object
 */
async function getBoats(owner) {
  const query = datastore.createQuery(BOAT);

  if (owner) {
    query.filter('owner', '=', owner);
  } else {
    query.filter('public', '=', true);
  }

  const entities = await datastore.runQuery(query);
  return entities[0].map(fromDatastore);
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

export {getBoat, postBoat, getBoats, deleteBoat, isDuplicateBoatName};
