"use strict";

// Type of device radio filters

let inputType = [...document.getElementsByName("type")];

for (let singleButton of inputType) {
  singleButton.addEventListener("click", () => {
    for (let i = 0; i < [...productsDOM.children].length; i++) {
      let productClasses = [...[...productsDOM.children][i].classList];
      const match = (element) => element === singleButton.value;
      if (productClasses.some(match)) {
        productsDOM.children[i].style.display = "block";
        productsDOM.children[i].classList.add("checked-by-type");
      } else {
        productsDOM.children[i].style.display = "none";
        productsDOM.children[i].classList.remove("checked-by-type");
      }
      if (singleButton.value === "all-of-types") {
        productsDOM.children[i].style.display = "block";
        productsDOM.children[i].classList.remove("checked-by-type");
      }
    }
  });
}

// Color of device checkbox filters

// let checkboxColor = [...document.getElementsByName("color")];
// for (let singleCheck of checkboxColor) {
//   singleCheck.addEventListener("click", () => {
//     for (let i = 0; i < [...productsDOM.children].length; i++) {
    
//       let productClasses = [...[...productsDOM.children][i].classList];
    

//       const matchColor = (element) => element === singleCheck.value;
     
//       console.log(!productClasses.some(matchColor))
//       if (productClasses.some(matchColor) && productsDOM.children[i].classList.contains('checked-by-type')) {
//         productsDOM.children[i].style.display = "block";
//       }
//     //    else if (!singleCheck.cheсked && !productClasses.some(matchColor) ) {
//     //     productsDOM.children[i].style.display = "none";
//     //   }
//     }
//   });
// }
