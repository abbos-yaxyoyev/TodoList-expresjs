const { getTodos, postCreatTodo, getId, deletModulTodo, patchModulCompleted, putModulTitle } = require('../models/TodoListModules');
const { validateTodoList, errorUserNotFound } = require('../utils/utils');

async function getAllTodos(req, res) {
    try {
        const users = await getTodos();
        errorUserNotFound(res, users);
        res.status(201).send(users)
    } catch (err) {
        res.status(500).send(JSON.stringify({ message: err.message }))
    }
}

async function getTodoById(req, res) {
    const { id } = req.params;
    try {
        const user = await getId(id);
        errorUserNotFound(res, user);
        res.status(201).send(user)
    } catch (err) {
        res.status(500).send(JSON.stringify({ message: err.message }))
    }
}

async function postTodo(req, res) {
    const { error, value } = validateTodoList(req.body);
    if (error) {
        return res.status(404).send(error.details.map(x => x.message).join(', '))
    }
    const { title } = req.body;
    try {
        const saveUser = await postCreatTodo(title);
        res.status(200).send(saveUser);
    } catch (err) {
        res.status(500).send(JSON.stringify({ message: err.message }))
    }
}

async function deleteTodo(req, res) {
    const { id } = req.params;
    try {
        const user = await getId(id);
        errorUserNotFound(res, user);
        const userDelete = await deletModulTodo(id)
        res.status(201).send(JSON.stringify({
            message: "Product has been deleted",
            todo: {
                ...JSON.parse(JSON.stringify(userDelete))
            }
        }))
    } catch (err) {
        res.status(500).send(JSON.stringify({ message: err.message }))
    }
}

async function patchCompleted(req, res) {
    const { id } = req.params;
    try {
        const user = await getId(id);
        errorUserNotFound(res, user);
        await patchModulCompleted(id, user)
        res.status(201).send(JSON.stringify({ message: "Product has been updated" }))
    } catch (err) {
        res.status(500).send(JSON.stringify({ message: err.message }))
    }
}

async function putTitle(req, res) {
    const { title } = req.body;
    const { id } = req.params;

    const { error, value } = validateTodoList(req.body);
    if (error) {
        return res.status(404).send(error.details.map(x => x.message).join(', '))
    }

    try {
        const user = await getId(id);
        errorUserNotFound(res, user);
        let str = await putModulTitle(id, title)
        res.status(201).send(str)
    } catch (err) {
        res.status(500).send(JSON.stringify({ message: err.message }))
    }
}

module.exports = {
    getAllTodos,
    getTodoById,
    postTodo,
    deleteTodo,
    patchCompleted,
    putTitle
}
