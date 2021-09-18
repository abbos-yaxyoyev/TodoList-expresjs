
//* cd TodoBackend
const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv').config(); //? require(-r)
const app = express();

require('express-async-errors');

const { errorStatus500, errorStatus404 } = require('./middlewares/errorMidleware')
const { checkUser, checkToken } = require('./middlewares/authMiddleware');
const { newUserSaveRouter } = require('./routes/routesNewUser');
const { todoListRouter } = require('./routes/routesTodoList');
const { authRouter } = require('./routes/routesAuthUser');

const { logger, processHandler } = require('./utils/logger');
const { prodMidleware } = require('./middlewares/prodMidleware')
console.log('11');
processHandler()
prodMidleware(app)
console.log('22');

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));

console.log('33');
app.use('/api/checkedToken', checkToken);
app.use('/api/authRouter', authRouter);
app.use('/api/newUserSaveRouter', newUserSaveRouter);
app.use('/api/todoList', checkUser, todoListRouter);
console.log('44');
app.use(errorStatus500);
app.use(errorStatus404);
console.log('55');

const port = process.env.PORT
app.listen(port, () => logger.info('Server is running on port 3000...'))
