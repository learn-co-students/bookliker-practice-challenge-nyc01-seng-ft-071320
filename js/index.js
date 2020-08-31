document.addEventListener("DOMContentLoaded", function () {
  fetchBooks();
  clickHandler();
});
const baseUrl = "http://localhost:3000/books/";

const fetchBooks = () => {
  fetch(baseUrl)
    .then((resp) => resp.json)
    .then(renderBooks);
};

const renderBooks = (books) => {
  let ul = document.querySelector("ul");

  for (const book of books) {
    let bookLi = document.createElement("li");
    bookLi.id = book.id;
    bookLi.innerHTML = book.title;

    ul.append(bookLi);
  }
};

const clickHandler = () => {
  document.addEventListener(`click`, (e) => {
    if (e.target.matches("li")) {
      const li = e.target;
      getBook(li);
    } else if (e.target.matches("button")) {
      let button = e.target;
      patchBook(button);
    }
  });
};

const getBook = (object) => {
  return fetch(baseUrl + object.id).then((res) => res.json());
};

const showBookInfo = (book) => {
  let showPanel = document.getElementById(`show-panel`);
  showPanel.innerHTML = `
    <img src="${book.img_url}" alt="${book.title}">
    <h4>${book.title}</h4>
    <h4>${book.subtitle}</h4>
    <h4>${book.author}</h4>
    <p>${book.description}</p>
    `;
  let ul = document.createElement("ul");
  showPanel.append(ul);

  for (const user in book.users) {
    let li = document.createElement("li");
    ul.append(li);
    li.innerHTML = user.username;
  }

  let likeButton = document.createElement("button");
  likeButton.innerHTML = "LIKE";
  likeButton.bookId = book.id;
  likeButton.dataset.bookUsers = book.users;
  showPanel.append(likeButton);
};

const patchBook = (button) => {
  getBook(button).then((obj) => {
    let self = { id: 1, username: "pouros" };
    let bookUsers = obj.users;
    bookUsers.push(self);
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ users: bookUsers }),
    };
    fetch(baseUrl + button.id, options)
      .then((resp) => resp.json())
      .then(showBookInfo);
  });
};
