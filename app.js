/*::::::::::::::::::::::::::::::::::::::::
::::::::  Required Dependencies  :::::::::
::::::::::::::::::::::::::::::::::::::::*/

const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');



/*::::::::::::::::::::::::::::::::::::::::
:::  Using Express, enabling routes,  ::::
::::        & setting up Pug          ::::
::::::::::::::::::::::::::::::::::::::::*/

const application = express();
application.use(express.json());
application.use(routes);
application.set('view engine', 'pug');
application.use(bodyParser.urlencoded({ extended: false }));
application.use('/static', express.static('public'));
application.listen(8080, () => {
    console.log(`Firing up the engines!`)
});


module.exports = application;