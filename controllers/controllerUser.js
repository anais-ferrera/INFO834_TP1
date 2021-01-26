const jwt = require('jsonwebtoken');
function createToken(user) {
    return jwt.sign({id: user.id, username: user.username}, "My so secret sentence");
}

function signin(req, res) {

    let User = require('../Models/modelUser');

	User.findOne({email: req.body.account}, function(err, user) {
		if (err)
			throw err;

		if (user.comparePassword(req.body.password)) {
            req.session.email = req.body.account;
			req.session.logged = true;
			res.status(200).json({token: createToken(user)});
		}
		else
			res.redirect('/');
	});
}

function signup(req, res) {

    let User = require('../Models/modelUser');
	let user = new User();

	user.email = req.body.account;
	user.password = req.body.password;

	user.save((err, savedUser) => {

		if (err)
			throw err;

		res.redirect('/');

	});
}

function signout(req, res) {

    req.session.email = "";
	req.session.logged = false;
    res.redirect("/");

}

function profile(req, res) {

    if (req.session.logged)
        res.send("Profile");
    else
        res.redirect('/');

}


function createUser(req, res) {
    let User = require('../Models/modelUser');
    let newUser =  User ({
        name: req.body.name,
        firstname : req.body.firstname,
        email : req.body.email,
        password:req.body.password,
        token: generateToken(newUser)
    });
  
    newUser.save()
    .then((savedUser) => {

        //send back the created User
        res.json(savedUser);
            
    }, (err) => {
        res.status(400).json(err)
    });
}
function readUsers(req, res) {

    let User = require("../Models/modelUser");

    User.find({})
    .then((users) => {
        res.status(200).json(users);
    }, (err) => {
        res.status(500).json(err);
    });
 }

 function readUser(req, res) {

    let User = require("../Models/modelUser");

    User.findById({_id : req.params.id})
    .then((user) => {
        res.status(200).json(user);
    }, (err) => {
        res.status(500).json(err);
    });
 }

 function updateUser(req, res){

    let User = require("../Models/modelUser");

    User.findByIdAndUpdate({_id: req.params.id}, 
        {name: req.body.name, 
        firstname: req.body.firstname,
        email: req.body.email},
        {new : true})
    .then((updatedUser) => {
        res.status(200).json(updatedUser);
    }, (err) => {
        res.status(500).json(err);
    });
 }

 function deleteUser(req, res){

    let User = require("../Models/modelUser");

    User.findOneAndRemove({_id : req.params.id})
    .then((deletedUser) => {
        res.status(200).json(deletedUser);
    }, (err) => {
        res.status(500).json(err);
    });
 }

module.exports.read = readUser;
module.exports.reads = readUsers;
module.exports.create = createUser;
module.exports.update = updateUser;
module.exports.delete = deleteUser;
module.exports.signin = signin;
module.exports.signup = signup;
module.exports.signout = signout;
module.exports.profile = profile;