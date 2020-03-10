const express = require('express');
const router = express.Router();
const Task = require('../tasks/tasks');
const User = require('../users/users');
const Sortable = require('sortablejs');
const mongoose = require('mongoose')

router.use(function timeLog (req, res, next) {
    console.log('Time: ', Date.now())
    next()
  })

router.param('id', (req, res, next, id)=>{
    User.findOne({ _id : id}, (err, user)=> {
        if(err) return next(err);
        if(!user) return next(new Error('Nothing found'));
        req.user = user;
        next();
    })
});

router.get('/:id', (req, res)=> {
    Task.find({ userId : req.params.id } ,(err, tasks, count)=>{
        User.findOne({ _id : req.params.id }, (err, user)=> {
            res.render('index', {
                id: req.params.id,
                tasks: tasks,
                user: user,
                loggedIn: true,
                Sortable: Sortable
            })
        })
    })
});

router.post('/:id', (req, res)=> {
    var userId = req.params.id
    if(req.body.title != null) {
        const task = new Task();

        task.title = req.body.title;
        task.listTask = 'list';
        task._id = new mongoose.Types.ObjectId;
        task.userId = userId;

        task.save();
        console.log('task saved')
        res.redirect(`/user/${userId}`)
    } else {
        res.send('Field is empty')
    }
}); 

router.get('/userpage/:id', (req, res)=>{
    User.findById(req.params.id, (err, user)=>{
        if(err){
            res.send(err)
        }
        res.render('userpage', {
            user: user,
            changingEmail: false,
            changingUsername: false,
            changingFirstname: false,
            changingLastname: false,
            valiedUsername: false,
            valiedEmail: false
        })
    })
});

router.get('/userpage/change-username/:id', (req, res)=> {
    User.findById(req.params.id, (err, user)=> {
        if(err) {
            res.send(err);
        }
        res.render('userpage', {
            user: user,
            changingEmail: false,
            changingUsername: true,
            changingFirstname: false,
            changingLastname: false,
            valiedUsername: false,
            valiedEmail: false
        }) 
    })
});

router.get('/userpage/change-username-wrong/:id', (req, res)=> {
    User.findById(req.params.id, (err, user)=> {
        if(err) {
            res.send(err);
        }
        res.render('userpage', {
            user: user,
            changingEmail: false,
            changingUsername: false,
            changingFirstname: false,
            changingLastname: false,
            valiedUsername: true,
            valiedEmail: false
        }) 
    })
});

router.get('/userpage/change-firstname/:id', (req, res)=> {
    User.findById(req.params.id, (err, user)=> {
        if(err) {
            res.send(err);
        }
        res.render('userpage', {
            user: user,
            changingEmail: false,
            changingUsername: false,
            changingFirstname: true,
            changingLastname: false,
            valiedUsername: false,
            valiedEmail: false
        })
    })
});

router.get('/userpage/change-lastname/:id', (req, res)=> {
    User.findById(req.params.id, (err, user)=> {
        if(err) {
            res.send(err);
        }
        res.render('userpage', {
            user: user,
            changingEmail: false,
            changingUsername: false,
            changingFirstname: false,
            changingLastname: true,
            valiedUsername: false,
            valiedEmail: false
        })
    })
});

router.get('/userpage/change-email/:id', (req, res)=> {
    User.findById(req.params.id, (err, user)=> {
        if(err) {
            res.send(err);
        }
        res.render('userpage', {
            user: user,
            changingEmail: true,
            changingUsername: false,
            changingFirstname: false,
            changingLastname: false,
            valiedUsername: false,
            valiedEmail: false
        })
    })
});

router.get('/userpage/change-email-wrong/:id', (req, res)=> {
    User.findById(req.params.id, (err, user)=> {
        if(err) {
            res.send(err);
        }
        res.render('userpage', {
            user: user,
            changingEmail: false,
            changingUsername: false,
            changingFirstname: false,
            changingLastname: false,
            valiedUsername: false,
            valiedEmail: true
        })
    })
});

router.post('/userpage/change-username/:id', (req, res)=> {
    User.findOne({ username : req.body.username }, (err, user)=> {
        if(err) {
            res.send(err)
        }
        if(user) {
            res.redirect(`/user/userpage/change-username-wrong/${req.params.id}`)
        } 
        if(!user) {
            User.updateOne({ _id : req.params.id }, 
                { $set: { username: req.body.username}}, {new: true}, (err, user)=> {
                    if(err){
                        res.send(err)
                    }
                    console.log('Username updated')
                    res.redirect(`/user/userpage/${req.params.id}`)
                })
        }
    })
})

router.post('/userpage/change-firstname/:id', (req, res)=> {
    User.updateOne({ _id : req.params.id }, 
        { $set: { firstname: req.body.firstname}}, {new: true}, (err, user)=> {
            if(err){
                res.send(err)
            }
            console.log('firstname updated')
            res.redirect(`/user/userpage/${req.params.id}`)
        }
    )
})

router.post('/userpage/change-lastname/:id', (req, res)=> {
    User.updateOne({ _id : req.params.id }, 
        { $set: { lastname: req.body.lastname}}, {new: true}, (err, user)=> {
            if(err){
                res.send(err)
            }
            console.log('lastname updated')
            res.redirect(`/user/userpage/${req.params.id}`)
        }
    )
})

router.post('/userpage/change-email/:id', (req, res)=> {
    User.findOne({ email : req.body.email }, (err, user)=> {
        if(err) {
            res.send(err)
        }
        if(user) {
            res.redirect(`/user/userpage/change-email-wrong/${req.params.id}`)
        } if(!user){
            User.updateOne({ _id : req.params.id }, 
                { $set: { email : req.body.email}}, {new: true}, (err, user)=> {
                    if(err){
                        res.send(err)
                    }
                    console.log('email updated')
                    res.redirect(`/user/userpage/${req.params.id}`)
            })
        } 
    })
});

router.get('/tasklist/:id', (req, res)=> {
    Task.find({ userId : req.params.id } ,(err, tasks)=>{
        User.findOne({ _id : req.params.id }, (err, user)=> {
            res.render('tasklist', {
                id: req.params.id,
                tasks: tasks,
                user: user,
                loggedIn: true
            })
        })
    })
});

router.get('/settings/:id', (req, res)=> {
    User.findById(req.params.id, (err, user)=> {
        if(err) {
            res.send(err)
        }
        if(user) {
            res.render('settings', {
                user: user,
                notifi: true,
                theme: false,
                about: false
            })
        }
    })
});

router.get('/settings/theme/:id', (req, res)=> {
    User.findById(req.params.id, (err, user)=> {
        if(err) {
            res.send(err)
        }
        if(user) {
            res.render('settings', {
                user: user,
                notifi: false,
                theme: true,
                about: false
            })
        }
    })
});

router.get('/settings/about/:id', (req, res)=> {
    User.findById(req.params.id, (err, user)=> {
        if(err) {
            res.send(err)
        }
        if(user) {
            res.render('settings', {
                user: user,
                notifi: false,
                theme: false,
                about: true
            })
        }
    })
});


module.exports = router;