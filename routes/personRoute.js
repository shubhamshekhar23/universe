var universe = require("../models/universe");
var person = require("../models/person");
var family = require("../models/family");
var powermap = require("../models/powermap");

module.exports = app => {
// a new born person is added to an existing family
  app.post("/api/person/add", function(req, res) { 
    let pers = req.body.data;
    let universeId = req.body.universeId;
    let power = req.body.power;
    let familyId = req.body.familyId;

    let newPerson = new person(pers);
    newPerson.save((err, p) => { // craete a new person
      if (err) {
        res.json({
          message: "error",
          error: err
        });
      }
      let obj = {
        universeId,
        familyId,
        power,
        personId: p._id
      };
      let powermapNew = new powermap(obj);
      powermapNew.save((err, pow) => { // create a power map
        if (err) {
          res.json({
            message: "error",
            error: err
          });
        }
        res.json({
            message: "successfully created",
            person: p,
            power: pow
        });
      });
    });
  });

  app.get("/api/getAllPersons", async (req,res)=>{
      let personsList = await person.aggregate([
          {$project: {
              _id : 0,
              familyId : 1,
              personId : "$_id"
          }}
      ]);
      res.json(personsList)
  })
  
};
