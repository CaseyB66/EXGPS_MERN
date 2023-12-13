const MongoClient = require("mongodb").MongoClient;
const Db = process.env.ATLAS_URI;
const client = new MongoClient(Db,{ monitorCommands: true });
// mongodb://localhost:27017/ 
var _db;
dbName="exgps";
 const evntNm = 'commandStarted'
module.exports = {
  connectToServer: async function () {
    try {
      client.on(evntNm, event => {
        console.log(`received ${evntNm}: ${JSON.stringify(event, null, 2)}`);
      });
      await client.connect();
      _db = client.db(dbName);
      console.log("Successfully connected to MongoDB");
      client.db(dbName).createCollection("tracks",
          {
            validator: {
              $jsonSchema: {
                bsonType: "object",
                title: "Tracks Validation",
                required:["filename"],
               properties: {
                  filename: {
                    bsonType: "string",
                    description: "Name of the input file"
                  },
                  datetime: {
                    bsonType: "date",
                    description: "Date-time track was started."
                  },
                  mode: {
                    bsonType: "string",
                    description: "Bike mode, one of ['Bike', 'xBike', 'IndrBike', 'UNKWN']"
                  },
                  lat: {
                    bsonType: "double",
                    minimum: -360.0,
                    maximum: 360.0,
                    description: "Latitude of starting position"
                  },
                  long: {
                    bsonType: "double",
                    minimum: -360.0,
                    maximum: 360.0,
                    description: "Longitude of starting position"
                  },
                  dist_meter: {
                    bsonType: "double",
                    minimum: 0.0,
                    maximum: 400000,
                    description: "Total distance ridden"
                  }
                }
              }
            },
            validationAction: "warn"
          });
    } catch (err) {
      console.log(`Validator Error:}: ${JSON.stringify(err, null, 2)}`);
    }
  },
  getDb: function () {
    return client.db(dbName);
  }
};