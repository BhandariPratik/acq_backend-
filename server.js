
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const route = require('./routes/routes')
const path = require('path')
const {productCron} = require('./controller/productController')
const {CronJob} = require('cron')

//middleware
app.use(bodyParser.json())
app.use(cors())
app.use('/api/v1', route)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

require('./models/connection');

const job = new CronJob(
	// '0 0 0 * * *', 
    '*/5 * * * * *',
    productCron,
	null,
    true 
);
job.start()

app.listen(4000, async () => {
    console.log('server listening on 4000 PORT')
})