const db = require('firebase-admin/firestore').getFirestore();
const rootRef = db;

/**
 * Clears a collection from all its documents and sub-collections.
 * @param collectionClass model class of the collection to be cleared
 * @param parentRef firestore reference to the parent document if the collection is not top level
 * @returns {Promise<void>}
 */
async function deepClearCollection(collectionClass, parentRef = rootRef) {
  const batch = db.batch();
  const docs = await parentRef
    .collection(collectionClass._COLLECTION_NAME)
    .get();
  for (const doc of docs.docs) {
    for (const subCollectionClass of collectionClass._SUB_COLLECTION_CLASSES)
      await deepClearCollection(subCollectionClass, doc.ref);
    batch.delete(doc.ref);
  }
  await batch.commit();
}

/**
 * Transforms a firestore response to a http response body.
 * @param documentClass model class to which the firestore document response belongs
 * @param firestoreResponse firestore response to getting a document
 * @returns {any} http response body that should we have had if the request was made
 * through the REST API.
 */
function toHttpResponseBody(documentClass, firestoreResponse) {
  return JSON.parse(
    JSON.stringify(documentClass.fromFirestore(firestoreResponse))
  );
}

module.exports.deepClearCollection = deepClearCollection;
module.exports.toHttpResponseBody = toHttpResponseBody;
