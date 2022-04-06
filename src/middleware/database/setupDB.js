import authModel from '../models/authModel';
import invitationModel from '../models/invitationModel';
import newsModel from '../models/newsModel';
import eventModel from '../models/eventModel';
import resourceModel from '../models/resourcesModel';

export async function setUpSchema(db) {
  await db.command({
    collMod: 'idd_auth',
    validator: authModel,
    validationLevel: 'off', //TODO: turn level to strict when filter options are integrated
    // validationAction: 'error',
  });
  await db.command({
    collMod: 'idd_invitation',
    validator: invitationModel,
    validationLevel: 'off', //TODO: turn level to strict when filter options are integrated
    // validationAction: 'error',
  });
  await db.command({
    collMod: 'idd_news',
    validator: newsModel,
    validationLevel: 'off', //TODO: turn level to strict when filter options are integrated
    // validationAction: 'error',
  });
  await db.command({
    collMod: 'idd_events',
    validator: eventModel,
    validationLevel: 'off', //TODO: turn level to strict when filter options are integrated
    // validationAction: 'error',
  });
  await db.command({
    collMod: 'idd_resources',
    validator: resourceModel,
    validationLevel: 'off', //TODO: turn level to strict when filter options are integrated
    // validationAction: 'error',
  });
}
export async function setUpDb(db) {
  await Promise.all([
    db
      .collection('idd_auth')
      .createIndex({ _id: 1, email: 1, usename: 1 }, { unique: true }),
    db
      .collection('idd_invitation')
      .createIndex({ _id: 1, email: 1 }, { unique: true }),
    db
      .collection('idd_news')
      .createIndex({ _id: 1, title: 1 }, { unique: true }),
    db
      .collection('idd_events')
      .createIndex({ _id: 1, title: 1 }, { unique: true }),
    db
      .collection('idd_resources')
      .createIndex({ _id: 1, name: 1 }, { unique: true }),
  ]);
}
