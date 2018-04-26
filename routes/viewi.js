var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');



router.get('/',function(req, res, next) {
    const db = require('../db.js');

    //var inv ;
    try{
        if(req.user.type=='Maintenance')
            db.query('SELECT * FROM inv_food',
                function(err, results, fields){
                    if(err) {throw (err)};
                    //var r = results[0].toObject();
                    var rows = results;  
                    //console.log(rows);
                    // const user = req.user;
                    res.render('viewi', { title: 'Food Inventory',rows : rows});
            })
        else{
            res.redirect('auth');
        }    
    }catch(err){
        req.flash('err1', 'PLease Signin');
        res.redirect('/signin');
    }
});

module.exports = router;