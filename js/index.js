document.addEventListener("DOMContentLoaded", function() {});
const listOfBooks = document.querySelector('#list')
const showPanel = document.querySelector("#show-panel")
const baseURL = 'http://localhost:3000/books/'
let bookName;

function getAllBooks(bookName){
fetch(baseURL)
.then(resp => resp.json())
.then(books => renderBooks(books, bookName) )
}

function renderBooks(books, bookName=false ){
    for(let book of books){
        if(bookName){
            if(book.title == bookName){
                showInfo(book)
            }
        } else 
        renderTitle(book)
    }
}

listOfBooks.addEventListener('click', function(e){
    if(e.target.matches('li')){
        bookName = e.target.innerText
        getAllBooks(bookName)
    }
})

function showInfo(bookInfo){
    showPanel.innerHTML = `<img src=${bookInfo.img_url}><h2>${bookInfo.title}</h2>
    <h2>${bookInfo.subtitle}</h2><h2>${bookInfo.author}</h2>${bookInfo.description}
    <ul></ul><button class=${bookInfo.id}>Like</button>`
    
    likedList(bookInfo)
}

function likedList(bookInfo){
    const likedSection = showPanel.querySelector('ul')
    for(let i = 0; i < bookInfo.users.length; i++){
        const li = document.createElement('li')
        li.innerText = bookInfo.users[i].username
        likedSection.append(li)

    }
}

function renderTitle(book){
    const li = document.createElement('li')
    li.innerText = book.title
    listOfBooks.append(li)
}

document.addEventListener('click', function(e){
    if(e.target.matches('button')){
        likedBook(e.target.className)
        
        
    }
})

function likedBook(bookId){
    const config = {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json',
            Accept: 'applicatiopn/json'
        },
        body: JSON.stringify({
            users: [
                {"id":1, "username": "pouros"}
            ]
        })
    }
   fetch(baseURL + bookId, config)
   .then(resp => resp.json())
   .then(showPanel.querySelector('ul').innerHTML = '<li>pouros</li>')

}

getAllBooks();
