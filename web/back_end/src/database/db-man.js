const {Pool} = require('pg');
const {getDateFromTime} = require('../util/utils');
const notifyESP8266 = require('../util/httpman');

const conPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
})

async function verifyUser(name, pass){
    const client = await conPool.connect();
    const data = await client.query(
        'select * from login($1, $2)', 
        [name, pass]
    );
    client.release();
    return data.rows;
}

async function createUser(names, surname, username, pass){
    const client = await conPool.connect();
    const data = await client.query(
        'call create_user($1, $2, $3, $4, $5)', 
        [names, surname, username, pass, '']
    );
    client.release();
    return data.rows;
}

async function createAlarm(user, a_name, a_time, a_day){
    const client = await conPool.connect();
    const data = await client.query(
        'call create_alarm($1, $2, to_timestamp($3, \'HH24:MI\')::time, $4, $5)', 
        [user, a_name, a_time, parseInt(a_day), '']
    );
    client.release();
    return data.rows;
}                           

async function fetchAlarms(user){
    const client = await conPool.connect();
    const data = await client.query('select * from user_alarms where username = $1', [
        user
    ])
    client.release();
    return data.rows;
}

async function delAlarm(id){
    const client = await conPool.connect();
    const dbResp = await client.query('delete from tb_alarms where id_alarm = $1', [id]);
    client.release();
    return dbResp.rows;
}


async function alarmTask(){
    const client = await conPool.connect();
    setInterval(() => {
        const now = new Date();
        client.query('select * from alarms_to_notify').then(resp =>{
            for(const row of resp.rows){
                const a_time = getDateFromTime(row.alarm_time);
                const user = row.username;
                const alarm = row.alarm_name;
                if(now >= a_time){
                    client.query('call notify_alarm($1)', [row.id_alarm]);
                    notifyESP8266(user, alarm);
                }
            }
        });
    }, 1000*3);
    //check alarm every 3 seconds.
}


module.exports = {
    verifyUser, fetchAlarms, 
    createUser,createAlarm,
    delAlarm, alarmTask
}