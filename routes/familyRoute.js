var universe = require("../models/universe");
var person = require("../models/person");
var family = require("../models/family");
var powermap = require("../models/powermap");
var mongoose = require('mongoose');
ObjectId = mongoose.Types.ObjectId;


module.exports = app => {
  // for data population initially
  app.post("/api/family/add", async function(req, res) {
    let familiesArr = req.body;
    let resObj = [];
    let resFamObj = {};
    for (let i = 0; i < familiesArr.length; i++) {
      let famObj = familiesArr[i];
      let fam = famObj.family;
      let persons = famObj.persons; // array of members of family
      try {
        let resFamObj = {};
        let newFamily = new family(fam);
        let f = await newFamily.save();
        persons.forEach(element => {
          element["familyId"] = f._id;
        });
        let personsNew = await person.insertMany(persons);
        resFamObj["family"] = f;
        resFamObj["persons"] = personsNew;
        resObj.push(resFamObj);
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
    // familiesArr.forEach((famObj)=>{
    //     let fam = famObj.family;
    //     let persons = famObj.persons; // array of members of family
    //     let newFamily = new family(fam);
    //     newFamily.save((err, f) => {
    //       // craete a new person
    //       if (err) {
    //         res.json({
    //           message: "error",
    //           error: err
    //         });
    //       }
    //       persons.forEach(element => {
    //         element["familyId"] = f._id;
    //       });
    //       person.insertMany(persons, function(err, data) {
    //         if (err){
    //             console.log(err);
    //             res.json({
    //               message: "error",
    //               error: err
    //             });
    //         }
    //         res.json({
    //           message: "success",
    //           data: {
    //             family: f,
    //             persons: data
    //           }
    //         });
    //       });
    //     });
    // })
  });

  // list families in a particular universe
  app.get("/api/getFamilies", function(req, res) {
    //   console.log(req.query)
    let universeId = JSON.parse(req.query.universeId);
    console.log(universeId)
    powermap.aggregate(
      [
        { $match: { universeId: ObjectId(universeId) } },
        { $group: { _id: "$familyId" } },
        {
          $lookup: {
            from: "families",
            localField: "_id",
            foreignField: "_id",
            as: "family"
          }
        },
        {
          $project:{
            _id: 0,
            family : 1
          }
        }
      ],
      (err, data) => {
        if (err) {
          res.json({
            message: "error",
            error: err
          });
        }
        res.json(data);
      }
    );
  });

  // check if family is balanced
  app.get("/api/checkFamily", function(req, res) {
    let familyId = JSON.parse(req.query.familyId);
    powermap.aggregate(
      [
        { $match: { familyId: ObjectId(familyId) } },
        {
          $group: {
            _id: { familyId: "$familyId", universeId: "$universeId" },
            totalPower: { $sum: "$power" }
          }
        },
        {
          $project: {
            totalPower: 1
          }
        },
        {
          $group: {
            _id: "$totalPower"
          }
        }
      ],
      (err, data) => {
        if (err) {
          res.json({
            message: "error",
            error: err
          });
        }
        if (data.length == 1) {
          res.json({
            message: `family ${familyId} is balanced`,
            unbalanced: false
          });
        } else {
          res.json({
            message: `family ${familyId} is Unbalanced`,
            unbalanced: true
          });
        }
      }
    );
  });

  // find unbalanced family ids
  app.get("/api/findUnbalancedFamilies", function(req, res) {
    powermap.aggregate(
      [
        {
          $group: {
            _id: { familyId: "$familyId", universeId: "$universeId" },
            totalPower: { $sum: "$power" }
          }
        },
        { $addFields: { familyId: "$_id.familyId" } },
        {
          $group: {
            _id: "$familyId",
            totalPowerArr: { $addToSet: "$totalPower" }
          }
        },
        {
          $project: {
            numberOfPowers: { $size: "$totalPowerArr" }
          }
        },
        {
          $match: { numberOfPowers: { $gt: 1 } }
        },
        {
          $project: {
            numberOfPowers: 0
          }
        },
        // {
        //   $lookup: {
        //     from: "families",
        //     localField: "_id",
        //     foreignField: "_id",
        //     as: "family"
        //   }
        // },
        // {
        //   $project: {
        //     _id: 0,
        //     family: 1
        //   }
        // },
      ],
      (err, data) => {
        if (err) {
          res.json({
            message: "error",
            error: err
          });
        }
        res.json(data);
      }
    );
  });

  // balance the given Family id
  app.post("/api/balanceFamily", async (req, res)=>{
    let familyId = JSON.parse(req.query.familyId);

    let query = await powermap.aggregate(
      [
        { $match: { familyId: ObjectId(familyId) } },
        {
          $group: {
            _id: { familyId: "$familyId", universeId: "$universeId" },
            totalPower: { $sum: "$power" }
          }
        },
        {
          $project: {
            totalPower: 1
          }
        }
      ])
      let arr = [];
      query.forEach(element => {
        arr.push(element.totalPower);
      });
      console.log(arr);
      let check = (arr) => arr.every(item => arr.indexOf(item) === 0);
      check(arr);
      let avg = 0;
      if(check(arr)){
        res.json({
          message: 'This family is already balanced'
        })
      }else{
        let avg = 0;
        let sum = 0;
        arr.forEach((el)=>{
          sum = sum + el;
        })
        avg = parseInt(sum/(arr.length)); // finding the average of all the powers of family in diferent universe
        try {
          for (let i = 0; i < query.length; i++) {
              let add = avg - query[i].totalPower;
              let update = await powermap.findOneAndUpdate({
                familyId: query[i]._id.familyId,
                universeId: query[i]._id.universeId
              },{ $inc : { "power" : add } })          
          }
        } catch (error) {
          console.log(error);
          res.json({
            message: "error",
            error: err
          });
        }
        res.json({
          message: "family has been balanced with total power " + avg
        })
      }
    })
};
