const express = require('express');
const path = require('path')
const user = require('./db/userData');
const moment = require('moment');
const bcrypt = require('bcrypt');
const session = require('express-session');

if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const app = express();
const calendar = getCalendar();

app.use(session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 604800000                                   // a week
    }
}))


app.use(express.json());
app.use(express.urlencoded( {extended: true}))
app.use(express.static(path.join(__dirname,'/public')));


app.get('/', isLoggedIn,  (req, res)=>{
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/calendar', (req, res)=>{
    res.send(JSON.stringify(calendar));
})

app.get('/successfulDays', isLoggedIn, async (req, res)=>{
    let email = req.session.email;
    let successfulDays = await user.getSuccessfulDays(email);
    res.send(JSON.stringify(successfulDays));
})

app.post('/successfulDays', isLoggedIn, async (req, res)=>{
    let today = moment().utc().startOf('day');
    let submittedDay = moment(req.body.data).utc().startOf('day');
    let successfulDays = await user.getSuccessfulDays(req.session.email);
    
    if (today.isSame(submittedDay)){ 
        if (successfulDays.includes(submittedDay.toISOString())){ return  res.status(200).end(); }
        let appendAttempt = await user.appendSuccessfulDay(req.session.email, submittedDay.toISOString());
        if (appendAttempt == true){ res.status(200).end(); }
        else { res.status(500).end(); }
    }
    else{ res.status(400).end(); }
})

app.get('/login', isNotLoggedIn, (req, res)=>{
    res.sendFile(path.join(__dirname, '/login.html'));
})

app.post('/login', isNotLoggedIn, async(req, res)=>{
    try{
        if (await user.userExists(req.body.email) == false){ return res.status(400).end("Wrong email or password."); }
        let userData = await user.getUserInformation(req.body.email);
        let passwordMatch = await bcrypt.compare(req.body.password, userData.password);
        if (passwordMatch && userData.email == req.body.email){
            req.session.authenticated = true;
            req.session.email = req.body.email;
            res.redirect('/');
        }
        else{
            res.status(400).end("Wrong email or password.")
        }
    }catch(err){
        res.status(500).end("Server error.")
    }
})

app.get('/signup', isNotLoggedIn, (req, res)=>{
    res.sendFile(path.join(__dirname, '/signup.html'));
})

app.post('/signup', isNotLoggedIn, async (req, res)=>{
    try{
        if (await user.userExists(req.body.email)){ return res.status(400).end("User already exists.") }

        if(req.body.password != req.body.passwordConfirm){ return res.status(400).end("Password do not match!"); }
        
        let password = await bcrypt.hash(req.body.password, 11);
        let result = await user.createUser(req.body.email, password, req.body.name);
        if (result == true){
            res.end("Signup successful.");
        }else{
            res.end("Signup failed");
        }
    }catch(err){
        console.log("Error occured", err);
        res.status(500).end("Server Error.");
    }
})

function isLoggedIn(req, res, next){
    if (req.session.authenticated){ next(); }
    else{  res.redirect('/login'); }
}   

function isNotLoggedIn(req, res, next){
    if (!req.session.authenticated){ next(); }
    else{ res.redirect('/'); }
}


function getCalendar(year) {
    if (!year) year = moment().get('year');
    if (Number.isInteger(year) == false) throw ('year is not an integer');

    let day = moment([year]).startOf('year');
    let lastDay = moment([year]).endOf('year');
    let yearlyCalender = [];

    for (day; day <= lastDay; day.add(1, 'day')) {
        yearlyCalender.push(day.clone().toISOString());
    }
    return yearlyCalender;
}

app.listen(process.env.PORT || 8080);