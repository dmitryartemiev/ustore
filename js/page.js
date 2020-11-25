"use strict";

function makePages(content) {

  let pagDiv = document.getElementsByClassName("pagination")[0];
  let productOnPage = 6;
  let pageNum = 1;


  let countOfPages = Math.ceil(content.length / productOnPage);
    console.log('pages: '+ countOfPages + '; content length: ' + content.length);
  let liButtons = [];

  //buttons
  for (let page of [...document.getElementsByClassName("pageList")]) {
    page.remove();
  }

  for (let i = 1; i <= countOfPages; i++) {
    let li = document.createElement("li");
    li.classList.add("pageList");
    li.innerHTML = i;
    pagDiv.appendChild(li);
    liButtons.push(li);
  }

  //fill pages

  //clear

  function fillPage(pageNum) {
    for (let clr1 of [...productsDOM.children]) {
      clr1.classList.remove("hide-pagin");
      clr1.classList.remove("show-pagin");
    }

    for(let singleLi of liButtons){
        if ([...singleLi.classList].includes('active-page')){
            singleLi.classList.remove('active-page')
        }
    }

    let start = (pageNum - 1) * productOnPage;
    let end = start + productOnPage;

        let strNote = [...content].slice(0, start);
        let delNote = [...content].slice(end);
        let notes = [...content].slice(start, end);
        
        
        for (let note of notes) {
     
      if (![...note.classList].includes("hide")) {
          note.classList.remove("hide-pagin");
          note.classList.add("show-pagin");
        }
            }
        for (let del of delNote) {
          del.classList.remove("show-pagin");
          del.classList.add("hide-pagin");
        }
        for (let str of strNote) {
          str.classList.remove("show-pagin");
          str.classList.add("hide-pagin");
        }
        let currentPage = liButtons[pageNum - 1];
        currentPage.classList.add("active-page");
   
  }
  fillPage(pageNum);

  //events
  for (let li of liButtons) {
    li.addEventListener("click", () => {
      pageNum = +li.innerHTML;
      fillPage(pageNum);
    });
  }
}
