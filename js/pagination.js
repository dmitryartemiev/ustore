"use strict";

setTimeout(() => {
  let paginationDiv = document.getElementsByClassName("pagination")[0];

  let productsOnPage = 6;
  let pageNum = 1;
  let countOfPages = Math.ceil(
    [...productsDOM.children].length / productsOnPage
  );
  let liButtons = [];

  for (let i = 1; i <= countOfPages; i++) {
    let li = document.createElement("li");
    li.innerHTML = i;
    paginationDiv.appendChild(li);
    liButtons.push(li);
  }

  function fillPage(pageNum) {
    let start = (pageNum - 1) * productsOnPage;
    let end = start + productsOnPage;
    let notes = [...productsDOM.children].slice(start, end);
    let currentPage = liButtons[pageNum - 1];
    currentPage.classList.add("active-page");
    for (let note of notes) {
      note.style = "display:block";
    }
  }
  function emptyPage(pageNum) {
    let start = (pageNum - 1) * productsOnPage;
    let end = start + productsOnPage;
    let notes = [...productsDOM.children].slice(start, end);
    for (let note of notes) {
      note.style = "display:none";
    }
    let currentPage = liButtons[pageNum - 1];
    currentPage.classList.remove("active-page");
  }
  fillPage(pageNum);

  for (let li of liButtons) {
    li.addEventListener("click", () => {
      emptyPage(pageNum);
      pageNum = +li.innerHTML;

      fillPage(pageNum);
    });
  }
}, 400);
