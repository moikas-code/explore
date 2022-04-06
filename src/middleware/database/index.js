import { MongoClient } from 'mongodb';
import { setUpDb, setUpSchema } from './setupDB';

// var isConnected = false;
export default async function database() {
  try {
    const dockerDB = process.env.fullDockerMongoURI;
    const client = new MongoClient(dockerDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // console.log('Connecting to database...');
    await client.connect().then(() => {
      // console.log('Connected to database');
    });
    var db = await client.db(process.env.DB_NAME);
    await setUpDb(db);
    await setUpSchema(db);

    return db;
  } catch (error) {
    throw error;
  }
}
