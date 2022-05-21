const Axios = require('axios');
const httpMan = Axios.create({baseURL: process.env.ESP8266_URL});


async function notifyESP8266(user, alarm_name){
    
    try{
        const {data} = await httpMan.post('/servo', {
            "nombre_persona": cutString(user),
            "nombre_alarma": cutString(alarm_name),
        });
        return data;
    }catch (err){
        console.log(err);
        return null;
    }
}

function cutString(name){
    let cortado = name;
    if(name?.length > 15){
        cortado = name?.substring(0, 13);
        cortado += "...";
    }
    return cortado;
}


module.exports = notifyESP8266;