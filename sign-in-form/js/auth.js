'use strict';

const formSignIn = document.querySelector('.sign-in-htm');
const formSignUp = document.querySelector('.sign-up-htm');

function signIn(event) {
  event.preventDefault();

  fetch('https://neto-api.herokuapp.com/signin', {
    body: JSON.stringify({
      email: event.target.email.value,
      password: event.target.pass.value
    }),
    credentials: 'same-origin',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
})
    .then(res => {
      if (200 <= res.status && res.status < 300) {
        return res;
      }
      throw new Error(res.statusText);
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        throw new Error(data.message)
      };
      event.target.querySelector('output').value = `Пользователь ${data.name} успешно авторизован`;
    })
    .catch(err => {
      event.target.querySelector('output').value = err;
    });
}

function signUp(event) {
  event.preventDefault();

  fetch('https://neto-api.herokuapp.com/signup', {
    body: JSON.stringify({
      email: event.target.email.value,
      password: event.target.password.value,
      passwordcopy: event.target.passwordcopy.value,
      name: event.target.name.value
    }),
    credentials: 'same-origin',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
})
    .then(res => {
      if (200 <= res.status && res.status < 300) {
        return res;
      }
      throw new Error(res.statusText);
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        throw new Error(data.message)
      };
      event.target.querySelector('output').value = `Пользователь ${data.name} успешно зарегистрирован`;
    })
    .catch(err => {
      event.target.querySelector('output').value = err;
    });
}

formSignIn.addEventListener('submit', signIn);
formSignUp.addEventListener('submit', signUp);
