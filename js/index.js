booksURL = 'http://localhost:3000/books/'
const qs = (selector) => document.querySelector(selector)
const ce = (element) => document.createElement(element)
const gid = (id) => document.getElementById(id)
let booksList = gid('list')
let panel = gid('show-panel')

function getBooks() {
    fetch(booksURL)
    .then(resp => resp.json())
    .then(books => displayBooks(books))
}


function displayBooks(books) {
    for (let book of books) {
        displayBook(book)
    }
}

function displayBook(book) {
    let bookLi = ce('li')
    bookLi.innerText = book.title
    bookLi.dataset.bookId = book.id
    booksList.append(bookLi)
}

function displayBookCompletely(book, likeText) {
    panel.innerHTML = ""
    let bookShow = ce('div')
        bookShow.dataset.bookId = book.id
        bookShow.innerHTML = `
            <img src=${book.img_url}>
            <h3>${book.title}</h3>
            <h3>${book.subtitle}</h3>
            <h3>${book.author}</h3>
            <p>${book.description}</p>`

    let userUl = ce('ul')
        userUl.dataset.bookId = book.id
        for (let user of book.users) {
            let userLi = ce('li')
            userLi.textContent = user.username
            userLi.dataset.userId = user.id
            userUl.append(userLi)
        }

    let likeButton = ce('button')
        likeButton.innerText = likeText
        likeButton.classList.add('like-button')

    bookShow.append(userUl)
    bookShow.append(likeButton)
    panel.append(bookShow)
}   

function deleteBookDisplay() {
    panel.firstChild.remove()
}

booksList.addEventListener('click', e => {
    console.log(e.target)
    if (panel.firstChild) {
        deleteBookDisplay()
    }
    fetch(booksURL + e.target.dataset.bookId)
    .then(resp => resp.json())
    .then(book => displayBookCompletely(book, "Like"))
})

panel.addEventListener('click', e => {
    if (e.target.matches('.like-button')) {
        let bookId = e.target.parentElement.dataset.bookId
        fetch(booksURL + bookId)
        .then(resp => resp.json())
        .then(book => addToUsers(book))

        function addToUsers(book) {
            let currentLike = book.users.find(u => {return u.username == "pouros"})
            if(currentLike) {
                console.log(e.target)
                likeText = "Like"
                let count = 0
                for (let user of book.users) {
                    if (user == currentLike) {
                        book.users.splice(count,1)
                    }
                    count += 1
                }
                let config = {
                    method: "PATCH",
                    headers: {
                        "content-type": "application/json",
                        "accept": "application/json"
                    },
                    body: JSON.stringify({
                        users: book.users
                    })
                }
                fetch(booksURL + book.id, config)
                .then(resp => resp.json())
                .then(book => displayBookCompletely(book, likeText))
            } else {
                likeText = "Unlike"
                let config = {
                    method: "PATCH",
                    headers: {
                        "content-type": "application/json",
                        "accept": "application/json"
                    },
                    body: JSON.stringify({
                        users: [
                            ...book.users,
                            {"id":1, "username":"pouros"}
                        ]
                    })
                }
                fetch(booksURL + book.id, config)
                .then(resp => resp.json())
                .then(book => displayBookCompletely(book, likeText))
            }
        }
    }
})
getBooks()