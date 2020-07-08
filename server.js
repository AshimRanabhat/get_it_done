const express = require('express');
const path = require('path')
const user = require('./db/userData');
const moment = require('moment');
const bcrypt = require('bcrypt');

if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const app = express();
const calendar = getCalendar();

app.use(express.json());
app.use(express.urlencoded( {extended: true}))
app.use(express.static(path.join(__dirname,'/public')));

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/calendar', (req, res)=>{
    res.send(JSON.stringify(calendar));
})

app.get('/successfulDays', (req, res)=>{
    res.send(JSON.stringify(user.getsuccessfulDays()));
})

app.post('/successfulDays',async (req, res)=>{
    let today = moment();
    if (today.isSame(req.body.data)){ 
        let appendAttempt = await user.appendSuccessfulDay();
        if (appendAttempt == true){ res.sendStatus(200); }
        else { res.sendStatus(500) }
    }
    res.sendStatus(400);
})

app.get('/signup', (req, res)=>{
    res.sendFile(path.join(__dirname, '/signup.html'));
})

app.post('/signup',async (req, res)=>{
    try{
        if (await user.userExists(req.body.email)){ res.status(400).send("User already exists.") }

        if(req.body.password != req.body.passwordConfirm){
            res.status(400).send("Password do not match!");
        }
        let password = await bcrypt.hash(req.body.password, 11);
        let result = await user.createUser(req.body.email, password, req.body.name);
        if (result == true){
            res.send("Signup successful.");
        }else{
            res.send("Signup failed");
        }
    }catch(err){
        console.log("Error occured", err);
        res.status(500).send("Server Error.");
    }
})


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