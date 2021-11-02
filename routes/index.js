/*::::::::::::::::::::::::::::::::::::::::
::::::::  Required Dependencies  :::::::::
::::::::::::::::::::::::::::::::::::::::*/

const express = require('express');
const router = express.Router();
const { google } = require('googleapis');



/*::::::::::::::::::::::::::::::::::::::::
:::::::  Async Handler Function  :::::::::
::::::::::::::::::::::::::::::::::::::::*/

function asyncHandler(cb) {
    return async(req, res, next) => {
        try {
        await cb(req, res, next)
        } catch(error){
        // Forward error to the global error handler
        next(error);
        }
    }
}



/*::::::::::::::::::::::::::::::::::::::::
::::::  Date & Time Object Handling  :::::
::::::::::::::::::::::::::::::::::::::::*/

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function renderCivilianTime(date) {
    let hour = date.getHours();
    let minute = date.getMinutes();
    if (hour > 12) {
        return `${hour - 12}:${minute}PM`;
    } else if (hour < 12) {
        return `${hour}:${minute}AM`;
    }
}



/*::::::::::::::::::::::::::::::::::::::::
:::::::::::  Backend Routes  :::::::::::::
::::::::::::::::::::::::::::::::::::::::*/

router.get('/', asyncHandler(async (req, res) => {
    res.render('form', { submission: {} } );
}));

router.post('/form', asyncHandler(async( req, res) => {

    console.log(req.body);

    let today = new Date();
    let dateOfPost = `${days[today.getDay()]} ${months[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`
    let timeOfPost = renderCivilianTime(today);
    const { name, phone } = req.body;

    const auth = new google.auth.GoogleAuth({
        keyFile: "keys.json",
        scopes: process.env.SCOPE
    })

    const authClientObject = await auth.getClient();

    const googleSheetsInstance = google.sheets({ version: "v4", auth: authClientObject });

    const spreadsheetId = process.env.SPREADSHEET_ID;

    await googleSheetsInstance.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: "Sheet1!A:D",
        valueInputOption: 'RAW',
        resource: {
            values: [[ name, phone, dateOfPost, timeOfPost ]]
        }
    })

    res.redirect('/');
}))



/*::::::::::::::::::::::::::::::::::::::::
::::::::::  Exporting Routes  ::::::::::::
::::::::::::::::::::::::::::::::::::::::*/

module.exports = router;