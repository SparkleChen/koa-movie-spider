const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema
//const Mixed = Schema.Types.Mixed

const SALT_WORK_FACTOR = 10 
const MAX_LOGIN_ATTEMPTS = 5 
const LOCK_TIME = 2 * 60 * 60 * 1000

const userSchema = new Schema({
    username:{
        unique:true,
        type:String
    },
    email:{
        unique:true,
        type:String
    },
    password:{
        unique:true,
        type:String
    },
    loginAttempts:{
        type:Number,
        required:true,
        default:0
    },
    lockUntil:Number,
    meta:{
        createdAt:{
          type:Date,
          default:Date.now()
        },
        updatedAt:{
           type:Date,
           default:Date.now()
        }
    }
})

//锁定时间 (mongoose虚拟字段  不会存在数据库中)
userSchema.virtual('isLocked').get(function() {
    return !!(this.lockUntil && this.lockUntil > Date.now())
})
userSchema.pre('save', function(next) {
    if(this.isNew){
        this.meta.createdAt = this.meta.updatedAt = Date.now()
       }else{
           this.meta.updatedAt = Date.now()
       }
       next()
})

userSchema.pre('save', function(next) {
    if(!this.isModified('password')) return next()
    //加密库
    bcrypt.genSalt(SALT_WORK_FACTOR,(err,salt)=>{
        if(err) return next()
        bcrypt.hash(this.password,salt,(err,hash) =>{
            this.password = hash
            next()
        })
    })
    next()   
})

userSchema.methods = {
    comparePassword:(_password,password) => {
        return new Promise((resolve,reject) => {
            bcrypt.compare(_password,password,(err,isMatch) => {
             if(!err) resolve(isMatch)
             else reject(err)
            })
        })
    },
    incLoginAttempts: (user) =>{
        return new Promise((resolve,reject)=>{
            if(this.lockUntil && this.lockUntil < Date.now()){
                this.update({
                    $set:{
                        loginAttempts:1
                    },
                    $unset:{
                        lockUntil:1
                    }
                },err =>{
                    if(!err) resolve(true)
                    else reject (err)
                })
            }else{
                let updates = {
                    $inc:{
                        loginAttempts:1
                    }
                }
                if(this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked){
                    updates.$set = {
                        lockUntil:Date.now() + LOCK_TIME
                    }
                }
                this.update(updates,err =>{
                    if(!err) resolve(true)
                    else reject(err)
                })
            }
        })
    }
}

mongoose.model('User',userSchema)