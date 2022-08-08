const moment = require('moment'); //to get the time of the message

function formatMessage(username, text)
{
    return {
        username,
        text,
        time: moment().format('h:mm a')
    }
}
module.exports = formatMessage;