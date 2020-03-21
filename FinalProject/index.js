// Require library
const express = require('express');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

///////
const app = express();
const port = 3000;
const urlMongoDB = 'mongodb://localhost:27017/FinalProject';

// Routers
const authRoute = require('./routes/auth.route');

/// third library
const cookieParser = require('cookie-parser');

/// start server
app.listen(port, () => console.log(`Listening on port ${port}!`));

/// support function
const helper = require('./support_function/helper');

// Install template engine to server
app.set('view engine', 'pug');
app.set('views', './views');

// Setting server for using static files
app.use('/static', express.static('public'))

// Setting server for taking data from POST method
app.use(express.json());                        // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Setting server for take cookie from client
app.use(cookieParser());

// Setting router
app.use('/auth', authRoute);


app.get('/', (req, res) => {
    res.render('index', helper.pugArg(req));
});

app.get('/aboutUs', (req, res)=>{
    res.render('aboutProject', helper.pugArg(req));
});

app.get('/users/signUp', (req, res) => {
    res.render('signUp');
});

app.get('/users/logIn', (req, res) =>{
    res.render('logIn');
});

app.get('/users/account', (req, res) => {
    MongoClient.connect(urlMongoDB,  { useNewUrlParser: true }, function(err, client){
        let db = client.db('FinalProject');
        let userInfo = []
        db.collection('users')
                .find({CMND: req.cookies['user-CMND']})
                .toArray(function(err, result)
                    {
                        userInfo = result[0];  
                    });
        db.collection('exams')
            .find({'user-CMND': req.cookies['user-CMND']})
            .toArray(function(err, result){
                res.render('accountPage', helper.pugArg(req, {
                    user: userInfo,
                    exams: result
                }));
            });
        
    });
});

app.get('/users/addExam', (req, res) => {
    res.render('addExamPage.pug', helper.pugArg(req));
});

app.get('/users/logout', (req, res) => {
    res.clearCookie('user-CMND');
    res.clearCookie('user-name');
    res.clearCookie('role');
    res.redirect('/');
});

app.post('/users/exam/updateScore',(req, res) => {
    MongoClient.connect(urlMongoDB,  { useNewUrlParser: true }, function(err, client){  
        let db = client.db('FinalProject');
            db.collection('users')
                 .updateOne({CMND: req.cookies['user-CMND']}, {$inc: {score: parseInt(req.body['score'])}});
    });
});

app.get('/exam', (req, res) => {
    MongoClient.connect(urlMongoDB,  { useNewUrlParser: true }, function(err, client){
        let db = client.db('FinalProject');
            db.collection('exams')
                 .find({},{projection: {_id: 1, 'title': 1, 'subject': 1, 'date': 1, 'user-name': 1}})
                 .toArray(function(err, result)
                        {
                            res.render('examPage', helper.pugArg(req, {
                                exams: result
                            }));
                        });
    });
})



app.get('/rank', (req, res) => {
    MongoClient.connect(urlMongoDB,  { useNewUrlParser: true }, function(err, client){
        let db = client.db('FinalProject');
            db.collection('users')
                 .find({},{projection: {_id: 0, 'name': 1, 'CMND': 1, 'score': 1}})
                 .sort({'score':-1})
                 .limit(20)
                 .toArray(function(err, result)
                        {
                            res.render('rankPage', helper.pugArg(req, {'users': result}));
                        });
    });
});

app.post('/users/addExam/add', function(req, res, next){
    MongoClient.connect(urlMongoDB, { useNewUrlParser: true }, function(err, client){
        let db = client.db('FinalProject');
        let jsonObj = JSON.parse(JSON.stringify(req.body));
        jsonObj['user-CMND'] = req.cookies['user-CMND'];
        jsonObj['user-name'] = req.cookies['user-name'];
        db.collection('exams')
            .insertOne(jsonObj, function(err, res){
                if (err)
                    throw err
                console.log('1 document inserted');
            });
    });
});

app.get('/exams/:id', (req, res) => {   
    res.render('doExam',helper.pugArg(req, {examId: req.params.id}));
});

app.get('/exams/:id/content', (req, res) => {   
    MongoClient.connect(urlMongoDB, { useNewUrlParser: true }, function(err, client){
        let db = client.db('FinalProject');
        db.collection('exams')
            .findOne({_id: ObjectId(req.params.id)}, function(err, exam){
                res.json(exam);
            })
        });
});

app.get('/exams/:id/delete', (req, res) => {   
    MongoClient.connect(urlMongoDB, { useNewUrlParser: true }, function(err, client){
        let db = client.db('FinalProject');
        db.collection('exams')
            .remove({_id: ObjectId(req.params.id)})
        });
    res.redirect('/users/account');
});

app.get('/exams/:id/edit', (req, res) => {   
    res.render('editExam', helper.pugArg(req, {exam_id: req.params.id}));
});

app.post('/exams/:id/update', (req, res) => {   
    MongoClient.connect(urlMongoDB, { useNewUrlParser: true }, function(err, client){
        let db = client.db('FinalProject');
        let jsonObj = JSON.parse(JSON.stringify(req.body));
        jsonObj['user-CMND'] = req.cookies['user-CMND'];
        jsonObj['user-name'] = req.cookies['user-name'];
        db.collection('exams')
            .insertOne(jsonObj, function(err, res){
                if (err)
                    throw err
                console.log('1 document inserted');
            });
        db.collection('exams').remove({_id: ObjectId(req.params.id)});
    });
});


app.get('/search', (req, res) => {   
    console.log(req.query);
    MongoClient.connect(urlMongoDB, { useNewUrlParser: true }, function(err, client){
        let db = client.db('FinalProject');
        db.collection('exams').createIndex({ "title": "text"});
        db.collection('exams')
            .find({$text: { $search: req.query.title}},{projection: {_id: 1, 'title': 1, 'subject': 1, 'date': 1, 'user-name': 1}})
            .toArray( function(err, result){
                res.render('examPage', helper.pugArg(req, {
                    exams: result
                }));
            });
    });
});