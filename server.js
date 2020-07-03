const express = require('express');
const path = require('path')
const services = require('./services');

const app = express();
const calendar = services.getCalendar();

app.use(express.static(path.join(__dirname,'/public')));

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/calendar', (req, res)=>{
    res.send(JSON.stringify(calendar));
})

app.get('/successfulDays', (req, res)=>{
    res.send(JSON.stringify(services.successfulDays));
})

app.listen(process.env.PORT || 8080);