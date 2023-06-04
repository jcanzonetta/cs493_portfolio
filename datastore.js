import {Datastore} from '@google-cloud/datastore';

const datastore = new Datastore();

/**
 *
 * @param {Object} item
 * @return {Object}
 */
function fromDatastore(item) {
  item.id = item[Datastore.KEY].id;
  return item;
}

export {datastore, fromDatastore};
