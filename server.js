const express = require('express');
const ejs = require('ejs')
const path = require('path');
const bodyParser = require('body-parser');
const User = require('./users/users');
const bcrypt = require('bcryptjs');
const db = require('./db');
const cors = require('cors');
const Task = require('./tasks/tasks');
const Sortable = require('sortablejs');
const helmet = require('helmet');

//App
const app = express();

// view engine
app.use(express.static(path.join(__dirname, "public")));
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());

// set port
const port = process.env.PORT || 4000

//Route
app.get('/', (req, res)=> {
    res.render('index', {
        id: '',
        tasks: 0,
        loggedIn: false
    });
});

app.get('/login', (req, res, next)=> {
    res.render('login', {
        emptyField: false,
        wrongPassword: false,
        wrongUsername: false
    });
});

app.post('/login', (req, res)=> {
    if (req.body.username && req.body.password != null ) {
        User.findOne({ username : req.body.username }, (err, user)=> {
            if(err){
                return res.json({ message : err.message });
            }
            if(user){
                var hash = user.password;
                var Userpassword = req.body.password;
                var password = bcrypt.compareSync(Userpassword, hash);
                if(password){
                    res.redirect(`/user/${user.id}`)
                } else {
                    res.render('login', {
                        emptyField: false,
                        wrongUsername: false,
                        wrongPassword: true
                    })
                }
            } else {
                res.render('login', {
                    emptyField: false,
                    wrongUsername: true,
                    wrongPassword: false
                })
            }
        })
    } else {
        res.render('login', {
            emptyField: true,
            wrongPassword: false,
            wrongUsername: false
        })
    }
});

app.get('/signin', (req, res)=> {
    res.render('signin' , {
        valiedEmail: false,
        valiedUsername: false,
        emptyField: false
    });
});

app.post('/signin', (req, res, next)=> {
    if (req.body.username && req.body.firstname && req.body.lastname && req.body.email && req.body.password != null) {
        var user;

        User.findOne({ email : req.body.email }, (err, user)=> {
            if(err){
                res.json({message : err});
            }
            if(user){
                res.status(401).render('signin', {
                    valiedEmail: true,
                    valiedUsername: false,
                    emptyField: false
                })
            } else { 
                User.findOne({ username : req.body.username }, (err, user)=> {
                    if(err) {
                        res.send(err);
                    }
                    if(user) {
                        res.status(401).render('signin', {
                            valiedUsername: true,
                            valiedEmail: false,
                            emptyField: false
                        });
                    } else {
                        var salt = bcrypt.genSaltSync(10);
                        var hash = bcrypt.hashSync(req.body.password, salt);
                        
                        var user = new User();

                        user.username = req.body.username;
                        user.firstname = req.body.firstname;
                        user.lastname = req.body.lastname;
                        user.email = req.body.email;
                        user.password = hash;
                    user.save();
                    res.redirect(`/user/${user.id}`);
                    console.log('user saved');
                    }
                })
            }
        })
    } else {
        res.render('signin', {
            valiedEmail: false,
            valiedUsername: false,
            emptyField: true
        })
    }
});

app.use(function(req, res, next){
    req.db = db;
    next();
});

app.get('/settings', (req, res)=> {
    res.send('setting page')
})

// router User
var user = require('./router/user');
app.use('/user', user)

// router Task
var task = require('./router/task');
app.use('/task', task)

app.use(function(req,res,next){
    req.db = db;
    next();
});

db.once('open', ()=> console.log('connected to db'))

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
});

