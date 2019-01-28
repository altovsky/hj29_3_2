'use strict';

const counter = document.getElementById('counter');
const increment = document.getElementById('increment');
const decrement = document.getElementById('decrement');
const reset = document.getElementById('reset');

counter.textContent = localStorage.counter === undefined ? localStorage.counter = 0 : localStorage.counter;

increment.addEventListener('click', () => {
  counter.textContent = ++localStorage.counter;
});

decrement.addEventListener('click', () => {
  counter.textContent = localStorage.counter <= 0 ? 0 : --localStorage.counter;
});

reset.addEventListener('click', () => {
  counter.textContent = localStorage.counter = 0;
});
