let bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({extended: false});
let MongoClient = require('mongodb').MongoClient;
let url = 'mongodb://localhost:27017/FinalProject';

module.exports.postLogin = function(req, res, next){
    MongoClient.connect(url, { useNewUrlParser: true } , function(err, client){
        let db = client.db('FinalProject');
        db.collection('users').findOne({ CMND: req.body.CMND}, function(err, user){
            if (user === null)
            {
                console.log('Tai khoan khong ton tai');
                res.render('logIn', {
                    'error':'Login invalid'
                });
            }
            else if (user.CMND === req.body.CMND && user.pwd == req.body.pwd)
            {
                console.log('Login successfully');
                res.cookie('role', user['role-user']);
                res.cookie('user-name', user.name);
                res.cookie('user-CMND', user.CMND);
                res.redirect('/');
            }
            else
            {
                res.render('logIn', {
                    'error':'Wrong password'
                });
            }
        });
    });

};

module.exports.postSignup = function(req, res, next){
    MongoClient.connect(url, { useNewUrlParser: true } , function(err, client){
        if (err)
            throw err
        let db = client.db('FinalProject');
        db.collection('users').findOne({ CMND: req.body.CMND}, function(err, user){
            if (user !== null){
                console.log('Đã tồn tại số chứng minh nhân dân');
                res.render('signUp', {
                    'error': 'Số CMND đã tồn tại'
                });
            }
            else{
                req.body['score'] = 0;
                if ( ! req.body['role-user'])
                    req.body['role-user'] = 'student';
                let obj = JSON.stringify(req.body);
                let jsonObj = JSON.parse(obj);
                db.collection('users').insertOne(jsonObj, function(err, res){
                    if (err)
                        throw err
                    console.log('1 document inserted');
                });
                res.render('logIn', {
                    'success': 'Đăng ký thành công'
                });
            } 
        });
    });
};