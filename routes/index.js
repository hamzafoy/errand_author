/*::::::::::::::::::::::::::::::::::::::::
::::::::  Required Dependencies  :::::::::
::::::::::::::::::::::::::::::::::::::::*/

const express = require('express');
const router = express.Router();
const { google } = require('googleapis');



/*::::::::::::::::::::::::::::::::::::::::
:::::::  Async Handler Function  :::::::::
::::::::::::::::::::::::::::::::::::::::*/

function asyncHandler(cb){
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
:::::::::::  Backend Routes  :::::::::::::
::::::::::::::::::::::::::::::::::::::::*/

router.get('/', asyncHandler(async (req, res) => {
    res.render('form', { submission: {} } );
}));

router.post('/form', asyncHandler(async( req, res) => {

    console.log(req.body);

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
        range: "Sheet1!A:B",
        valueInputOption: 'RAW',
        resource: {
            values: [[ name, phone ]]
        }
    })

    res.redirect('/');
}))



/*::::::::::::::::::::::::::::::::::::::::
::::::::::  Exporting Routes  ::::::::::::
::::::::::::::::::::::::::::::::::::::::*/

module.exports = router;