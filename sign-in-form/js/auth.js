'use strict';

// Дмитрий, прошу прощения. Так и не смог разобраться с fetch и переделал на xhr

const xhrSingIn = new XMLHttpRequest(),
      formSignIn = document.querySelector('.sign-in-htm'),
      outputSignIn = formSignIn.getElementsByTagName('output')[0],
      buttonSignIn = formSignIn.getElementsByClassName('button')[0],

      xhrSignUp = new XMLHttpRequest(),
      formSignUp = document.querySelector('.sign-up-htm'),
      outputSignUp = formSignUp.getElementsByTagName('output')[0],
      buttonSignUp = formSignUp.getElementsByClassName('button')[0];

buttonSignIn.addEventListener('click', () => {
  event.preventDefault();

  xhrSingIn.open('POST', 'https://neto-api.herokuapp.com/signin');
  xhrSingIn.setRequestHeader('Content-Type', 'application/json');
  const body = {
    email: formSignIn.querySelector('#email').value,
    password: formSignIn.querySelector('#pass').value
  };

  xhrSingIn.send(JSON.stringify(body));
});

xhrSingIn.addEventListener('load', () => {
  const response = JSON.parse(xhrSingIn.response);
  outputSignIn.innerText = response.error ? response.message : `Пользователь ${response.name} успешно авторизирован`;
});


buttonSignUp.addEventListener('click', () => {
  event.preventDefault();

  xhrSignUp.open('POST', 'https://neto-api.herokuapp.com/signup');
  xhrSignUp.setRequestHeader('Content-Type', 'application/json');
  const body = {
    email: formSignUp.querySelector('#email').value,
    password: formSignUp.querySelector('#pass').value,
    passwordcopy: formSignUp.querySelectorAll('#pass')[1].value,
    name: formSignUp.querySelectorAll('#pass')[2].value
  };

  xhrSignUp.send(JSON.stringify(body));
});

xhrSignUp.addEventListener('load', () => {
  const response = JSON.parse(xhrSignUp.response);
  outputSignUp.innerText = response.error ? response.message : `Пользователь ${response.name} успешно зарегистрирован`;
});
