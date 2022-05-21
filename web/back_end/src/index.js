require('dotenv').config()
//express-related
const express = require('express');
const cors = require('cors');
//handlers
const {
    getAlarms, 
    postLogin, postAccount, postAlarm,
    deleteAlarm
} = require('./handlers/handler-man');

const {alarmTask} = require('./database/db-man');


const app = express();
app.listen(3001, () => {console.log('Running on port 3001')})
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//endpoints.
app.post('/api/login', postLogin);
app.post('/api/create_account', postAccount);
app.post('/api/create_alarm', postAlarm);
app.post('/api/delete_alarm', deleteAlarm);
app.get('/api/fetch_alarms', getAlarms);

//taks
alarmTask();