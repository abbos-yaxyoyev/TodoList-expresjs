const Joi = require('joi');
function validateTodoList(todoList) {
    const todoValidates = Joi.object({
        title: Joi.string().required().min(3),
    });

    return todoValidates.validate(todoList);
}

function errorUserNotFound(res, user) {
    if (!user) {
        res.status(404).send(JSON.stringify({ message: "user not found" }))
    }
}


module.exports = {
    validateTodoList,
    errorUserNotFound
}