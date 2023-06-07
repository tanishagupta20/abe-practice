const express = require('express');
const app = express();
// const fs = require('fs');
const session = require('express-session')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
const User = require('./models/User');
const Token = require('./models/Token');
const UserRoutes = require('./routes/userRoutes')

const connectionstr = 'mongodb+srv://u1181:admin@cluster0.hjqegxc.mongodb.net/?retryWrites=true&w=majority'

mongoose.connect(connectionstr);
mongoose.connection.on('connected', async function () {
    console.log('Mongoose connection open')
    // await new User({username : 'dummyUsn'}).save()
})

app.set('view engine', 'ejs');

app.use(express.static(__dirname))
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
    secret: '6789wshdjfnjdsyt678w9q',
    saveUnitialized: false,
    resave: false,
    cookie: { maxAge: 800000 }
}))
app.use(cookieParser())
app.use("/user", UserRoutes)

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
        const usersArr = await User.find({}).limit(2);
        const user = await User.findOne({ username: req.session.usn })
        const image = user.userImage
        res.render('dashboard', { name: req.session.usn, image: "/uploads/" + image , usersArr : usersArr})
    }
})

app.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/login');
})

app.post('/addUser', async (req, res) => {
    try {
        const userData = req.body;
        console.log(typeof (userData));
        console.log(userData);

        console.log('Username ' + req.body.usn);

        const existingUser = await User.findOne({ username: userData.usn })

        if (existingUser) {
            res.status(400).json({ error: true, message: "User already exists!" })
            return;
        }

        const user = await new User({ username: userData.usn, name: userData.name, email: userData.email, password: userData.pwd }).save()
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

    const existingUser = await User.findOne({ username: userData.usn })

    if (!existingUser) {
        res.redirect('/');
        return;
    }

    if (userData.pwd == existingUser.password) {
        req.session.usn = userData.usn;
        const token = req.cookies['connect.sid']
        await new Token({username : userData.usn, token : token}).save()
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