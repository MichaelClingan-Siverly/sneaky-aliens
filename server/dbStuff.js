/**
 * helper file to hold all of the actions I do on the database.
 * 
 */

const MongoClient = require('mongodb').MongoClient;
const crypto = require('crypto');
const userCollection = 'users';
const roomCollection = 'rooms';
var client;
var db;

// Connect to the db
//TODO I'll need to change this connect bit when moving to production
MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, function (err, mongoClient) {
    if (err)
        throw err;
    else {
        client = mongoClient;
        db = client.db('sneaky-aliens');
        console.log("connected to DB");
    }
});

//crypto functions from: https://ciphertrick.com/2016/01/18/salt-hash-passwords-using-nodejs-crypto/
function genRandomString(length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0, length);   /** return required number of characters */
};

function sha512(password, salt) {
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    return hash.digest('hex');
};

/**
 * check DB. if user doesn't exist or if pass is incorrect, return false.
 * else, return true
 * @param {String} name 
 * @param {String} pass
 * @param {function} res accepts a boolean argument. true if user was logged in, false if not
 */
function login(name, pass, res){
    var query = { userName: name};
    db.collection(userCollection).findOne(query, function (err, result) {
        if (err){
            console.log(err);
            throw err;
        }
        else if(result === null){
            res(false);
        }
        else{
            var salt = result['salt'];
            var saltedPass = sha512(pass, salt);
            res(saltedPass === result['passHash']);
        }
    });
}

/**
 * check DB. if user exists, return false.
 * else: generate salt, salt the pass, store the name, salted pass, and salt
 * @param {String} name
 * @param {String} pass
 * @param {function} res accepts a boolean argument. true if registration was successful, false if not
 */
function register(name, pass, res) {
    var query = { userName: name };
    db.collection(userCollection).findOne(query, function (err, result) {
        if (err){
            console.log(err);
            throw err;
    }
        else if(result !== null){
            res(false);
        }
        else{
            var salt = genRandomString(64);
            var saltedPass = sha512(pass, salt);
            var usrEntry = { userName: name, passHash: saltedPass, salt: salt};
            db.collection(userCollection).insertOne(usrEntry, function(err, result){
                if (err)
                    throw err;
                else
                    res(true);
            });
        }
    });
};