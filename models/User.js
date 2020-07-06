const bcrypt = require("bcryptjs");
const md5 = require("md5")
const userCollection = require("../db").db().collection('users');

const validator = require("validator")
let User = function (data,getAvatar) {
    this.data = data;
    this.errors = [];
    if(getAvatar == undefined){getAvatar == false}
    if(getAvatar){this.getAvatar()}
}
User.prototype.cleanUp = function () {
    if (typeof (this.data.username) != "string") {
        this.data.username = ""
    }
    if (typeof (this.data.email) != "string") {
        this.data.email = ""
    }
    if (typeof (this.data.password) != "string") {
        this.data.password = ""
    }
    //get rid of bogus property
    this.data = {
        username: this.data.username.trim().toLowerCase(),
        email: this.data.email.trim().toLowerCase(),
        password: this.data.password
    }


}
User.prototype.validate = function(){
    return new Promise(async (resolve,reject)=> {
        if (this.data.username == "") {
            this.errors.push("you must provide username")
        };
        if (this.data.username != "" && !validator.isAlphanumeric(this.data.username)) {
            this.errors.push("username can only contain letters and numbers")
        }
        if (!validator.isEmail(this.data.email)) {
            this.errors.push("you must provide a valid email ")
        };
        if (this.data.password == "") {
            this.errors.push("you must provide a password ")
        };
        if (this.data.password.length > 0 && this.data.password.length < 6) {
            this.errors.push("password should have atleast six characters")
        }
        if (this.data.password.length > 12) {
            this.errors.push("password should not exceed 12 characters")
        }
        if (this.data.username.length > 0 && this.data.username.length < 4) {
            this.errors.push("username should have atleast 4 characters")
        }
        if (this.data.username > 10) {
            this.errors.push("username should not exceed 10 characters")
        }

        //only if username is valid them check if its taken
        if (this.data.username.length > 3 && this.data.username.length < 11 && validator.isAlphanumeric(this.data.username)) {
            let userNameExists = await userCollection.findOne({
                username: this.data.username
            })
            if (userNameExists) {
                this.errors.push("username already taken")
            }
        }
        //on if email is valide check if taken
        if (validator.isEmail(this.data.email)) {
            let emailExists = await userCollection.findOne({
                email: this.data.email
            })
            if (emailExists) {
                this.errors.push("email already being used")
            }
        }
        resolve()

    })
}
User.prototype.login = function()
{
   return new Promise((resolve,reject)=>{
        this.cleanUp();
        userCollection.findOne({username: this.data.username}).then((attemptedUser)=>{
            if (attemptedUser && bcrypt.compareSync(this.data.password,attemptedUser.password)) {
                this.data = attemptedUser
                this.getAvatar()
                resolve("congrats")
            } else {
                reject("invalid password")
            }
        }).catch(()=>{
            reject("please try later")
        })
   })
}
User.prototype.register = function(){
    return new Promise(async (resolve,reject) =>{
        //validate user data
        this.cleanUp();
        await this.validate();
        //if no validation errors
        //save to database
        if (!this.errors.length) {
            //hash password before inserting kwa database
            let salt = bcrypt.genSaltSync(10);
            this.data.password = bcrypt.hashSync(this.data.password, salt);
           await  userCollection.insertOne(this.data);
           this.getAvatar()
            resolve()
        }else{
            reject(this.errors)
        }


    })
}
User.prototype.getAvatar = function(){
    this.avatar = `https://gravatar.com/avatar/${md5(this.data.email)}?s=128`
}
User.findByUsername = function(username){
return new Promise((resolve,reject)=>{
    if(typeof(username) != "string"){
        reject()
        return
    }
    userCollection.findOne({username: username}).then((userDoc)=>{
        if(userDoc){
            userDoc = new User(userDoc,true)
            userDoc = {
                _id:userDoc.data._id,
                username: userDoc.data.username,
                avatar:userDoc.avatar
            }
            resolve(userDoc)
        }else{
            reject()
        }
    }).catch(()=>{
        reject()
    })
})
}
module.exports = User