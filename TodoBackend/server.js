
//* cd TodoBackend
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
// require(-r)
const { todoListRouter } = require('./routes/routesTodoList');
const { authRouter } = require('./routes/routesAuthUser');
const { newUserSaveRouter } = require('./routes/routesNewUser');
const { checkUser, checkToken } = require('./middlewares/authMiddleware');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.use(express.json({ extended: true }))


app.use('/api/checkedToken', checkToken);
app.use('/api/authRouter', authRouter);
app.use('/api/newUserSaveRouter', newUserSaveRouter);
app.use('/api/todoList', checkUser, todoListRouter);

const port = process.env.PORT
app.listen(port, () => console.log('Server is running on port 3000...'))
