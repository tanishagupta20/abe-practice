const express = require('express');
const app = express();
const session = require('express-session')
const cookieParser = require('cookie-parser')
const { Router } = require("express")
const client = require("mongodb").MongoClient

let db;

client.connect("mongodb+srv://u1181:admin@cluster0.hjqegxc.mongodb.net/?retryWrites=true&w=majority", (error, database) => {
    if (error) {
        console.log(error.message)
    }
    else {
        db = database.db("test")
        console.log("Ho gaya connect :)")
    }
})

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
    secret: '6789wshdjfnjdsyt678w9q',
    saveUnitialized: false,
    resave: false,
    cookie: { maxAge: 800000 }
}))
app.use(cookieParser())

app.get('/', (req, res) => {
    res.render("signup");
})

app.get('/login', (req, res) => {
    res.render('login');
})

app.get('/dashboard', async (req, res) => {
    if (req.session.usn == undefined) {
        res.redirect('/login');
    }
    else {
        const token = req.cookies['connect.sid']
        console.log(token)
        await db.collection("tokens").insertOne({
            token: token,
            username: req.session.usn
        })
        res.render('dashboard', { name: req.session.name })
    }
})

app.post('/addUser', async (req, res) => {
    try {
        const userData = req.body;
        console.log(typeof (userData));
        console.log(userData);

        console.log('Username ' + req.body.usn);

        const existingUser = await db.collection("users").findOne({
            username: userData.username
        })

        if (existingUser) {
            res.status(400).json({ error: true, message: "User already exists!" })
            return;
        }

        await db.collection("users").insertOne({
            username: userData.usn,
            name: userData.name,
            email: userData.email,
            password: userData.pwd
        })

        res.status(200).json({ message: "User registered!" })
        // fs.readFile('./users.json', (err, data) => {
        //     const users = JSON.parse(data.toString());
        //     console.log(users);
        //     const userExists = users.filter((usr) => {
        //         console.log('usr usn ' + usr.usn)
        //         if (usr.usn == userData.usn) {
        //             return true;
        //         }
        //     })

        //     console.log(userExists);

        //     if (userExists.length == 1) {
        //         res.status(400).json({ message: "User Exists!" })
        //     }
        //     else {
        //         const newUser = {
        //             usn: req.body.usn,
        //             name: req.body.name,
        //             email: req.body.email,
        //             pwd: req.body.pwd
        //         }

        //         users.push(newUser)
        //         fs.writeFile('./users.json', JSON.stringify(users), (err) => {
        //             if (err) {
        //                 console.log(err.message)
        //             }
        //             else {
        //                 res.status(200).json({ message: "User registered!" })
        //             }
        //         })
        //     }
        // })
    }
    catch (e) {
        console.log(e.message)
    }
})

app.post('/authenticateUser', async (req, res) => {
    const userData = req.body;
    console.log(userData);

    const existingUser = await db.collection("users").findOne({
        username: data.username
    })

    if (!existingUser) {
        res.redirect('/');
        return;
    }

    if (userData.pwd == existingUser.password) {
        req.session.usn = userData.usn;
        res.redirect('/dashboard')
    }
    else {
        res.status(400).json({ error: true, message: "Invalid credentials!" })
    }
    // fs.readFile('./users.json', (err, data) => {
    //     if (err) {
    //         console.log(err.message)
    //     }
    //     else {
    //         const users = JSON.parse(data.toString())
    //         const userExists = users.filter((usr) => {
    //             if (usr.usn == userData.usn) {
    //                 return true;
    //             }
    //         })

    //         if (userExists.length == 1) {
    //             const checkUser = userExists.filter((usr) => {
    //                 if (usr.pwd == userData.pwd) {
    //                     return true;
    //                 }
    //             })

    //             if (checkUser.length == 1) {
    //                 req.session.usn = userData.usn;
    //                 res.redirect('/dashboard')
    //             }
    //             else {
    //                 res.status(400).json({ message: "Invalid credentials!" })
    //             }
    //         }
    //         else {
    //             res.redirect('/');
    //         }
    //     }
    // })
})

app.listen(3000, () => {
    console.log("Server Started!");
})

// ----------------------------------------------- //

/* const express = require('express')
const app = express()
const client = require('mongodb').MongoClient

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let dbinstance;
app.get("/", async (req, res) => {

    await client.connect("mongodb+srv://rashmika:3882@cluster0.dxpgbzg.mongodb.net/?retryWrites=true&w=majority/")
        .then((database) => {
            dbinstance = database.db("sample_airbnb")        // database name
            console.log("Connected to the database");
        }).catch((err) => {
            console.log("Error in connecting with the database: ", err);
        })

    dbinstance.collection('listingsAndReviews')          // collection name
        .find({}).limit(10).toArray()
        .then(arr => {
            console.log(arr)
            res.end("Check console")
        })
        .catch(err => console.log(err));

})

app.listen('3000', () => {
    console.log('Server running at port 3000')
}) */