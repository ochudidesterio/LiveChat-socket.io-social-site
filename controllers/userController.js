 const User = require('../models/User')
const Post = require('../models/Post')
const Follow = require('../models/Follow')

exports.sharedProfileData =async function(req,res,next){
    let isVisitorsProfile = false
    let isFollowing = false
    if(req.session.user){
        isVisitorsProfile = req.profileUser._id.equals(req.session.user._id)
     isFollowing=  await Follow.isVisitorFollowing(req.profileUser._id,req.visitorId)
    }
    req.isVisitorsProfile = isVisitorsProfile
    req.isFollowing = isFollowing

    //retrieve posts,follower and following counts

    let countPostPromise = Post.countPostByAuthor(req.profileUser._id)
    let followersCountPromise = Follow.countFollowersById(req.profileUser._id)
     let followingCountPromise = Follow.countFollowingById(req.profileUser._id)

    let [postCount,followerCount,followingCount] = await Promise.all([countPostPromise,followersCountPromise,followingCountPromise])
    req.postCount = postCount
    req.followerCount = followerCount
    req.followingCount = followingCount

    next()
}
exports.mustBeLoggedIn = function(req,res,next){
if(req.session.user){
    next()
}else{
    req.flash('errors',"you must be logged in to perform this task")
    req.session.save(function(){
        res.redirect('/')
    })
}
}
exports.login = function (req, res) {
    let user = new User(req.body);
    user.login().then((result) => {
        req.session.user = {
            avatar: user.avatar,
            username: user.data.username,
            _id: user.data._id
        }
        req.session.save(function () {
            res.redirect('/')
        })
    }).catch((err) => {
        req.flash('errors', err)
        req.session.save(function () {
            res.redirect('/')

        })
    });
}
exports.logout = function (req, res) {
    req.session.destroy(function () {
        res.redirect('/')
    });
}
exports.register = function (req, res) {
    let user = new User(req.body);
    user.register().then(()=>{
        req.session.user = {username: user.data.username, avatar:user.avatar,_id:user.data._id}
        req.session.save(function () {
            res.redirect('/')
        })
    }).catch((regErrors)=>{
        regErrors.forEach(function (error) {
            req.flash('regErrors', error)
        })
        req.session.save(function () {
            res.redirect('/')
        })
    });
    
}
exports.home =async function (req, res) {
    if (req.session.user) {
        //fetch feed for post for current user
        let posts =await Post.getFeed(req.session.user._id)
        res.render('home-dashboard',{posts: posts})
    } else {
        res.render('home-guest',{regErrors:req.flash('regErrors')})
    }
}
exports.ifUserExists = function(req,res,next){
User.findByUsername(req.params.username).then((userDocument)=>{
req.profileUser = userDocument
next()
}).catch(()=>{
res.render('404')
})
}
exports.profilePostScreen = function(req,res){
    //ask post model for posts by certain userid

    Post.findAuthorById(req.profileUser._id).then((posts)=>{
res.render('profile', {
    currentPage: "posts",
    posts:posts,
    profileUsername: req.profileUser.username,
    profileAvatar: req.profileUser.avatar,
    isFollowing: req.isFollowing,
    isVisitorsProfile: req.isVisitorsProfile,
    counts:{postCount: req.postCount, followerCount: req.followerCount, followingCount: req.followingCount}
})
    }).catch(()=>{
        res.render('404')
    })

}
exports.profileFollowersScreen =async function(req,res){
   try {
       let followers = await Follow.getFollowersById(req.profileUser._id)
       res.render('profile-followers', {
            currentPage: "followers",
           followers: followers,
           profileUsername: req.profileUser.username,
           profileAvatar: req.profileUser.avatar,
           isFollowing: req.isFollowing,
           isVisitorsProfile: req.isVisitorsProfile,
               counts: {
                   postCount: req.postCount,
                   followerCount: req.followerCount,
                   followingCount: req.followingCount
               }

       })
   } catch {
       res.render('404')
   }
}
exports.profileFollowingScreen = async function (req, res) {
    try {
        let following = await Follow.getFollowingById(req.profileUser._id)
        res.render('profile-following', {
            currentPage:"following",
            following: following,
            profileUsername: req.profileUser.username,
            profileAvatar: req.profileUser.avatar,
            isFollowing: req.isFollowing,
            isVisitorsProfile: req.isVisitorsProfile,
                counts: {
                    postCount: req.postCount,
                    followerCount: req.followerCount,
                    followingCount: req.followingCount
                }

        })
    } catch {
        res.render('404')
    }
}