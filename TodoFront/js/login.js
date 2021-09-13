document.addEventListener("DOMContentLoaded", function () {
    const email = document.querySelector('#emailLog'),
        password = document.querySelector('#passwordLog'),
        btnLog = document.querySelector('.btnLog');

    const url = 'http://localhost:3000/api/authRouter/login';
    btnLog.addEventListener('click', loginUser);

    async function loginUser(e) {
        e.preventDefault();
        await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
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