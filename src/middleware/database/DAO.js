export default class Dao {
  /** */
  static async updateDocument(_db, _collection, query = {}, _data = {}) {
    try {
      return await _db
        .collection(_collection)
        .findOneAndUpdate(query, { $set: _data });
    } catch (error) {}
  }
  /**
   * Save Document
   * @param {*} req
   */
  static async saveDocument(_db, _collection, _data = {}) {
    try {
      const data = await _db.collection(_collection).insertOne(_data);
      return await _db
        .collection(_collection)
        .findOne({ _id: data.insertedId });
    } catch (error) {
      console.log('saveDocument() ERROR: ', error);
    }
  }
  // Get One Document
  static async getDocument(_db, _collection, query = {}) {
    try {
      return await _db.collection(_collection).findOne(query);
    } catch (err) {
      console.log(err.message);
    }
  }
  // Get Many Documents
  static async getDocuments(
    _db,
    _collection,
    query = {},
    limit = 25,
    skip = 0
  ) {
    try {
      return await _db
        .collection(_collection)
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray()
        .then((items) => {
          console.log(`Successfully found ${items.length} documents.`);
          return items;
        })
        .catch((err) => console.error(`Failed to find documents: ${err}`));
    } catch (error) {}
  }
  // Delete Document
  static async deleteDocument(_db, _collection, query = {}) {
    try {
      return await _db.collection(_collection).deleteOne(query);
    } catch (error) {}
  }
  // Delete Many Documents
  static async deleteManyDocuments(_db, _collection, query = {}) {
    try {
      return await _db.collection(_collection).deleteMany(query);
    } catch (error) {}
  }
}
