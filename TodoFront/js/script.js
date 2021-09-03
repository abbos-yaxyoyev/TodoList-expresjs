document.addEventListener("DOMContentLoaded", function () {
    const todoInput = document.querySelector('#input'),
        todoAddButton = document.querySelector('.btnAddTodo'),
        todoFilterTodo = document.querySelectorAll('.h3'),
        todoAllList = document.querySelector(".all-todos"),
        todoDoing = document.querySelector('.todo-doing'),
        todoDone = document.querySelector(".todo-done"),
        todoBtn = document.querySelector('.btn');

    const url = 'http://localhost:3000/api/todoList';

    todoAddButton.addEventListener('click', addTodolist);
    todoAllList.addEventListener('click', deleteTodo);
    todoDoing.addEventListener('click', deleteTodo);
    todoDone.addEventListener('click', deleteTodo);
    todoBtn.addEventListener('click', filterTodo);
    window.addEventListener('load', upDateAllTodo, true);

    function addTodolist(e) {
        e.preventDefault();
        if (todoAddButton.id) {
            editTodo(e)
        } else {
            todoAdd(e)
        }
    }

    async function todoAdd(e) {
        let liTag = document.createElement('li');

        await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: todoInput.value
            })
        })
            .then(res => res.json())
            .then(res => {
                let date = date_to_string(res.updatedAt)
                liTag.innerHTML = ` <p>${todoInput.value}</p>
                                    <section>
                                        <p>${date}</p>
                                        <span>
                                            <button class="complate "><i class="fas 2x fa-check"></i></button>
                                            <button class="edit "><i class="fas  fa-edit"></i></button>
                                            <button class="trash "><i class="fas  fa-trash"></i></button>
                                        </span>
                                    </section>
                                    `
                liTag.id = `${res._id}`;
            })
            .catch(err => alert(err));
        todoAllList.appendChild(liTag);
        todoInput.value = '';
    }

    async function deleteTodo(e) {
        const item = e.target;
        const todo = item.parentElement.parentElement.parentElement;
        const id = todo.id;
        if (item.classList[0] === "trash") {
            //* delete from mongoDB
            await fetch(`${url}/` + todo.id, {
                method: 'DELETE',
            })
                .then(res => res.json())
                .then(res => {
                    //* upDate page
                    todo.classList.add("fall");

                    //*at the end
                    todo.addEventListener("transitionend", () => {
                        todo.remove();
                    });
                })
                .catch(err => alert(err))

        } else if (item.classList[0] === "complate") {
            await complateTodo(todo, id)
        } else if (item.classList[0] === "edit") {
            todoInput.value = todo.firstElementChild.textContent;
            todoAddButton.id = id;
        }

    }

    async function complateTodo(todo, id) {
        //* add complate class
        await fetch(`${url}/` + id, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        })
            .then(res => res.json())
            .then(res => {
                todo.classList.toggle("completed");
            })
            .catch(err => console.log(err.message))

        if (todo.parentElement.classList.contains("todo-done") && !todo.classList.contains("completed")) {
            todo.classList.add("fall");
            todo.addEventListener("transitionend", () => {
                todo.remove();
            });
        } else if (todo.parentElement.classList.contains("todo-doing") && todo.classList.contains("completed")) {
            todo.classList.add("fall");
            todo.addEventListener("transitionend", () => {
                todo.remove();
            });
        }
    }

    async function editTodo(e) {
        const id = todoAddButton.id;
        await fetch(`${url}/` + id, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: todoInput.value,
            })
        })
            .then(res => res.json())
            .then(res => {
                let date = date_to_string(res.date)
                if (todoFilterTodo[0].classList.contains('h3Btn')) {
                    todoAllList.childNodes.forEach((element, index, arrayNode) => {
                        if (element.id === id) {
                            element.firstElementChild.textContent = todoInput.value;
                            element.lastElementChild.firstElementChild.textContent = date;
                        }
                    })
                } else if (todoFilterTodo[1].classList.contains('h3Btn')) {
                    todoDoing.childNodes.forEach((element, index, arrayNode) => {
                        if (element.id === id) {
                            element.firstElementChild.textContent = todoInput.value;
                            element.lastElementChild.firstElementChild.textContent = date;
                        }
                    })
                } else if (todoFilterTodo[2].classList.contains('h3Btn')) {
                    todoDone.childNodes.forEach((element, index, arrayNode) => {
                        if (element.id === id) {
                            element.firstElementChild.textContent = todoInput.value;
                            element.lastElementChild.firstElementChild.textContent = date;
                        }
                    })
                }
            })
            .catch(err => console.log(err.message))


        todoAddButton.removeAttribute('id');
        todoInput.value = '';
    }

    async function filterTodo(e) {

        if (e.target.id === 'all-todo') {
            todoAllList.innerHTML = null;
            todoDoing.style.display = 'none';
            todoDone.style.display = 'none';
            todoAllList.style.display = 'flex'
            e.target.classList.add('h3Btn')
            todoFilterTodo[1].classList.remove('h3Btn')
            todoFilterTodo[2].classList.remove('h3Btn')
            upDateAllTodo();
        } else
            if (e.target.id === 'todo-doing') {
                todoDoing.innerHTML = null;
                todoAllList.style.display = 'none';
                todoDone.style.display = 'none';
                todoDoing.style.display = 'flex';
                e.target.classList.add('h3Btn');
                todoFilterTodo[0].classList.remove('h3Btn');
                todoFilterTodo[2].classList.remove('h3Btn');
                upDateDoing()
            } else
                if (e.target.id === 'todo-done') {
                    todoDone.innerHTML = null;
                    todoAllList.style.display = 'none';
                    todoDoing.style.display = 'none'
                    todoDone.style.display = 'flex';
                    e.target.classList.add('h3Btn');
                    todoFilterTodo[0].classList.remove('h3Btn');
                    todoFilterTodo[1].classList.remove('h3Btn');
                    upDateDone()
                }
    }


    async function upDateAllTodo() {
        await fetch(url, {
            method: 'GET',
        })
            .then(res => res.json())
            .then((data) => {

                data.forEach(function (element, index, arrayNode) {
                    let date = date_to_string(element.date)
                    if (element.completed === true) {
                        todoAllList.innerHTML += `<li id="${element._id}" class="completed">
                                                    <p>${element.title}</p>
                                                    <section>
                                                        <p>${date}</p>
                                                        <span>
                                                            <button class="complate "><i class="fas 2x fa-check"></i></button>
                                                            <button class="edit "><i class="fas  fa-edit"></i></button>
                                                            <button class="trash "><i class="fas  fa-trash"></i></button>
                                                        </span>
                                                    </section>
                                                </li>
                                                `
                    } else {
                        todoAllList.innerHTML += `<li id="${element._id}">
                                                <p>${element.title}</p>
                                                <section>
                                                    <p>${date}</p>
                                                    <span>
                                                        <button class="complate "><i class="fas 2x fa-check"></i></button>
                                                        <button class="edit "><i class="fas  fa-edit"></i></button>
                                                        <button class="trash "><i class="fas  fa-trash"></i></button>
                                                    </span>
                                                </section>
                                            </li>
                                            `
                    }
                })
            })
            .catch(err => console.log(err))
    }

    async function upDateDoing() {
        await fetch(url, {
            method: 'GET',
        })
            .then(res => res.json())
            .then((data) => {

                data.forEach(function (element, index, arrayNode) {
                    if (element.completed === false) {
                        let date = date_to_string(element.date);
                        todoDoing.innerHTML += `<li id="${element._id}">
                                                <p>${element.title}</p>
                                                <section>
                                                    <p>${date}</p>
                                                    <span>
                                                        <button class="complate "><i class="fas 2x fa-check"></i></button>
                                                        <button class="edit "><i class="fas  fa-edit"></i></button>
                                                        <button class="trash "><i class="fas  fa-trash"></i></button>
                                                    </span>
                                                </section>
                                            </li>
                                            `

                    }
                })
            })
            .catch(err => console.log(err))
    }

    async function upDateDone() {
        await fetch(url, {
            method: 'GET',
        })
            .then(res => res.json())
            .then((data) => {

                data.forEach(function (element, index, arrayNode) {
                    let date = date_to_string(element.date)
                    if (element.completed === true) {
                        todoDone.innerHTML += `<li id="${element._id}" class="completed">
                                                <p>${element.title}</p>
                                                <section>
                                                    <p>${date}</p>
                                                    <span>
                                                        <button class="complate "><i class="fas 2x fa-check"></i></button>
                                                        <button class="edit"><i class="fas  fa-edit"></i></button>
                                                        <button class="trash"><i class="fas  fa-trash"></i></button>
                                                    </span>
                                                </section>
                                            </li>
                                            `

                    }
                })
            })
            .catch(err => console.log(err))
    }

    function date_to_string(jsonDate) {
        let backToDate = new Date(jsonDate);
        let arr = backToDate.toString().split(' ');

        return `${arr[1]}/${arr[2]}/${arr[3]}        Week days:${arr[0]}         ${arr[4]}`;
    }

});



