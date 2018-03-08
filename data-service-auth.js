const mongoose = require('mongoose');
const temp = require("bcryptjs");
mongoose.Promise = global.Promise; //taken from week 8/12 notes
let Schema = mongoose.Schema;


var userSchema = new Schema ({
    "user" : {
        "type" : String,
        "unique" : true
      },
    "password" : String
});

let user;

module.exports.initialize = ()=>
{
  return new Promise((resolve,reject) =>
  {
    let db = mongoose.createConnection("mongodb://slahsaee:6250632asdqwe@ds135777.mlab.com:35777/bti325_sina_a7");
    db.on('error', (err) =>
    {
      reject(err); // reject the promise with the provided error
    });
    db.once('open', () =>
    {
      User = db.model("users", userSchema);
      resolve();
    });
  });
};


module.exports.registerUser = (userData) =>{
  return new Promise(function(resolve,reject) 
  {
    if(userData.password != userData.password2)
    {   
        reject("Passwords do not match");
    }
    else
    {
      // Taken from Week 12
      temp.genSalt(10, function(err, salt) 
      { 
        temp.hash(userData.password, salt, function(err, hash) 
        { 
          if(err)
          {
            reject("There was an error encrypting the password " + err);
          }
          else
          {
            userData.password = hash;
            let newUser = new User(userData);

            newUser.save((err) =>
            {
              if(err)
              {
                if(err.code == "11000")
                {
                    reject("Username already taken");
                }
                else if(err)
                {
                    reject("There was an error creating the user: " + err);
                }
              }
              else
              {
                resolve();
              }
            });
          }
        });
      });
    }
  });
};


module.exports.checkUser = (userData)=>{
  return new Promise((resolve,reject) =>
  {
    User.find({user: userData.user}).exec().then((users) =>
    {
      // Taken from Weekly notes
      temp.compare(userData.password, users[0].password).then((res) => 
      {
        if(res === true)
        {
            resolve();
        }
        else if(res === false)
        {
          reject("Incorrect Password, Please Try again!: " + userData.user);
        }
      });
    }).catch((err) =>
    {
      reject("Unable to find user: " + userData.user);
    });
  });
};