const express = require('express')
const app = express()
const port = 3000


var mongoose = require('mongoose'),
    User = require('./Models/modelUser.js');

app.get('/createUser', (req, res) => {
    // create a user a new user
    var testUser = new User({
        name: 'dupont',
        firstname: 'jean',
        email: 'jeandupont@gmail.com',
        password: 'Motdepasse123'
    });

    // save user to database
    testUser.save(function (err) {
        if (err) throw err;
    });

    res.send('OK')
})

app.get('/testMdp', (req, res) => {
    // fetch user and test password verification
    User.findOne({ email: 'jeandupont@gmail.com' }, function (err, user) {
        if (err) throw err;

        // test a matching password
        user.comparePassword('Motdepasse123', function (err, isMatch) {
            if (err) throw err;
            console.log('Motdepasse123:', isMatch); // -> Motdepasse123: true
        });

        // test a failing password
        user.comparePassword('123Motdepasse', function (err, isMatch) {
            if (err) throw err;
            console.log('123Motdepasse:', isMatch); // -> 123Motdepasse: false
        });
    });

    res.send('OKMdp')
})

//to access form data
let bodyParser = require('body-parser');

const http404 = require('./middleware/route404');

//used to fetch the data from forms on HTTP POST, and PUT
app.use(bodyParser.urlencoded({

    extended : true
  
  }));
  
app.use(bodyParser.json());
  
app.get('/', (req, res) => {
  res.send('Hello World!')
})

//Accessing the routes for the user
const userRoutes = require('./routes/routeUser');

//Acces the routes 
app.use(userRoutes);

app.use(http404.notFound); 
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})

var connStr = 'mongodb://localhost:27017/mongoose-bcrypt-test';
mongoose.connect(connStr, function (err) {
    if (err) throw err;
    console.log('Successfully connected to MongoDB');
});
