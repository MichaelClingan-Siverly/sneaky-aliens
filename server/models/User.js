const mongoose = require('mongoose')

let UserSchema = new mongoose.Schema(
    {
		name: String,
		saltedPassHash: String,
		salt: String,
		loggedIn: {type: Boolean, default: false}
    }
);

UserSchema.methods.logIn = function() {
	loggedIn = true;
}

UserSchema.methods.logOut = function() {
	loggedIn = false;
}

module.exports = mongoose.model('User', UserSchema)