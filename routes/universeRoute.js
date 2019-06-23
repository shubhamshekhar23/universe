var universe = require("../models/universe");
var person = require("../models/person");
var family = require("../models/family");
var powermap = require("../models/powermap");
var fs = require('fs');

module.exports = app => {
  //creating multiple universes
  app.post("/api/universe/add", function(req, res) {
    let univeArr = req.body;
    // console.log(univeArr);
    universe.insertMany(univeArr, function(err, data) {
      if (err) {
        console.log(err);
        res.json({
          message: "error",
          error: err
        });
      }
      console.log(data);
      res.json({
        message: "success",
        data: data
      });
    });
  });

  // update power of persons
  app.post("/api/persons/power/add", async function(req, res) {
    let powerArr = req.body;
    let resObj = [];
    let resFamObj = {};
    for (let i = 0; i < powerArr.length; i++) {
      let powObj = powerArr[i];
      let univPower = powObj.univArr;
      let insertObjArr = [];
      univPower.forEach(element => {
        let obj = {};
        obj['personId'] = powObj.personId;
        obj['familyId'] = powObj.familyId;
        obj['universeId'] = element.universeId
        obj['power'] = element.power
        insertObjArr.push(obj);
      });
      try {
        let powermapNew = await powermap.insertMany(insertObjArr);
        resObj = [...resObj, ...powermapNew];
      } catch (error) {
        res.json({
          message: "error",
          error: err
        });
      }
    }
    res.json({
      message: "success",
      data: resObj
    });
    // powermap.insertMany(powerArr, function(err, data) {
    //   if (err)
    //     res.json({
    //       message: "error",
    //       error: err
    //     });
    //   res.json({
    //     message: "success",
    //     data: data
    //   });
    // });
  });

  //create POwerMapTest data when families and persons are populated
  app.post("/api/createPowermapTestData", async function(req, res) {
      try {
        //   let testObj = {
        //       a:2
        //   }
        //   fs.writeFileSync('TestData/myjsonfile.json', JSON.stringify(testObj));
          let getrnd = function (min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
          }
          let univArr = await universe.aggregate([{
              $project:{
                  _id: 0,
                  universeId: "$_id"
              }
          }])
          let personArr = await person.aggregate([{
            $project:{
                _id : 0,
                familyId : 1,
                personId : "$_id"
            }
          }])
        //   let n = personArr.length;
          personArr.forEach(person => {
            let arr = [];
            univArr.forEach(univ => {
                let obj = {};
                obj['universeId'] = univ.universeId;
                obj['power'] = getrnd(-100, 100);
                arr.push(obj);
            });
            person['univArr'] = arr;
          });
          fs.writeFileSync('TestData/power.json', JSON.stringify(personArr));
          res.json({
            message: "successfully created data in TestData folder power.json",
          });
      } catch (error) {
          console.log(error);
          res.json({
            message: "error",
            error: err
          });
      }

  });
};
