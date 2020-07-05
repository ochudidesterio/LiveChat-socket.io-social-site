const dotenv = require("dotenv");
dotenv.config();
const mongodb = require("mongodb");

// const url = 'mongodb://localhost/SocialSite';

mongodb.connect(process.env.CONNECTION,(err,client)=>{
module.exports = client;
const app = require("./app")
app.listen(process.env.PORT, () => console.log("server up an running"));

});