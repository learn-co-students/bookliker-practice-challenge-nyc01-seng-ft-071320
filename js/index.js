const ce = tag => document.createElement(tag)
const qs = selector => document.querySelector(selector)
const showPanel = qs('#show-panel')
const bookImage = ce('img')
showPanel.append(bookImage)
const bookTitle = ce('h2')
showPanel.append(bookTitle)
const bookSubtitle = ce('h2')
showPanel.append(bookSubtitle)
const bookAuthor = ce('h2')
showPanel.append(bookAuthor)
const bookDescription = ce('p')
showPanel.append(bookDescription)
const userUl = ce('ul')
showPanel.append(userUl)
const likeBtn = ce('button')
showPanel.append(likeBtn)
likeBtn.style.display = 'none'
likeBtn.className = 'like'

const clickHandler = () => {
  document.addEventListener('click', e => {
    switch (e.target.className) {
      case 'book':
        showBook(e.target.dataset.bookId)
        break
      case 'like':
        toggleLike(e.target)
        break
      default:
        break
    }
  })
}

const listBooks = (book) => {
  const ul = qs('#list')
  const li = ce('li')
  ul.append(li)
  li.textContent = book.title
  li.className = 'book'
  li.dataset.bookId = book.id
}

const getBooks = () => {
  fetch('http://localhost:3000/books')
  .then(res => res.json())
  .then(books => books.forEach(listBooks))
}

const showBook = (id) => {
  fetch(`http://localhost:3000/books/${id}`)
  .then(res => res.json())
  .then(book => {
    showUsers(book)
    showPanel.dataset.id = book.id
    bookImage.src = book.img_url
    bookTitle.textContent = book.title
    bookSubtitle.textContent = book.subtitle
    bookAuthor.textContent = book.author
    bookDescription.textContent = book.description
    likeBtn.style.display = ''
    if (book.users.filter(user => user.id === 1).length > 0) {
      likeBtn.textContent = 'UNLIKE'
    } else {
      likeBtn.textContent = 'LIKE'
    }
  })
}

const showUsers = (book) => {
  userUl.innerHTML = ''
  book.users.forEach(user => {
    const userLi = ce('li')
    userUl.append(userLi)
    userLi.textContent = user.username
  })
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
  // target.textContent === 'LIKE'
  // showBook(target.parentElement.dataset.id)

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
  .then(book => showUsers(book))
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
  .then(book => showUsers(book))
}

clickHandler()
getBooks()
