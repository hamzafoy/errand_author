/*::::::::::::::::::::::::::::::::::::::::
::::::::  Required Dependencies  :::::::::
::::::::::::::::::::::::::::::::::::::::*/

const express = require('express');



/*::::::::::::::::::::::::::::::::::::::::
:::  Using Express, enabling routes,  ::::
::::        & setting up Pug          ::::
::::::::::::::::::::::::::::::::::::::::*/

const application = express();
application.use(express.json());
application.set('view engine', 'pug');