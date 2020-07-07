const Post = require("../models/Post")
exports.viewCreateScreen = function (req,res){
    res.render('create-post')
} 
exports.create = function(req,res){
let post = new Post(req.body,req.session.user._id)
post.create().then((newId)=> {
    req.flash("success","new post successfuly created")
    req.session.save(()=>res.redirect(`/post/${newId}`))
}).catch((errors)=>{
    errors.forEach(error => req.flash("errors",error))
    req.session.save(()=>redirect('/create-post'))
})
}
exports.viewSingle = async function(req,res){
   try{
        let post = await Post.findSingleById(req.params.id,req.visitorId)
        res.render('single-post-screen',{post:post})
   }
   catch
   {
    res.render("404")
   }
}
exports.viewEditScreen = async function(req,res){
  try {
      let post = await Post.findSingleById(req.params.id)
      if(post.authorId == req.visitorId){
        res.render('edit-post', {
            post: post
        })
      }else{
        req.flash("errors","you do not have permission to perform this action")
        req.session.save(()=>res.redirect('/'))
      }
  } catch  {
      res.render('404')
  }
}
exports.edit = function(req,res){
    let post = new Post(req.body,req.visitorId,req.params.id)
    post.update().then((status)=>{
        //if post was succesfully updated
        //or user had permission but had validation errors
        if(status == "success"){
            //post was updated in db
            req.flash("success","update was successful")
            req.session.save(()=>{
                res.redirect(`/post/${req.params.id}/edit`)
            })
        }else{
            //if validation errors
            post.errors.forEach((error)=>{
                req.flash("errors",error)
            })
            req.session.save(()=>{
                res.redirect(`/post/${req.params.id}/edit`)
            })
        }
    }).catch(()=>{
        //if post with requested id doest exist
        //or if the current visitor is not owner of the post
        req.flash("errors","you do not have permission to perform this task")
        req.session.save(()=>{
            res.redirect('/')
        })
    })
}
exports.delete = function(req,res){
    Post.delete(req.params.id,req.visitorId).then(()=>{
        req.flash("success","post deleted successfuly")
        req.session.save(()=>{res.redirect(`/profile/${req.session.user.username}`)})
    }).catch(()=>{
        req.flash("errors","you do not have permission to perfom this action")
        req.session.save(()=>{res.redirect('/')})
    })
}
exports.search = function(req,res){
    Post.search(req.body.searchTerm).then(posts=>{
        res.json(posts)
    }).catch(()=>{
        res.json([])
    })
}