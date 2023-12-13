const express = require("express");
// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;
 
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();
 
// This will help us connect to the database
const dbo = require("../db/conn");

// This section will help you get a list of all the records.
recordRoutes.route("/record").get(async function (req, res) {
  const query = {'filename':  {'$regex': '\.*', '$options': 'i'}};
  console.log("record.js looking for employees using dbo", query);
  let db_connect = dbo.getDb();
  try {
    const dta = await dbo.getDb().collection("tracks").find(query);
    if (dta) {
      dta_array = await dta.toArray();
      if ((dta_array.length) > 0) {
        console.log(`${dta_array.length} document(s) matched the query criteria.`);
        res.json(dta_array);
      } else {
        console.log("record.js: dta is EMPTY");
      }
    } else {
      console.log("record.js: dta undefined");
    }
  } catch (err) {
    console.error(err);
  }
});
 
// This section will help you get a single record by id
recordRoutes.route("/record/:id").get(function (req, res) {
 let db_connect = dbo.getDb();
 console.log(`record.js getId: id = ${req.params.id}`);
 let myquery = { _id: new ObjectId(req.params.id) };
 db_connect
   .collection("tracks")
   .findOne(myquery, function (err, result) {
     if (err) throw err;
     res.json(result);
   });
});
 
// This section will help you create a new record.
recordRoutes.route("/record/add").post(function (req, response) {
 let db_connect = dbo.getDb();
 let myobj = {
   filename: req.body.filename, 
   datetime: new Date(req.body.datetime),
   mode: req.body.mode, // bike xbike, mtnbike, indrbike, UNKNWN
   lat:  parseFloat(req.body.lat),
   long:  parseFloat(req.body.long),
   dist_meter:  parseFloat(req.body.dist_meter)
 };
  try {
    let obj = db_connect.collection("tracks").insertOne(myobj);
    response.json(obj);
  } catch (err) {
    console.error('record insert error : ${err}');
    throw err;
  }
});
 
// This section will help you update a record by id.
recordRoutes.route("/update/:id").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = {_id: new ObjectId(req.params.id)};
  let newvalues = {
    $set: {
      filename: req.body.filename, 
      datetime: new Date(req.body.datetime),
      mode: req.body.mode, // bike xbike, mtnbike, indrbike, UNKNWN
      lat:  parseFloat(req.body.lat),
      long:  parseFloat(req.body.long),
      dist_meter:  parseFloat(req.body.dist_meter)
    }
  };
  try {
    let obj = db_connect.collection("tracks").updateOne(myquery, newvalues);
    response.json(obj);
  } catch (err) {
    console.error('record update error : ${err}');
    throw err;
  }
});
 
// This section will help you delete a record
recordRoutes.route("/:id").delete((req, response) => {
  let db_connect = dbo.getDb();
  let myquery = {_id: new ObjectId(req.params.id)};
  try {
    let obj = db_connect.collection("tracks").deleteOne(myquery);
    response.json(obj);
  } catch (err) {
    console.error('record delete error : ${err}');
    throw err;
  }
});
 
module.exports = recordRoutes;