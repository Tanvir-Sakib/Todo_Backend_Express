var express = require('express');
var router = express.Router();
const fs = require("fs");


/* GET Database. */
router.get('/', function(req, res, next) {
  fs.readFile("./database/db.json",'utf8',(err,data) => {
    var parsedData = JSON.parse(data);
    res.status(200).json({
        success: true,
        data: parsedData.user
    })
});
  // return res.status(200).json({data: 'Hello'});
  
});

module.exports = router;