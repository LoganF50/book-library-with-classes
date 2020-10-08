//BOOK
class Book {
  constructor(title, author, numPages, hasRead) {
    this.title = title;
    this.author = author;
    this.numPages = numPages;
    this.hasRead = hasRead;
  }

  get info() {
    const hasReadStr = this.hasRead ? 'already read' : 'has not read';
    return `${this.title} by ${this.author}, ${this.numPages} ` + hasReadStr;
  }
};

//MODEL
class Model {
  constructor() {
    this.library = [];
  }

  addBook(book) {
    this.library.push(book);
  }

  deleteBook(index) {
    this.library.splice(index, 1);
  }

  refreshLibrary() {
    if(localStorage.getItem('myLibrary') === null) {
      this.library = [new Book('Hunger Games', 'Suzanne Collins', 374, true), new Book('Harry Potter and the Order of the Phoenix', 'J.K. Rowling', 870, false), new Book('To Kill a Mockingbird', 'Harper Lee', 324, true)];
      updateLocalStorage();
    } else {
      const myLibrary = JSON.parse(localStorage.getItem('myLibrary'));
      this.library = [];
      myLibrary.forEach(book => {
        this.library.push(new Book(book.title, book.author, book.numPages, book.hasRead));
      });
    }
  }

  updateLocalLibrary() {
    localStorage.setItem('myLibrary', JSON.stringify(this.library));
  }
}

//VIEW
class View {
  constructor() {

  }
};

//CONTROLLER
class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }
};

//OLD CODEBASE
let jsLibrary = [];

function Book(title, author, numPages, hasRead) {
  this.author = author
  this.hasRead = hasRead
  this.numPages = numPages
  this.title = title
}

//returns info of book
Book.prototype.info = function() {
  let hasReadStr = this.hasRead ? 'already read' : 'not read';
  return `${this.title} by ${this.author}, ${this.numPages} pages, ` + hasReadStr;
}

//returns node to add to DOM
Book.prototype.getDomNode = function(index) {
  let domCard = document.createElement('div');
  let domDelete = document.createElement('i');
  let domTitle = document.createElement('div');
  let domBy = document.createElement('div');
  let domAuthor = document.createElement('div');
  let domNumPages = document.createElement('div');
  let domHasRead = document.createElement('div');
  let domBtn = document.createElement('button');

  domCard.classList.add('card');
  domCard.dataset.index = `${index}`;

  domDelete.classList.add('material-icons', 'card__btn_delete');
  domDelete.innerText = 'delete';
  domDelete.addEventListener('click', deleteBook);
  domCard.appendChild(domDelete);

  domTitle.classList.add('card__text', 'card__text--emphasized');
  domTitle.innerText = this.title;
  domCard.appendChild(domTitle);

  domBy.classList.add('card__text');
  domBy.innerText = 'by';
  domCard.appendChild(domBy);

  domAuthor.classList.add('card__text', 'card__text--emphasized');
  domAuthor.innerText = this.author;
  domCard.appendChild(domAuthor);

  domNumPages.classList.add('card__text');
  domNumPages.innerText = `${this.numPages} pages`;
  domCard.appendChild(domNumPages);

  domHasRead.classList.add('card__text');
  domHasRead.innerText = this.hasRead ? 'read' : 'not read';
  domCard.appendChild(domHasRead);

  domBtn.classList.add('btn', 'btn--small');
  domBtn.innerText = 'Change read status';
  domBtn.addEventListener('click', toggleHasRead);
  domCard.appendChild(domBtn);

  return domCard;
}

function addBookToLibrary(book) {
  jsLibrary.push(book);
  updateLocalStorage();
}

/*
TODO different style when read to stand out (green text/checkmark)
TODO organize code better (refactor if necessary)
TODO change status button same place in each card (independent of text sizes)
*/

//deletes book from dom and js
function deleteBook(e) {
  const card = e.target.parentElement;
  const index = card.dataset.index;
  card.remove();
  jsLibrary.splice(index,1); //remove 1 element from index
  updateLocalStorage();
}

//renders js library in dom
function renderBooks() {
  //remove current books
  while(library.firstChild) {
    library.removeChild(library.lastChild);
  }
  //add updated library
  for(let i = 0; i < jsLibrary.length; i++) {
    library.appendChild(jsLibrary[i].getDomNode(i));
  }
}

//toggles book's hasRead in dom and js
function toggleHasRead(e) {
  const card = e.target.parentElement;
  const index = card.dataset.index;
  jsLibrary[index].hasRead = !jsLibrary[index].hasRead;
  //TODO better way to get read status element?
  card.childNodes[5].innerText = jsLibrary[index].hasRead ? 'read' : 'not read'; //get read status element
  updateLocalStorage();
}

//close modal form
function closeForm() {
  modal.classList.toggle('modal--closed');
  modalOverlay.classList.toggle('modal--closed');
  formAddBook.reset();
}

//open modal form
function openForm() {
  modal.classList.toggle('modal--closed');
  modalOverlay.classList.toggle('modal--closed');
}

//validate input
function isValidForm() {
  let errStr = '';
  if(bookTitle.value == '') {
    errStr += '-Title cannot be blank.\n';
  } 
  if(bookAuthor.value == '') {
    errStr += '-Author cannot be blank.\n';
  }
  if(bookNumPages.value < 1) {
    errStr += '-Number of pages cannot be less than 1.\n';
  }
  if(isNaN(bookNumPages.value)) {
    errStr += '-Number of pages must be a number.\n';
  }
  if(errStr.length > 0) {
    alert(`Please fix these errors before continuing:\n\n ${errStr}`);
    return false;
  } else {
    return true;
  }
}

//if form is valid then add book and close form
function handleAddingBook(e) {
  e.preventDefault();
  if(isValidForm()) {
    const newBook = new Book(bookTitle.value, bookAuthor.value, bookNumPages.value, bookHasRead.checked);
    addBookToLibrary(newBook);
    renderBooks();
    closeForm();
  }
}

//update localStorage for library
function updateLocalStorage() {
  localStorage.setItem('myLibrary', JSON.stringify(jsLibrary));
}

//get library from localStorage if available else fill with pre-defined books
function refreshLibrary() {
  if(localStorage.getItem('myLibrary') === null) {
    jsLibrary = [new Book('Hunger Games', 'Suzanne Collins', 374, true), new Book('Harry Potter and the Order of the Phoenix', 'J.K. Rowling', 870, false), new Book('To Kill a Mockingbird', 'Harper Lee', 324, true)];
    updateLocalStorage();
  } else {
    let myLibrary = JSON.parse(localStorage.getItem('myLibrary'));
    jsLibrary = [];
    myLibrary.forEach(book => {
      jsLibrary.push(new Book(book.title, book.author, book.numPages, book.hasRead));
    });
  }
}

//DOM Elements
//buttons
const btnOpenForm = document.querySelector('#btn-show-form');
const btnCloseForm = document.querySelector('#btn-close-modal');
const btnAddBook = document.querySelector('#btn-add-book');

//blocks
const library = document.querySelector('#library');
const modal = document.querySelector('#modal');
const modalOverlay = document.querySelector('#modal-overlay');
const formAddBook = document.querySelector('#add-book-form');

//inputs
const bookTitle = document.querySelector('#new-book-title');
const bookAuthor = document.querySelector('#new-book-author');
const bookNumPages = document.querySelector('#new-book-num-pages');
const bookHasRead = document.querySelector('#new-book-has-read');

//eventListeners
//close modal when clicked outside form
window.onclick = function(e){
  if(e.target == modalOverlay) {
    closeForm();
  }
}

btnOpenForm.addEventListener('click', openForm);
btnCloseForm.addEventListener('click', closeForm);
btnAddBook.addEventListener('click', handleAddingBook);

//run on start
refreshLibrary();
renderBooks();
