// -----START OF CART-----

//Variables

const cartBtn = document.querySelector(".cart-btn");
const menuBtn = document.querySelector(".menu-btn");
const closeCartBtn = document.querySelector(".close-cart");
const closeMenuBtn = document.querySelector(".close-menu");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const menuDOM = document.querySelector(".menu");
const menuOverlay = document.querySelector(".menu-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");
const btns = document.querySelectorAll(".bag-btn");
// cart
let cart = [];
let buttonsDOM = [];
let startCount = [];

//getting the products
class Products {
  async getProducts() {
    try {
      let result = await fetch("/js/products.json");
      let data = await result.json();
      let products = data.items;
      products = products.map((item) => {
        const {
          model,
          price,
          type,
          count,
          startCount,
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
          startCount,
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
      let storageProductCount;
      let storageProductId;
      for (
        let i = 0;
        i < JSON.parse(localStorage.getItem("cart")).length;
        i++
      ) {
        storageProductId = Number(
          JSON.parse(localStorage.getItem("cart"))[i].id
        );
        storageProductCount = Number(
          JSON.parse(localStorage.getItem("cart"))[i].count
        );

        if (product.id == storageProductId) {
          product.count = storageProductCount;
        }
      }

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

      for (let i = 0; i < 10; i++) {
        if (product.images[i] === undefined) {
          product.images[i] = `0 style='display:none'`;
        }
      }
      let color = product.color.toLowerCase().replace(/ /g, "-");
      result += `<!-- single product -->
      <article  class="product type-${product.type} memory-${product.memory} price-${product.price} color-${color} show">
        <div class="img-container">
          <img
            src=${product.images[0]}
            alt="product"
            style="
              display: block;
              width: 100%;
              min-height: 12rem;
              cursor: pointer;
            "
            class="product-img"
            id="current-${product.id}"
          />
          <div class="slider-container">
            <img
              src=${product.images[0]}
              alt="product"
              class="product-img thumbnail"
            />

            <img
              src=${product.images[1]}
              alt="product"
              class="product-img thumbnail"
            />
            <img
              src=${product.images[2]}
              alt="product"
              class="product-img thumbnail"
            />
            <img src=${product.images[3]} alt="product" class="product-img thumbnail"> 
          </div>
          <button class="bag-btn" data-id="${product.id}">
          <i class="fas fa-shopping-cart"></i>
          add to cart
        </button>
      </div>
      <h3>${product.model} ${product.color} ${product.memory} ${product.display}</h3>
      <h4>$${product.price}</h4>
      <p class="status ${statusClass}">${status}</p>
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
        button.style = "color: gray";
      }
      let countItem = { ...Storage.getProduct(id) }.count;
      if (countItem === 0) {
        button.disabled = true;
        button.style = "color: gray";
      }
      button.addEventListener("click", (event) => {
        event.target.innerText = "In Cart";
        event.target.disabled = true;
        event.target.style = "color:gray";
        //get product from products
        let cartItem = { ...Storage.getProduct(id), amount: 1 };
        cartItem.count--;
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
  showMenu(){
    menuOverlay.classList.add("transparentBcg");
    menuDOM.classList.add("showMenu");
  }
  setupAPP() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);
    cartBtn.addEventListener("click", this.showCart);
    closeCartBtn.addEventListener("click", this.hideCart);

    menuBtn.addEventListener("click", this.showMenu);
    closeMenuBtn.addEventListener("click", this.hideMenu);
  }
  populateCart(cart) {
    cart.forEach((item) => this.addCartItem(item));
  }
  hideCart() {
    cartOverlay.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart");
  }
  hideMenu(){
    menuOverlay.classList.remove("transparentBcg");
    menuDOM.classList.remove("showMenu");
  }
  cartLogic() {
    // clear cart button
    clearCartBtn.addEventListener("click", () => {
      this.clearCart();
    });
    // cart functionality add
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
        let productElement = document.getElementsByClassName("status")[
          tempItem.id - 1
        ];
        console.log(productElement);

        if (tempItem.count > 0) {
          tempItem.count = tempItem.count - 1;
          tempItem.amount = tempItem.amount + 1;
          Storage.saveCart(cart);
          this.setCartValues(cart);
          addAmount.nextElementSibling.innerText = tempItem.amount;
          if (tempItem.count < 12) {
            productElement.classList.add("low-on-stock");
            productElement.textContent = "low on stock";
          }
          if (tempItem.count === 0) {
            productElement.classList.remove("low-on-stock");
            productElement.classList.add("out-of-stock");
            productElement.textContent = "out of stock";
          }
        }
      } else if (event.target.classList.contains("fa-chevron-down")) {
        let lowerAmount = event.target;
        let id = lowerAmount.dataset.id;
        let tempItem = cart.find((item) => item.id === id);
        tempItem.amount = tempItem.amount - 1;
        tempItem.count = tempItem.count + 1;
        let productElement = document.getElementsByClassName("status")[
          tempItem.id - 1
        ];
        if (tempItem.amount > 0) {
          Storage.saveCart(cart);
          this.setCartValues(cart);
          lowerAmount.previousElementSibling.innerText = tempItem.amount;

          if (tempItem.count > 0) {
            productElement.classList.remove("out-of-stock");
            productElement.classList.add("low-on-stock");
            productElement.textContent = "low on stock";
          }
          if (tempItem.count > 12) {
            productElement.classList.remove("low-on-stock");
            productElement.textContent = "";
          }
        } else {
          cartContent.removeChild(lowerAmount.parentElement.parentElement);
          this.removeItem(id);
        }
        console.log(productElement);
      }
    });
  }
  clearCart() {
    let cartItems = cart.map((item) => item.id);
    cartItems.forEach((id) => this.removeItem(id));
    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }

    this.hideCart();
  }

  removeItem(id) {
    cart = cart.filter((item) => item.id !== id);
    let cartStartCount;
    for (let i = 0; i < JSON.parse(localStorage.getItem("cart")).length; i++) {
      let cartArr = JSON.parse(localStorage.getItem("cart"))[i];
      cartStartCount = cartArr.startCount;
      console.log(cartStartCount);

      if (cartArr.id === id) {
        let productElement = document.getElementsByClassName("status")[id - 1];
        if (cartStartCount < 12) {
          productElement.classList.remove("out-of-stock");
          productElement.classList.add("low-on-stock");
          productElement.textContent = "low on stock";
        }
        if (cartStartCount === 0) {
          productElement.classList.add("out-of-stock");
          productElement.classList.remove("low-on-stock");
          productElement.textContent = "out of stock";
        }
        if (cartStartCount >= 12) {
          productElement.classList.remove("out-of-stock");
          productElement.classList.remove("low-on-stock");
          productElement.textContent = "";
        }
      }
    }
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
      productPreview();
      makeFilters();
      makePages(document.getElementsByClassName('show'));
    })
   
    
});

