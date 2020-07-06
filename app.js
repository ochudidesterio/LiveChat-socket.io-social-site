const express = require('express');
const session = require("express-session");
const MonngoStore = require("connect-mongo")(session)
const flash = require("connect-flash")
const markdown = require('marked')
const sanitizeHTML = require('sanitize-html')
const app = express();

let sessionOptions = session({
    secret:"js",
    store: new MonngoStore({client: require("./db")}),
    resave:false,
    saveUninitialized:false,
    cookie:{maxAge:1000*60*60*24, httpOnly:true}
})
app.use(sessionOptions);
app.use(flash())

app.use(function(req,res,next){
    //make markdown function available on ejs
    res.locals.filterUserHTML = function(content){
        return sanitizeHTML(markdown(content),{allowedTags:['p','br','ol','ul','li','strong','i','bold','em','h1','h2','h6','h3','h4','h5'],allowedAttributes:{}})
    }
    //make all error and succes messages availabe from all templates
    res.locals.errors = req.flash("errors")
    res.locals.success = req.flash("success")
    //make current user id available from on req object
    if(req.session.user){req.visitorId = req.session.user._id}else{req.visitorId =0}
    //make user session data available from within view templates
    res.locals.user = req.session.user
    next()
})

const router = require('./router');


app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(express.static("public"));
app.set('views','views');
app.set('view engine','ejs');

app.use('/',router);

module.exports = app;