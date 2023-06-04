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
async function getBoats() {
  let query = datastore.createQuery(BOAT).limit(5);
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
