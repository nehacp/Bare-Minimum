const environment = process.env.NODE_ENV;
const envPath = '.env.' + environment;
const envVars = require('dotenv').config({path: envPath});

console.log('Current database environment: ', environment);


const mysql = require('mysql');
const Sequelize = require('sequelize');

let dbOptions = {
  dialect: 'mysql',
  logging: false
};

if (process.env.DB_HOST) {
  console.log('setting deployment host');
  dbOptions.host = process.env.DB_HOST;
}

if (process.env.DB_PORT) {
  console.log('setting deployment port');
  dbOptions.port = Number(process.env.DB_PORT);
}

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, dbOptions);

//---------SCHEMA DEFINITIONS--------------------

const Users = db.define('Users', {
  name: {type: Sequelize.STRING, unique: true},
  email: {type: Sequelize.STRING, unique: true},
  password: Sequelize.STRING,
  salt: Sequelize.STRING,
  sessionId: Sequelize.STRING
});

const UserTrip = db.define('UserTrip', {
  flightItinerary: Sequelize.TEXT,
  phone: Sequelize.STRING,
  TripId: Sequelize.INTEGER,
  UserId: Sequelize.INTEGER

});

const Trips = db.define('Trips', {
  name: {type: Sequelize.STRING, unique: true},
  location: Sequelize.STRING,
  startDate: Sequelize.STRING,
  endDate: Sequelize.STRING,
  lodging: Sequelize.TEXT,
  accessCode: Sequelize.STRING,
  isopen: Sequelize.BOOLEAN
});

const Votes = db.define('Votes', {
  landmarkId: Sequelize.INTEGER,
  userId: Sequelize.INTEGER
});

const Landmarks = db.define('Landmarks', {
  url: Sequelize.TEXT,
  description: Sequelize.TEXT,
  address: Sequelize.TEXT,
  tripId: Sequelize.INTEGER,
  userId: Sequelize.INTEGER
});

const Expenses = db.define('Expenses', {
  amount: Sequelize.DOUBLE,
  description: Sequelize.TEXT,
  userId: Sequelize.INTEGER,
  tripId: Sequelize.INTEGER
});

const Sessions = db.define('Sessions', {
  sid: {type: Sequelize.STRING, primaryKey: true},
  expires: Sequelize.DATE,
  data: Sequelize.TEXT,
  UserId: Sequelize.INTEGER
});

//Photo Schema
const Photos = db.define('photo', {
  name: Sequelize.STRING,
  path: {
    type: Sequelize.STRING,
    unique: true
  },
  tripId: Sequelize.INTEGER,
  userId: Sequelize.INTEGER
});

// Notifi Schema
const Notifications = db.define('notification', {
  tripId: Sequelize.INTEGER,
  type: Sequelize.STRING,
  contentId: Sequelize.INTEGER
});

const PlacesOfInterest = db.define('placesofinterest', {
  tripId: Sequelize.INTEGER,
  userId: Sequelize.INTEGER,
  lat: Sequelize.FLOAT,
  lng: Sequelize.FLOAT,
  name: Sequelize.STRING,
  place_id: Sequelize.STRING,
  formatted_address: Sequelize.STRING,
  formatted_phone_number: Sequelize.STRING,
  website: Sequelize.STRING,
  status: Sequelize.STRING
});

//Chat Schema
const Chat = db.define('chat', {
  userId: Sequelize.INTEGER,
  tripId: Sequelize.INTEGER,
  message: Sequelize.TEXT,
  username: Sequelize.TEXT,
  sentTo: Sequelize.TEXT
});


//---------SEQUELIZE REQUIRES SYNC ON ALL TABLES------------
Users.sync();
UserTrip.sync();
Trips.sync();
Votes.sync();
Landmarks.sync();
Expenses.sync();
Sessions.sync();
Photos.sync();
Notifications.sync();
PlacesOfInterest.sync();
Chat.sync();

//--------------------FOREIGN KEY SETTINGS -----------------

Users.belongsToMany(Trips, {through: 'UserTrip'});
Trips.belongsToMany(Users, {through: 'UserTrip'});

Users.hasMany(Votes, {foreignkey: 'userId'});
Votes.belongsTo(Users, {foreignkey: 'userId'});

Landmarks.hasMany(Votes, {foreignkey: 'landmarkId'});
Votes.belongsTo(Landmarks, {foreignkey: 'landmarkId'}); 

Users.hasMany(Landmarks, {foreignkey: 'userId'});
Landmarks.belongsTo(Users, {foreignkey: 'userId'});

Trips.hasMany(Landmarks, {foreignkey: 'tripId'});
Landmarks.belongsTo(Trips, {foreignkey: 'tripId'});

Users.hasMany(Expenses, {foreignkey: 'userId'});
Expenses.belongsTo(Users, {foreignkey: 'userId'});

Trips.hasMany(Expenses, {foreignkey: 'tripId'});
Expenses.belongsTo(Trips, {foreignkey: 'tripId'});

Users.hasOne(Sessions, {foreignKey: 'userId'});
Sessions.hasOne(Users, {foreignKey: 'sessionId'});


module.exports = {
  db: db,
  Users: Users,
  UserTrip: UserTrip,
  Trips: Trips,
  Votes: Votes,
  Landmarks: Landmarks,
  Expenses: Expenses,
  Sessions: Sessions,
  Photos: Photos,
  Notifications: Notifications,
  Chat: Chat,
  PlacesOfInterest: PlacesOfInterest
};