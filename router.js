var express = require('express')
var User = require('./models/user')
var md5 = require('blueimp-md5')

var router = express.Router()

router.get('/', (req, res)=>{
    res.render('index.html')
})

router.get('/login', (req, res)=>{
    res.render('login.html')
})

router.post('/login', (req, res)=>{
    // console.log(req.body)
    var body = req.body
    User.findOne({
        email: body.email,
        password: md5(md5(body.password))
    }, (err, user)=>{
        if(err){
            return res.status(500).json({
                status: 500,
                message: err.message
            })
        }

        if(!user){
            return res.status(200).json({
                status: 0,
                message: 'email or password is invaild'
            })
        }


        req.session.user = user
        res.status(200).json({
            status: 1,
            message: 'OK'
        })
    })
})

router.get('/register', (req, res)=>{
    res.render('register.html')
})

router.post('/register', (req, res)=>{
    console.log(req.body)
    var body= req.body
    User.findOne({
        $or: [{
            eamil: body.email
        },{
            nickname: body.nickname
        }]
        
    }, (err, data)=> {
        if(err){
            return res.status(500).json({
                status: 500,
                message: '服务端错误'
            })
        }
        if(data){
            return res.status(200).json({
                status: 0,
                message: '邮箱或者昵称已存在'
            })
        }

        // 对密码进行 md5 重复加密
        body.password = md5(md5(body.password))

        new User(body).save((err, user)=> {
            if(err){
                return res.status(500).json({
                    status: 500,
                    message: '服务端错误'
                })
            }
            res.status(200).json({
                status: 1,
                message: 'ok'
            })
        })
    })
})



module.exports = router