const mongoose = require('mongoose');
let Schema = mongoose.Schema;
var contentSchema = new Schema({
    "authorName": String,
    "authorEmail": String,
    "subject": String,
    "postedDate": Date,
    "commentText": String,
    "replies": [{
                "_id": String,
                "comment_id": String,
                "authorName": String,
                "authorEmail": String,
                "commentText": String,
                "repliedDate": Date
    }]
});

let Comment; 

module.exports.initialize = function () {
return new Promise(function (resolve, reject) {
    let db = mongoose.createConnection("mongodb://slahsaee:6250632asdqwe@ds159856.mlab.com:59856/bti325-a6");

    db.on('error', function(err){
        reject(err); 
    });
    db.once('open', function(){
       Comment = db.model("comments", contentSchema);
       resolve();
    });
});
};

module.exports.addComment = function(data){
return new Promise(function(resolve,reject) {
    data.postedDate = Date.now();
    let newComment = Comment(data);
    newComment.save(function(err){
        if(err){
            reject("Saving comments failed " + err);
        }
        else {
            resolve(newComment._id);
        }
    })
});
}

module.exports.getAllComments = function(){
return new Promise(function(resolve, reject) {
    Comment.find()
    .sort({postedDate: 1}).exec()
    .then(function(data){
        resolve(data);
    }).catch(function(err){
        reject("Comments could not be retrieved " + err);
    })
})
};


module.exports.addReply = function(data){
return new Promise(function(resolve,reject){
    data.repliedDate = Date.now();
    Comment.update({ _id: data.comment_id},  
        { $addToSet: { replies: data }} ).exec()
    .then(function(){
        resolve();
    }).catch(function(err){
        reject("Adding reply failed " + err);
    })
})
};