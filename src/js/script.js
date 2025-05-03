{
  'use strict';

  const select = {
    templateOf: {
      book: '#template-book',
    },
    containerOf: {
      booksList: '.books-list',
    },
    bookElement: {
      book: '.book',
      bookImage: '.book__image',
      bookId: 'data-id',
      bookRating: '.book__rating',
      bookFill: '.book__rating__fill',
    },
    form: '.filters',
  };

  const templates = {
    booksList: Handlebars.compile(document.querySelector(select.templateOf.book).innerHTML),
  };

  const classNames = {
    books: {
      selected: 'active',
      favorite: 'favorite',
      hidden: 'hidden',
    },
  };

  class BookList {
    constructor() {
      const thisBookList = this;
      thisBookList.filters = [];
      thisBookList.favoriteBooks = [];
      thisBookList.getElements();
    }

    getElements(){
      const thisBookList = this;
      thisBookList.bookList = document.querySelector(select.containerOf.booksList);
      thisBookList.bookFilters = document.querySelector(select.form);
    }
        
      
    rating(book) {
      const bookRating = book.rating;
      const bookId = book.id;
      const bookFromList = document.querySelector(`[data-id="${bookId}"]`);
      const bookRate = bookFromList.parentElement.querySelector(select.bookElement.bookFill);
      //console.log(bookRating, bookRate);

      if (bookRating < 6) {
        bookRate.style.background = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
      } else if (bookRating >= 6 && bookRating <= 8) {
        bookRate.style.background = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
      } else if (bookRating > 8 && bookRating <= 9) {
        bookRate.style.background = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
      } else if (bookRating > 9) {
        bookRate.style.background = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
      }

      bookRate.style.width = `${Math.min(bookRating, 10) * 10}%`;
    }
      
    filter() {
      const thisBookList = this;
      const books = dataSource.books;
      for (let book of books) {
        const bookDetails = book.details;
        const isAdult = bookDetails.adults;
        const isNonFic = bookDetails.nonFiction;
        const bookId = book.id;
        const bookFromList = document.querySelector(`[data-id="${bookId}"]`);
        
        if (!isAdult && !isNonFic) {
          bookFromList.classList.remove(classNames.books.hidden);
        } else if (!isAdult && thisBookList.filters.includes('adults')) {
          bookFromList.classList.add(classNames.books.hidden);
        } else if (!isNonFic && thisBookList.filters.includes('nonFiction')) {
          bookFromList.classList.add(classNames.books.hidden);
        } else if (isAdult && thisBookList.filters.includes('adults')) {
          bookFromList.classList.remove(classNames.books.hidden);
        } else if (isNonFic && thisBookList.filters.includes('nonFiction')) {
          bookFromList.classList.remove(classNames.books.hidden);
        } else if (thisBookList.filters.length === 0) {
          bookFromList.classList.remove(classNames.books.hidden);
        }
      }
    }
      
    render() {
      const thisBookList = this;
      for (let book of dataSource.books) {
        const generatedHTML = templates.booksList(book);
        thisBookList.bookList.innerHTML += generatedHTML;
        thisBookList.rating(book);
      }
    }
      
    initActions() {
      const thisBookList = this;
      const bookList = thisBookList.bookList;
        
      bookList.addEventListener('dblclick', (e) => {
        const container = e.target.closest(select.bookElement.bookImage);
        container.classList.toggle(classNames.books.favorite);
        if (container.classList.contains(classNames.books.favorite)) {
          thisBookList.favoriteBooks.push(container.getAttribute(select.bookElement.bookId));
        } else {
          thisBookList.favoriteBooks.splice(thisBookList.favoriteBooks.indexOf(container.getAttribute(select.bookElement.bookId)), 1);
        }
      });
        
      thisBookList.bookFilters.addEventListener('change', (e) => {
        if (e.target.checked) {
          thisBookList.filters.push(e.target.value);
        } else {
          thisBookList.filters.splice(thisBookList.filters.indexOf(e.target.value), 1);
        }
        thisBookList.filter();
      });
    }
  }

  const bookList = new BookList();
  bookList.render();
  bookList.initActions();
}