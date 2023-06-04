import {datastore as ds} from '../datastore.js';
import {fromDatastore} from '../datastore.js';

const datastore = ds.datastore;

const USER = 'User';

/**
 * Returns an object containting all users.
 * @return {Object} Datastore Object
 */
async function getAllUsers() {
  const query = datastore.createQuery(USER);

  const entities = await datastore.runQuery(query);
  return entities[0].map(fromDatastore);
}

export {getAllUsers};
