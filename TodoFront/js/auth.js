document.addEventListener("DOMContentLoaded", function () {
    const name = document.querySelector('#name'),
        lastName = document.querySelector('#lastname'),
        email = document.querySelector('#email'),
        password = document.querySelector('#password'),
        submit = document.querySelector('.submit');

    const url = 'http://localhost:3000/api/newUserSaveRouter';
    submit.addEventListener('click', authorization);

    async function authorization(e) {
        e.preventDefault();

        await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name.value,
                lastName: lastName.value,
                email: email.value,
                password: password.value
            })
        })
            .then(res => res.json())
            .then(body => {
                console.log(body);
                if (body) {
                    localStorage.setItem('token', body);
                    window.location.assign('./index.html')
                }
            })
            .catch(err => console.log(err.message));
    }

})