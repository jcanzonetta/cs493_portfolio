import {datastore as ds} from '../datastore.js';
import {fromDatastore} from '../datastore.js';

const datastore = ds.datastore;

const USER = 'User';

/**
 * Saves a user's sub value in Datstore.
 * @param {String} userSub
 * @return {key}
 */
async function postUser(userSub) {
  const key = datastore.key(USER);

  await datastore.save({
    key: key,
    data: {sub: userSub},
  });

  return key;
}

/**
 * Returns a user from Datastore.
 * @param {string} userSub
 * @return {Object} Datastore Object
 */
async function getUser(userSub) {
  const user = datastore.createQuery(USER).filter('sub', '=', userSub);

  if (user[0] === undefined || user[0] === null) {
    return user;
  } else {
    return user.map(fromDatastore);
  }
}

/**
 * Returns an object containting all users.
 * @return {Object} Datastore Object
 */
async function getAllUsers() {
  const query = datastore.createQuery(USER);

  const entities = await datastore.runQuery(query);
  const userArr = entities[0].map(fromDatastore);
  return {users: userArr};
}

export {postUser, getUser, getAllUsers};
