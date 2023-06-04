import {datastore as ds} from '../datastore.js';
import {fromDatastore} from '../datastore.js';

const datastore = ds.datastore;

const LOAD = 'Load';

/**
 * Creates a boat in Datastore.
 * @param {string} item
 * @param {string} creationDate
 * @param {string} volume
 * @return {Object} Datastore Object
 */
async function postLoad(item, creationDate, volume) {
  const key = datastore.key(LOAD);
  const newLoad = {
    item: item,
    creation_date: creationDate,
    volume: volume,
    carrier: null,
  };

  await datastore.save({
    key: key,
    data: newLoad,
  });

  return key;
}

/**
 * Returns a load from Datastore.
 * @param {string} loadId
 * @return {Object} Datastore Object
 */
async function getLoad(loadId) {
  const key = datastore.key([LOAD, parseInt(loadId, 10)]);

  const entity = await datastore.get(key);
  if (entity[0] === undefined || entity[0] === null) {
    return entity;
  } else {
    return entity.map(fromDatastore);
  }
}

/**
 * Gets a Datastore Object containing all loads (limit 5).
 * @return {Object} Datastore Object
 */
async function getAllLoads() {
  let query = datastore.createQuery(LOAD).limit(5);
  const results = {};

  if (Object.keys(req.query).includes('cursor')) {
    query = query.start(req.query.cursor);
  }

  const entities = await datastore.runQuery(query);
  results.loads = entities[0].map(ds.fromDatastore);

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
 * Updates all properties of a load.
 * @param {Object} load Datastore object
 * @param {string} item
 * @param {string} creationDate
 * @param {string} volume
 * @return {Object} Datastore object
 */
function updateLoad(load, item, creationDate, volume) {
  const key = datastore.key([LOAD, parseInt(load[0].id, 10)]);

  const data = {
    item: item,
    creation_date: creationDate,
    volume: volume,
    carrier: load[0].carrier,
  };

  return datastore.save({key: key, data: data});
}

/**
 * Removes a load from Datastore and unloads from it from its carrier
 * if necessary.
 * @param {string} loadId
 */
async function deleteLoad(loadId) {
  const key = datastore.key([LOAD, parseInt(loadId, 10)]);

  datastore.delete(key);
}

export {postLoad, getLoad, getAllLoads, updateLoad, deleteLoad};
