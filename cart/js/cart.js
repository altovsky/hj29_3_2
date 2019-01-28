'use strict';

const colorSwatch = document.querySelector(`#colorSwatch`);
const sizeSwatch = document.querySelector(`#sizeSwatch`);
const currentColor = localStorage.currentColor;
const currentSize = localStorage.currentSize;
const toCart = document.querySelector(`#AddToCart`);
const cart = document.querySelector(`#quick-cart`);
const thumbImage = document.getElementsByClassName('thumb-image');
const bigImage = document.getElementById('big-image');
// let activeProduct = document.querySelector('.active');

function getData(url) {
  return fetch(url)

    .then(res => {
      return res.json();
    })

    .then(res => {
      return res;
    })

    .catch(err => {
      console.log(err);
    });
}

getData(`https://neto-api.herokuapp.com/cart/colors`)
  .then(res => setColor(res))
  .then(res => colorSwatch.addEventListener(`click`, check));

getData(`https://neto-api.herokuapp.com/cart/sizes`)
  .then(res => setSize(res))
  .then(res => sizeSwatch.addEventListener(`click`, check));

Array.from(thumbImage).forEach(image => image.addEventListener('click', selectActive));

function selectActive(event) {
  event.preventDefault();
  Array.from(thumbImage).forEach(image => image.classList.remove('active'));
  event.currentTarget.classList.add('active');
  bigImage.style.backgroundImage = `url(${event.currentTarget.getAttribute('href')})`;
}

toCart.addEventListener(`click`, addToCart);
cart.addEventListener(`click`, removeFromCart);

function check(event) {
  if (event.target.tagName === `INPUT` && this === colorSwatch) {
    localStorage.currentColor = event.target.value;
  } else if (event.target.tagName === `INPUT` && this === sizeSwatch) {
    localStorage.currentSize = event.target.value;
  }
}

function addToCart(event) {
  event.preventDefault();

  const form = document.querySelector(`#AddToCartForm`);
  const formData = new FormData(form);
  formData.append(`productId`, form.dataset.productId);

  fetch(`https://neto-api.herokuapp.com/cart`, {
    body: formData,
    method: `POST`,
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      cart.innerHTML = ``;
      cart.appendChild(createCart(res[0].id, res[0].pic, res[0].title, res[0].quantity));
      cart.appendChild(formCart(getPrice(res[0].id)));
    })
    .catch((err) => {
      console.log(err);
    });
}

function removeFromCart(event) {
  event.preventDefault();

  const formData = new FormData();
  formData.append(`productId`, event.target.dataset.id);

  if (event.target.classList.contains(`remove`)) {
    fetch(`https://neto-api.herokuapp.com/cart/remove`, {
      body: formData,
      method: `POST`,
    })

      .then((res) => {
        return res.json();
      })

      .then((res) => {
        cart.innerHTML = ``;
        cart.appendChild(createCart(res[0].id, res[0].pic, res[0].title, res[0].quantity));
        cart.appendChild(formCart(getPrice(res[0].id)));
      })

      .catch((err) => {
        console.log(err.message);
      });
  }
}

function createColor(title, type, code, isAvailable, isCurrent) {
  const div = document.createElement(`div`);
  let disabled = ``;
  let current = ``;
  div.dataset.value = `${type}`;
  div.className = `swatch-element color ${type}`;

  if (isAvailable) {
    div.classList.add(`available`);
  } else {
    div.classList.add(`soldout`);
    disabled = `disabled`;
  }

  if (isCurrent) {
    current = `checked`;
  }

  div.innerHTML =
    `<div class="tooltip">${title}</div>
     <input quickbeam="color" id="swatch-1-${type}" type="radio" name="color" value="${type}" ${current} ${disabled}>
     <label for="swatch-1-${type}" style="border-color: ${type};">
       <span style="background-color: ${type};"></span>
       <img class="crossed-out" src="https://neto-api.herokuapp.com/hj/3.3/cart/soldout.png?10994296540668815886">
     </label>`;
  return div;
}

function createSize(title, type, isAvailable, isCurrent) {
  const div = document.createElement(`div`);
  let disabled = ``;
  let current = ``;
  div.dataset.value = `${type}`;
  div.className = `swatch-element plain ${type}`;

  if (isAvailable) {
    div.classList.add(`available`);
  } else {
    div.classList.add(`soldout`);
    disabled = `disabled`;
  }

  if (isCurrent) {
    current = `checked`;
  }

  div.innerHTML =
    `<input id="swatch-0-${type}" type="radio" name="size" value="${type}" ${current} ${disabled}>
     <label for="swatch-0-${type}">
       ${title}
       <img class="crossed-out" src="https://neto-api.herokuapp.com/hj/3.3/cart/soldout.png?10994296540668815886">
     </label>`;
  return div;
}

function createCart(itemId, imgSrc, title, count) {
  const div = document.createElement(`div`);
  div.id = `quick-cart-product-${itemId}`;
  div.className = 'quick-cart-product quick-cart-product-static';
  div.style.opacity = `1`;
  div.innerHTML =
    `<div class="quick-cart-product-wrap">
       <img src="${imgSrc}" title="${title}">
       <span class="s1" style="background-color: #000; opacity: .5">$800.00</span>
       <span class="s2"></span>
     </div>
     <span class="count hide fadeUp" id="quick-cart-product-count-${itemId}">${count}</span>
     <span class="quick-cart-product-remove remove" data-id="${itemId}"></span>`;
  return div;
}

function getPrice(itemId) {
  const price = Number(cart.querySelector(`.s1`).textContent.replace(`$`, ``));
  const count = Number(cart.querySelector(`#quick-cart-product-count-${itemId}`).textContent);
  return price * count;
}

function formCart(totalPrice) {
  const cart = document.createElement(`A`);
  cart.id = `quick-cart-pay`;
  cart.setAttribute(`quickbeam`, `cart-pay`);
  cart.classList.add(`cart-ico`);
  if (totalPrice) {
    cart.classList.add(`open`);
  }
  cart.innerHTML = `
    <span>
      <strong class="quick-cart-text">Оформить заказ<br></strong>
      <span id="quick-cart-price">$${totalPrice}</span>
    </span>`;

  return cart;
}

function setColor(colors) {
  colors.forEach(color => {
    let isCurrent = false;
    if (color.type === currentColor) isCurrent = true;
    colorSwatch.appendChild(createColor(color.title, color.type, color.code, color.isAvailable, isCurrent));
  });
}

function setSize(sizes) {
  sizes.forEach(size => {
    let isCurrent = false;
    if (size.type === currentSize) isCurrent = true;
    sizeSwatch.appendChild(createSize(size.title, size.type, size.isAvailable, isCurrent));
  });
}
