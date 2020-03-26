const express = require('express');
const router = express.Router();
const Task = require('../tasks/tasks');
const User = require('../users/users');

router.use(function timeLog (req, res, next) {
    console.log('Time: ', Date.now())
    next()
  })

router.param('id', (req, res, next, id)=>{
    Task.findOne({ _id : id}, (err, task)=> {
        if(err) return next(err);
        if(!task) return next(new Error('Nothing found'));
        req.task = task;
        next();
    })
})

router.get('/:id', (req, res)=>{
    Task.findById(req.params.id, (err, task)=>{
        task.remove((err, task)=>{
            if(err){
                res.send(err)
            }
            if(task){
                res.redirect(`/user/${task.userId}`)
                console.log('task deleted')
            }
        })
    })
});

router.get('/tasklist/:id', (req, res)=>{
    Task.findById(req.params.id, (err, task)=>{
        task.remove((err, task)=>{
            if(err){
                res.send(err)
            }
            if(task){
                res.redirect(`/user/tasklist/${task.userId}`)
                console.log('task deleted')
            }
        })
    })
});

router.post('/updatelist/:id', (req, res)=> {
    console.log(req.params.id)
        
    Task.findById(req.params.id, (err, task)=> {
        if(err){
            res.send(err)
        }
        if(task){
            task.updateOne({ $set: { status: req.body.status }}, (err, task)=>{
                if(err){
                    res.send(err)
                }
            })
        }
    })
})

module.exports = router;