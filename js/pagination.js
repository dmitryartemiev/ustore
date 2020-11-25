"use strict";

// setTimeout(makePages(), 500);


let content = document.getElementsByClassName('show','show hide');

let paginationDiv = document.getElementsByClassName("pagination")[0];

let productsOnPage = 6;
let pageNum = 1;
let countOfPages = Math.ceil([...content].length / productsOnPage);

let deleteBtns = document.getElementsByClassName("pageList");

if (deleteBtns.length !== 0) {
  for (let i = 0; i <= [...deleteBtns].length; i++) {
    deleteBtns[i].remove();
  }
}
let liButtons = [];

for (let i = 1; i <= countOfPages; i++) {
  let li = document.createElement("li");
  li.classList.add("pageList");
  li.innerHTML = i;
  paginationDiv.appendChild(li);
  liButtons.push(li);
}

console.log(liButtons);

function fillPage(pageNum) {
  let start = (pageNum - 1) * productsOnPage;
  let end = start + productsOnPage;
  let notes = [];
  console.log(content);
  console.log(pageNum);
  if (pageNum === 1) {
    console.log(end);
    notes = [...content].slice(end);
    for (let note of notes) {
      note.classList.add("hide");
      note.classList.remove("show");
    }
    if ([...content].length === 0) {
      notes = [...content].slice(start, end);
      for (let note of notes) {
        note.classList.add("show");
        note.classList.remove("hide");
      }
    }
  } else {
    notes = [...content].slice(start, end);
    for (let note of notes) {
      console.log(notes);
      note.classList.add("show");
      note.classList.remove("hide");
    }
  }
}

let currentPage = liButtons[pageNum - 1];
currentPage.classList.add("active-page");

function emptyPage(pageNum) {
  let start = (pageNum - 1) * productsOnPage;
  let end = start + productsOnPage;
  let notes = [...content].slice(start, end);

  for (let note of notes) {
    note.classList.add("hide");
    note.classList.remove("show");
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


