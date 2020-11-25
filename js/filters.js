"use strict";

    function makeFilters(){

    
    let filtersArr = ["all-of-types"];

    let inputType = [...document.getElementsByName("type")];
    let checkboxColor = [...document.getElementsByName("color")];
    let checkboxMemory = [...document.getElementsByName("memory")];
    let priceRange = document.getElementById("price-range");

    //fill filters arr

    function fillFiltersWithColor() {
      for (let i = 0; i < [...productsDOM.children].length; i++) {
        if (
          !filtersArr.includes(
            String(
              [...productsDOM.children[i].classList].filter((color) =>
                color.match(/color-/gm)
              )
            )
          )
        ) {
          filtersArr.push(
            String(
              [...productsDOM.children[i].classList].filter((color) =>
                color.match(/color-/gm)
              )
            )
          );
        }
      }
    }
    fillFiltersWithColor();

    //fill colors
    for (let singleColor of checkboxColor) {
      singleColor.addEventListener("click", () => {
        if (
          filtersArr.filter((color) => color.match(/color-/gm)).length ==
          checkboxColor.length
        ) {
          for (let i = 0; i < filtersArr.length; i++) {
            if (filtersArr[i].match(/color-/gm)) {
              filtersArr.splice(
                filtersArr.indexOf(filtersArr[i]),
                checkboxColor.length
              );
            }
          }
        }

        if (singleColor.checked) {
          filtersArr.push("color-" + singleColor.value);
          console.log(filtersArr);
        } else {
          filtersArr.splice(
            filtersArr.indexOf("color-" + singleColor.value),
            1
          );
          if (
            filtersArr.filter((color) => color.match(/color-/gm)).length == 0
          ) {
            fillFiltersWithColor();
          }
          console.log(filtersArr);
        }
      });
    }

    //fill memory
    for (let singleMemory of checkboxMemory) {
      singleMemory.addEventListener("click", () => {
        if (singleMemory.checked) {
          filtersArr.push("memory-" + singleMemory.value + "GB");
          console.log(filtersArr);
        } else {
          filtersArr.splice(
            filtersArr.indexOf("memory-" + singleMemory.value + "GB"),
            1
          );
          console.log(filtersArr);
        }
      });
    }
    //fill device types
    let singleTypeVal;
    for (let singleType of inputType) {
      singleType.addEventListener("click", () => {
        if (singleType.checked) {
          for (let i = 0; i < inputType.length; i++) {
            if (filtersArr.includes(inputType[i].value)) {
              filtersArr.splice(filtersArr.indexOf(inputType[i].value), 1);
            }
          }

          filtersArr.push(singleType.value);

          singleTypeVal = singleType.value;
          console.log(filtersArr);
        }
      });
    }
    // find max price of products and place it to price input range
    let priceArr = [];
    for (let i = 0; i < productsDOM.children.length; i++) {
      let classArrProdDOM = [...productsDOM.children[i].classList];
      let price = classArrProdDOM.find((price) => {
        return price.includes("price");
      });
      priceArr.push(+price.substr(6));
    }
    priceRange.max = Math.max.apply(null, priceArr);
    priceRange.min = Math.min.apply(null, priceArr);
    filtersArr.push("price-" + priceRange.max);

    //fill by price range
    let priceRangeLabel = document.getElementById("price-count");
    priceRange.addEventListener("input", () => {
      priceRangeLabel.innerText = "$" + priceRange.value;

      if (filtersArr.some((e) => /price-\d+/gm.test(e))) {
        filtersArr.splice(
          filtersArr.indexOf(
            filtersArr.find((value) => /price-\d+/gm.test(value))
          ),
          1
        );
      }
      filtersArr.push("price-" + priceRange.value);
      console.log(filtersArr);
    });
    priceRange.addEventListener(
      "change",
      () => {
        for (let k = 0; k < [...productsDOM.children].length; k++) {
          let singlePrice = +String(
            [...productsDOM.children[k].classList].filter((price) =>
              price.match(/price-/gm)
            )
          ).match(/\d+/gm);
          let priceFilterArr = +String(
            filtersArr.filter((price) => price.match(/price-/gm))
          ).match(/\d+/gm);

          let rangeColor = String(
            [...productsDOM.children[k].classList].filter((price) =>
              price.match(/color-/gm)
            )
          );

          let rangeType = String(
            [...productsDOM.children[k].classList].filter((price) =>
              price.match(/type/gm)
            )
          );

          if (singlePrice <= priceFilterArr) {
            if (filtersArr.includes(rangeColor)) {
              if (filtersArr.includes(rangeType)) {
                [...productsDOM.children][k].classList.add("show");
                [...productsDOM.children][k].classList.remove("hide");
              } else if (filtersArr.includes("all-of-types")) {
                [...productsDOM.children][k].classList.add("show");
                [...productsDOM.children][k].classList.remove("hide");
              } else {
                [...productsDOM.children][k].classList.remove("show");
                [...productsDOM.children][k].classList.add("hide");
              }
            } else {
              [...productsDOM.children][k].classList.remove("show");
              [...productsDOM.children][k].classList.add("hide");
            }
          } else {
            [...productsDOM.children][k].classList.remove("show");
            [...productsDOM.children][k].classList.add("hide");
          }
        }
        makePages(document.getElementsByClassName('show'));
      },
      false
    );

    //check product classlist with filters arr

    let inputs = [...document.getElementsByTagName("input")];
    inputs = inputs.filter((n) => {
      return n != document.getElementById("price-range");
    });
    for (let input of inputs) {
      input.addEventListener("click", (event) => {
        for (let i = 0; i < productsDOM.children.length; i++) {
          //check if classlist of productDOM contains
          if (event.target.type === "radio") {
            priceRange.value = priceRange.max;
            priceRangeLabel.innerText = "$" + priceRange.value;
            if (filtersArr.some((e) => /price-\d+/gm.test(e))) {
              filtersArr.splice(
                filtersArr.indexOf(
                  filtersArr.find((value) => /price-\d+/gm.test(value))
                ),
                1
              );
            }
            filtersArr.push("price-" + priceRange.value);
          }

          let childPrice = +String(
            String(
              [...productsDOM.children[i].classList].filter((n) =>
                n.match(/price-/gm)
              )
            ).match(/\d+/gm)
          );
          let priceFilterArr = +String(
            filtersArr.filter((price) => price.match(/price-/gm))
          ).match(/\d+/gm);
          console.log(priceFilterArr);

          if (
            (singleTypeVal === "all-of-types" &&
              childPrice <= priceFilterArr) ||
            (filtersArr.includes("all-of-types") &&
              childPrice <= priceFilterArr)
          ) {
            productsDOM.children[i].classList.add("show");
            productsDOM.children[i].classList.remove("hide");
          } else if (
            [...productsDOM.children[i].classList].includes(singleTypeVal) &&
            childPrice <= priceFilterArr
          ) {
            productsDOM.children[i].classList.add("show");
            productsDOM.children[i].classList.remove("hide");
          } else {
            productsDOM.children[i].classList.add("hide");
            productsDOM.children[i].classList.remove("show");
          }
        }


        for (
          let j = 0; j < [...document.getElementsByClassName("show")].length; j++) {
          if (![ ...[...document.getElementsByClassName("show")][j].classList,].some((r) =>
              filtersArr.filter((el) => el.match(/color-/gm)).includes(r))) {
            [...document.querySelectorAll(".show")][j].classList.add("hide");
           console.log([...document.querySelectorAll(".show")][j].className);
          }
        }


        for (let fix of document.getElementsByClassName('hide')){
          if ([...fix.classList].includes('show')){
            fix.classList.remove('show')
          }
        }


        for (let fix of document.getElementsByClassName('show')){
          if ([...fix.classList].includes('hide')){
            fix.classList.remove('hide')
          }
        }




        for (let clr1 of [...productsDOM.children]){
          clr1.classList.remove('hide-pagin')
          clr1.classList.remove('show-pagin')
      }
        makePages(document.getElementsByClassName('show'));
      });
        
    }
  };

