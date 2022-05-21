function getDateFromTime(time){
    const date = new Date();
    const data = time.split(":");
    date.setHours(data[0], data[1], data[2]);
    return date;
}

module.exports = {getDateFromTime};