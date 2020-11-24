"use strict";

function productPreview() {
  let thumbnails = document.getElementsByClassName("thumbnail");
  let activeImages = document.getElementsByClassName("active_img");
  let currentImages = [...document.querySelectorAll("[id*='current']")];

  for (let i = 0; i < thumbnails.length; i++) {
    thumbnails[i].addEventListener("mouseover", function (event) {
      if (activeImages.length > 0) {
        activeImages[0].classList.remove("active_img");
      }
      this.classList.add("active_img");
      let parentProduct = event.target.parentNode.parentNode.parentNode;
      let product = [
        ...event.target.parentNode.parentNode.parentNode.parentNode.children,
      ]; // :D
      let index = product.indexOf(parentProduct);
      currentImages[index].src = this.src;
    });
  }
}
