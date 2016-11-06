var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.session.username){
        console.log(req.session.username);
        res.render("index",{
            title:"WebChat",
            Sid:req.session.username
        });
    }else {
        res.render("index",{
            title:"WebChat",
            Sid:""
        });
    }
});

module.exports = router;
