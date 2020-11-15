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
const btns = document.querySelectorAll(".bag-btn");
// cart
let cart = [];
let buttonsDOM = [];

//getting the products
class Products {
  async getProducts() {
    try {
      let result = await fetch("js/products.json");
      let data = await result.json();
      let products = data.items;
      products = products.map((item) => {
        const {
          model,
          price,
          type,
          count,
          color,
          display,
          memory,
        } = item.fields;
        const { id } = item.sys;
        let images;
        for (
          let i = 0;
          i < Object.keys(item.fields.image.fields.file).length;
          i++
        ) {
          images = Object.values(item.fields.image.fields.file);
        }
        return {
          model,
          price,
          id,
          memory,
          type,
          count,
          color,
          display,
          images,
        };
      });
      return products;
    } catch (error) {
      alert(
        "Sorry, there is a problem with database of products! We are working on this! Please, contact us for manual order."
      );
    }
  }
}
//display products
class UI {
  displayProducts(products) {
    let result = "";
    products.forEach((product) => {
      let status = "";
      let statusClass = "";
      if (product.count === 0) {
        status = "out of stock";
        statusClass = "out-of-stock";
      } else if (product.count <= 12) {
        status = "low on stock";
        statusClass = "low-on-stock";
      } else {
        status = "";
        statusClass = "";
      }

      product.memory === undefined ? (product.memory = "") : product.memory;
      product.memory ? (product.memory += "GB") : product.memory;
      typeof product.display === "number"
        ? (product.display += '"')
        : product.display;

      result += `<!-- single product -->
      <article class="product">
        <div class="img-container">
          <img
            src=${product.images[0]}
            alt="product"
            class="product-img"
          />
          <button class="bag-btn" data-id="${product.id}">
            <i class="fas fa-shopping-cart"></i>
            add to cart
          </button>
        </div>
        <h3>${product.model} ${product.color} ${product.memory} ${product.display}</h3>
        <h4>$${product.price}</h4>
        <p class="${statusClass}">${status}</p>
      </article>
      <!-- end of single product -->`;
    });
    productsDOM.innerHTML = result;
  }
  getBagButtons() {
    const buttons = [...document.querySelectorAll(".bag-btn")];
    buttonsDOM = buttons;
    buttons.forEach((button) => {
      let id = button.dataset.id;
      let inCart = cart.find((item) => item.id === id);
      if (inCart) {
        button.innerText = "In Cart";
        button.disabled = true;
      }
      button.addEventListener("click", (event) => {
        event.target.innerText = "In Cart";
        event.target.disabled = true;
        event.target.style = "color:gray";
        //get product from products
        let cartItem = { ...Storage.getProduct(id), amount: 1 };
        console.log(cartItem);
        //add product to the cart
        cart = [...cart, cartItem];
        //save cart in local storage
        Storage.saveCart(cart);
        //set cart values
        this.setCartValues(cart);
        //display cart item
        this.addCartItem(cartItem);
        //show the cart
        this.showCart();
      });
    });
  }
  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map((item) => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });
    cartTotal.innerText = "$" + parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
  }
  addCartItem(item) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
    <img src=${item.images[0]} alt="" />
    <div>
      <h4>${item.model} ${item.color} ${item.memory} ${item.display}</h4>
      <h5>$${item.price}</h5>
      <span class="remove-item" data-id="${item.id}">remove</span>
    </div>
    <div>
      <i class="fas fa-chevron-up" data-id="${item.id}"></i>
      <p class="item-amount">${item.amount}</p>
      <i class="fas fa-chevron-down" data-id="${item.id}"></i>
    </div>`;
    cartContent.appendChild(div);
  }
  showCart() {
    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
  }
  setupAPP() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);
    cartBtn.addEventListener("click", this.showCart);
    closeCartBtn.addEventListener("click", this.hideCart);
  }
  populateCart(cart) {
    cart.forEach((item) => this.addCartItem(item));
  }
  hideCart() {
    cartOverlay.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart");
  }
  cartLogic() {
    // clear cart button
    clearCartBtn.addEventListener("click", () => {
      this.clearCart();
    });
    // cart functionality
    cartContent.addEventListener("click", (event) => {
      if (event.target.classList.contains("remove-item")) {
        let removeItem = event.target;
        let id = removeItem.dataset.id;
        cartContent.removeChild(removeItem.parentElement.parentElement);
        this.removeItem(id);
      } else if (event.target.classList.contains("fa-chevron-up")) {
        let addAmount = event.target;
        let id = addAmount.dataset.id;
        let tempItem = cart.find((item) => item.id === id);
        tempItem.amount = tempItem.amount + 1;
        Storage.saveCart(cart);
        this.setCartValues(cart);
        addAmount.nextElementSibling.innerText = tempItem.amount;
      } else if (event.target.classList.contains("fa-chevron-down")) {
        let lowerAmount = event.target;
        let id = lowerAmount.dataset.id;
        let tempItem = cart.find((item) => item.id === id);
        tempItem.amount = tempItem.amount - 1;
        if (tempItem.amount > 0) {
          Storage.saveCart(cart);
          this.setCartValues(cart);
          lowerAmount.previousElementSibling.innerText = tempItem.amount;
        } else {
          cartContent.removeChild(lowerAmount.parentElement.parentElement);
          this.removeItem(id);
        }
      }
    });
  }
  clearCart() {
    let cartItems = cart.map((item) => item.id);
    cartItems.forEach((id) => this.removeItem(id));
    console.log(cartContent.children);
    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }
    this.hideCart();
  }
  removeItem(id) {
    cart = cart.filter((item) => item.id !== id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let button = this.getSingleButton(id);
    button.disabled = false;
    button.innerHTML = `<i class ="fas fa-shopping-cart"></i>add to cart`;
    button.style = "color: white";
  }
  getSingleButton(id) {
    return buttonsDOM.find((button) => button.dataset.id === id);
  }
}
//local storage class
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find((product) => product.id === id);
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();
  //setup app
  ui.setupAPP();
  //get all products
  products
    .getProducts()
    .then((products) => {
      ui.displayProducts(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.getBagButtons();
      ui.cartLogic();
    });
});
