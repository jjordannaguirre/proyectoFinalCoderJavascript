const signupForm = document.querySelector('#signupForm')
signupForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const name = document.querySelector('#name').value
    const email = document.querySelector('#email').value
    const password = document.querySelector('#password').value

    const Users = JSON.parse(localStorage.getItem('users')) || []
    const isUserRegistered = Users.find(user => user.email === email)
    if (isUserRegistered) {
        return Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'El usuario ya está registrado!'
        })
    }

    Users.push({ name: name, email: email, password: password })
    localStorage.setItem('users', JSON.stringify(Users))
    Swal.fire({
        icon: 'success',
        title: 'Registro Exitoso!',
        showConfirmButton: false,
        timer: 1500
    }).then(() => {
        window.location.href = 'login.html'
    })
})
