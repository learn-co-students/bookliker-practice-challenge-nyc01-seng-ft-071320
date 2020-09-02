const ce = tag => document.createElement(tag)
const qs = selector => document.querySelector(selector)
const showPanel = qs('#show-panel')
const ul = qs('#list')

const clickHandler = () => {
  document.addEventListener('click', e => {
    switch (e.target.className) {
      case 'book':
        getBook(e.target.dataset.bookId)
        break
      case 'like':
        toggleLike(e.target)
        break
      default:
        break
    }
  })
}

const renderBooks = books => {
  books.forEach(renderBook)
}

const renderBook = book => {
  const li = ce('li')
  ul.append(li)
  li.textContent = book.title
  li.className = 'book'
  li.dataset.bookId = book.id
}

const getBooks = () => {
  fetch('http://localhost:3000/books')
  .then(res => res.json())
  .then(renderBooks)
}

const getBook = (id) => {
  fetch(`http://localhost:3000/books/${id}`)
  .then(res => res.json())
  .then(showBook)
}

const showBook = (book) => {
  showPanel.innerHTML = ''

  const likeStatus = book.users.filter(user => user.id === 1).length > 0 ? 'UNLIKE' : 'LIKE'

  showPanel.dataset.id = book.id
  showPanel.innerHTML = `
    <img src="${book.img_url}">
    <h2>${book.title}</h2>
    <h2>${book.subtitle}</h2>
    <h2>${book.author}</h2>
    <p>${book.description}</p>
    <ul id="user-list"></ul>
    <button class="like">${likeStatus}</button>
  `
  book.users.forEach(showUser)
}

const showUser = (user) => {
  const userLi = ce('li')
  qs('#user-list').append(userLi)
  userLi.textContent = user.username
}

const toggleLike = (target) => {
  const book_id = target.parentElement.dataset.id

  fetch(`http://localhost:3000/books/${book_id}`)
  .then(res => res.json())
  .then(book => {
    if (target.textContent === 'LIKE') {
      addUsers(book) // this function should make a fetch request to update the users property on a given book
    } else {
      removeUsers(book)
    }
  })
}

const addUsers = book => {
  const user = {"id":1, "username":"pouros"}
  const allUsers = [...book.users]
  allUsers.push(user)

  const options = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      users: allUsers
    })
  }
  fetch(`http://localhost:3000/books/${book.id}`, options)
  .then(res => res.json())
  .then(showBook)
}

const removeUsers = book => {
  const allUsers = [...book.users].filter(user => user.id !== 1)

  const options = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      users: allUsers
    })
  }
  fetch(`http://localhost:3000/books/${book.id}`, options)
  .then(res => res.json())
  .then(showBook)
}

clickHandler()
getBooks()
