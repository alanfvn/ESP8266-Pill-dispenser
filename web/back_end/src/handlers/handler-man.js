const {
    verifyUser, createUser, createAlarm, 
    fetchAlarms, delAlarm,
} = require('../database/db-man');

const postLogin = async (req, res) => {
    
    const {user, password} = req.body;
    const data = await verifyUser(user, password);
    const uname = data[0]["login"];
    
    if(!uname){
        res.status(401).end();
        return;
    }
    res.json({username: uname});
}


const postAccount = async (req, res) =>{
    const {user, password, name, surname} = req.body;
    const dbResp = await createUser(name, surname, user, password);
    res.json({create_account_status_code: dbResp[0]['res']});
}


const postAlarm = async (req, res) =>{
    const {user, alarm, hour , day} = req.body;
    const dbResp = await createAlarm(user, alarm, hour, day);
    res.json({create_alarm_status_code: dbResp[0]['response']});
}


const getAlarms = async (req, res) => {

    const authHeader = req.headers['authorization'];
    const user = authHeader && authHeader.split(' ')[1]

    if(!user){
        res.status(403).end();
        return;
    }
    const dbResp = await fetchAlarms(user);
    res.json(dbResp);
}

const deleteAlarm = async (req, res) => {
    const {alarm_id} = req.body;
    const dbResp = await delAlarm(alarm_id);
    res.json({delete_alarm_status_code: dbResp});
}

module.exports = {
    getAlarms,
    postLogin,
    postAccount,
    postAlarm,
    deleteAlarm,
}