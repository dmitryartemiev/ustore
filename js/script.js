"use strict";

// -----SLIDER-----

let position = 0;
let sliderTrack = document.getElementsByClassName("slider__track")[0];
let btnPrev = document.getElementsByClassName("prev")[0];
let btnNext = document.getElementsByClassName("next")[0];
let contentCount = sliderTrack.children.length;
let sliderContainer = document.getElementsByClassName("slider__container")[0];

function nextSlide() {
  let sliderContainerWidth = sliderContainer.clientWidth;
  if (position === contentCount - 1) {
    position = 0;
    sliderTrack.style.transform =
      "translateX(-" + sliderContainerWidth * position + "px)";
  } else {
    position++;
    sliderTrack.style.transform =
      "translateX(-" + sliderContainerWidth * position + "px)";
  }
}

function prevSlide() {
  let sliderContainerWidth = sliderContainer.clientWidth;

  if (position === 0) {
    position = contentCount - 1;
    sliderTrack.style.transform =
      "translateX(-" + sliderContainerWidth * position + "px)";
  } else {
    position--;
    sliderTrack.style.transform =
      "translateX(-" + sliderContainerWidth * position + "px)";
  }
}

let timer = setInterval(function () {
  nextSlide();
}, 5000);

sliderContainer.onmouseout = function () {
  timer = setInterval(function () {
    nextSlide();
  }, 5000);
};
sliderContainer.onmouseover = function () {
  clearInterval(timer);
};

// -----END OF SLIDER-----
// -----START OF CART-----

//Variables

const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");
// cart
let cart = [];

//getting the products
class Products {
  async getProducts() {
    try {
      let result = await fetch("js/products.json");
      let data = await result.json();
      let products = data.items;
      products = products.map((item) => {
        const { title, price } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url1;
        return { title, price, id, image };
      });
      return products;
    } catch (error) {
      alert('Sorry, there is a problem with database of products! We are working on this! Please, contact us for manual order.');
    }
  }
}
//display products
class UI {
  displayProducts(products) {
    let result = "";
    products.forEach((product) => {
      result += `<!-- single product -->
      <article class="product">
        <div class="img-container">
          <img
            src=${product.image}
            alt="product"
            class="product-img"
          />
          <button class="bag-btn" data-id=${product.id}>
            <i class="fas fa-shopping-cart"></i>
            add to bag
          </button>
        </div>
        <h3>${product.title}</h3>
        <h4>$${product.price}</h4>
      </article>
      <!-- end of single product -->`;
    });
    productsDOM.innerHTML = result;
  }
}
//local storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();
  //get all products
  products.getProducts().then((products) => {
    ui.displayProducts(products);
    Storage.saveProducts(products);
  });
});
