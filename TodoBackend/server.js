
//* cd TodoBackend
const express = require('express');
const cors = require('cors');
const { todoListRouter } = require('./routes/routesTodoList')

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.use(express.json({ extended: true }))


app.use('/api/todoList', todoListRouter)

app.listen(3000, () => console.log('Server is running on port 3000...'))
