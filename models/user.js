const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/dbconfig');




const userSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    contactNumber: [
        {
            phoneNumber: String
        }
    ],
    messageList : [
        {
            msgId : String,
            msgText : String,
            msgType : String
        }
    ],
    IsVerified : Boolean,
    createdDate : { type: Date, default: Date.now },
});


//var newUser = new user();
var User = mongoose.model('User' , userSchema);

userSchema.statics.getuserById = function (id, callback) {
    user.findById(id, callback);
}

userSchema.statics.getuserByName = function (username, callback) {
    const query = { username: username };
    user.findOne(query, callback);
}

userSchema.statics.getuserByEmail = function (email, callback) {
    const query = { email: email };
    user.findOne(query, callback);
}

userSchema.statics.addUser = function (newUser, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

userSchema.statics.updateAddress = function(email , address , callback){
    mongoose.set('debug', true);
    var query = { email: email };
    var options = {upsert : true};
    //User.Update(query, {$push: { addrerssList : address }}, options, function(err){console.log(err);})     
    User.findOneAndUpdate(query, {$push: { addrerssList : address }}, options, callback)
}
userSchema.statics.verifyUser = function(email, callback){
    mongoose.set('debug', true);
    var conditions = { email : email }
    var update = {$set : {IsVerified : true}}
    User.update(conditions, update, callback)
}

userSchema.statics.addMessage = function(recvr , sender , msg , callback){
    mongoose.set('debug', true);
    var conditions = { username : recvr } 
    var recvr_update = {$push : {messageList:{msgId : 1 ,msgText : msg , msgType : 'R'} }};
    var sender_update = {$push : {messageList:{msgId : 1 ,msgText : msg , msgType : 'S'} }};
    User.update(conditions, recvr_update);
    User.update(conditions, sender_update , callback);
}

userSchema.statics.ComparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
}

const user = module.exports = mongoose.model('user', userSchema);

