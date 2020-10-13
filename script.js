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

  addBook = (book) => {
    this.library.push(book);
    this.updateLocalLibrary();
  }

  //returns true if no errors else error string
  bookValidation = (title, author, numPages) => {
    let errStr = '';
    if(title == '') {
      errStr += 'Title cannot be blank.\n';
    }
    if(author == '') {
      errStr += 'Author cannot be blank.\n';
    }
    if(numPages < 1) {
      errStr += 'Number of pages cannot be less than 1.\n';
    }
    if(isNaN(numPages)) {
      errStr += 'Number of pages must be a number.\n';
    }
    if(errStr.length > 0) {
      errStr = 'Please fix these errors before continuing:\n\n' + errStr;
      return errStr;
    } else {
      return true;
    }
  }

  changeReadStatus = (index) => {
    this.library[index].hasRead = !this.library[index].hasRead;
    this.updateLocalLibrary();
  }

  deleteBook = (index) => {
    this.library.splice(index, 1);
    this.updateLocalLibrary();
  }

  refreshLibrary = () => {
    if(localStorage.getItem('myLibrary') === null) {
      this.library = [new Book('Hunger Games', 'Suzanne Collins', 374, true), new Book('Harry Potter and the Order of the Phoenix', 'J.K. Rowling', 870, false), new Book('To Kill a Mockingbird', 'Harper Lee', 324, true)];
      this.updateLocalLibrary();
    } else {
      const myLibrary = JSON.parse(localStorage.getItem('myLibrary'));
      this.library = [];
      myLibrary.forEach(book => {
        this.library.push(new Book(book.title, book.author, book.numPages, book.hasRead));
      });
    }
  }

  updateLocalLibrary = () => {
    localStorage.setItem('myLibrary', JSON.stringify(this.library));
  }
}

//VIEW
class View {
  constructor() {
    this.formAddBook = document.querySelector('#add-book-form');
    this.library = document.querySelector('#library');
    this.modal = document.querySelector('#modal');
    this.modalOverlay = document.querySelector('#modal-overlay');
  }

  //add book to end of library
  addBook = (book) => {
    const libraryLength = document.querySelectorAll('.js-card').length;
    const card = this.createBookDOMNode(book, libraryLength);
    this.library.appendChild(card);
  }

  changeReadStatus = (index, changeToHasRead) => {
    const hasReadElements = document.querySelectorAll('.js-read-status');
    hasReadElements[index].innerText = changeToHasRead ? 'read' : 'not read';
  }

  closeForm = () => {
    this.modal.classList.add('modal--closed');
    this.modalOverlay.classList.add('modal--closed');
    this.formAddBook.reset();
  }

  //creates a DOM node from a book (no eventListeners)
  createBookDOMNode = (book, index) => {
    const domCard = document.createElement('div');
    domCard.classList.add('card', 'js-card');
    domCard.dataset.index = `${index}`;

    const domDelete = document.createElement('i');
    domDelete.classList.add('material-icons', 'card__btn_delete', 'js-delete-book');
    domDelete.innerText = 'delete';
    domCard.appendChild(domDelete);

    const domTitle = document.createElement('div');
    domTitle.classList.add('card__text', 'card__text--emphasized');
    domTitle.innerText = book.title;
    domCard.appendChild(domTitle);
    
    const domBy = document.createElement('div');
    domBy.classList.add('card__text');
    domBy.innerText = 'by';
    domCard.appendChild(domBy);

    const domAuthor = document.createElement('div');
    domAuthor.classList.add('card__text', 'card__text--emphasized');
    domAuthor.innerText = book.author;
    domCard.appendChild(domAuthor);

    const domNumPages = document.createElement('div');
    domNumPages.classList.add('card__text');
    domNumPages.innerText = `${book.numPages} pages`;
    domCard.appendChild(domNumPages);

    const domHasRead = document.createElement('div');
    domHasRead.classList.add('card__text', 'js-read-status');
    domHasRead.innerText = book.hasRead ? 'read' : 'not read';
    domCard.appendChild(domHasRead);

    const domBtn = document.createElement('button');
    domBtn.classList.add('btn', 'btn--small', 'js-change-status');
    domBtn.innerText = 'Change read status';
    domCard.appendChild(domBtn);

    return domCard;
  }

  //delete book at index
  deleteBook = (index) => {
    const cards = document.querySelectorAll('.js-card');
    cards[index].remove();
  }

  openForm = () => {
    this.modal.classList.remove('modal--closed');
    this.modalOverlay.classList.remove('modal--closed');
  }

  renderBooks = (books) => {
    //remove current books
    while(this.library.firstChild) {
      this.library.removeChild(this.library.lastChild);
    }
    //render new books
    for(let i = 0; i < books.length; i++) {
      this.addBook(books[i]);
    }
  }
};

//CONTROLLER
class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.btnOpenForm = document.querySelector('#btn-show-form');
    this.btnCloseForm = document.querySelector('#btn-close-modal');
    this.btnAddBook = document.querySelector('#btn-add-book');
    this.newBookAuthor = document.querySelector('#new-book-author');
    this.newBookHasRead = document.querySelector('#new-book-has-read');
    this.newBookNumPages = document.querySelector('#new-book-num-pages');
    this.newBookTitle = document.querySelector('#new-book-title');
  }
  //add eventListeners to card buttons
  addDynamicListeners = () => {
    const deleteButtons = document.querySelectorAll('.js-delete-book');
    const changeStatusButtons = document.querySelectorAll('.js-change-status');

    Array.from(deleteButtons).forEach(btn => btn.addEventListener('click', this.handleDeletingBook));
    Array.from(changeStatusButtons).forEach(btn => btn.addEventListener('click', this.handleChangingStatus));
  }

  //add eventListeners to static buttons
  addStaticListeners = () => {
    //open form
    this.btnOpenForm.addEventListener('click', this.view.openForm);
    //close form
    this.btnCloseForm.addEventListener('click', this.view.closeForm);
    this.view.modalOverlay.addEventListener('click', this.view.closeForm);
    //add book
    this.btnAddBook.addEventListener('click', this.handleAddingBook);
  }
  
  //if form is valid: add book, and rerender (w/ updated indices)
  handleAddingBook = (e) => {
    e.preventDefault;
    //true if valid else string of errors to fix
    const validationResult = this.model.bookValidation(this.newBookTitle.value, this.newBookAuthor.value, this.newBookNumPages.value);
    //add book to model, render books, and close form
    if(validationResult === true) {
      const newBook = new Book(this.newBookTitle.value, this.newBookAuthor.value, this.newBookNumPages.value, this.newBookHasRead.checked);
      this.model.addBook(newBook);
      this.view.renderBooks(this.model.library);
      this.addDynamicListeners();
      this.view.closeForm();
    } else {
      alert(validationResult);
    }
  }

  //change read status on a book
  handleChangingStatus = (e) => {
    const card = e.target.parentElement;
    const index = card.dataset.index;
    console.log({card, index});
    this.model.changeReadStatus(index);
    this.view.changeReadStatus(index, this.model.library[index].hasRead);

  }

  //delete book and rerender (w/ updated indices)
  handleDeletingBook = (e) => {
    const card = e.target.parentElement;
    const index = card.dataset.index;
    this.view.deleteBook(index);
    this.model.deleteBook(index);
    this.view.renderBooks(this.model.library);
    this.addDynamicListeners();
  }

  loadPage = () => {
    this.addStaticListeners();
    this.model.refreshLibrary();
    this.view.renderBooks(this.model.library);
    this.addDynamicListeners();
  }
};

/*
TODO different style when read to stand out (green text/checkmark)
TODO organize code better (refactor if necessary)
TODO change status button same place in each card (independent of text sizes)
*/

//RUNTIME
const model = new Model();
const view = new View();
const controller = new Controller(model, view);
controller.loadPage();
