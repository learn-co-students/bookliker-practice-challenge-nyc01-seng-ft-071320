document.addEventListener("DOMContentLoaded", function() {

    const bookList = document.querySelector('ul#list')
    const showPanel = document.querySelector('div#show-panel')

    function getBooks() {
        fetch('http://localhost:3000/books')
        .then(response => response.json())
        .then(books => {
            renderBooks(books);
            window.allBooks = books
            
        })
    }

    function renderBooks(books) {
        for(const book of books){
            bookList.insertAdjacentHTML('beforeend', `<li id="${book.id}" class="book">${book.title}</li>`)
        }
    }

    function clickHandler() {
        document.addEventListener('click', function(e) {

            if(e.target.matches('li.book')){
                showPanel.innerHTML = ''
                let theBook = allBooks.find(function(book){
                    return book.id == e.target.id
                })
                showPanel.insertAdjacentHTML('beforeend', `<img src="${theBook.img_url}">
                <h3>${theBook.title}</h3>
                <p>${theBook.description}</p>
                <ul id="${theBook.id}">
                </ul>
                <button class="like-btn">Like</button>
                `)
                const userList = showPanel.querySelector(`ul`)
                for(const user of theBook.users){
                    userList.insertAdjacentHTML('beforeend', `<li id="${user.id}">${user.username}</li>`)
                }
                showPanel.addEventListener('click', function(e) {
                    console.log(theBook.users)
                    if(e.target.matches('button.like-btn')){
                        console.log((theBook.users.some(object => object.username === "pouros")))
                        if(!(theBook.users.some(object => object.username === "pouros"))) {
                            theBook.users.push({"id":1, "username":"pouros"})
                        }
                        const options = { 
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                                Accept: 'application/json'
                            },
                            body: JSON.stringify({
                                "users": theBook.users
                            })
                        }
                        fetch(`http://localhost:3000/books/${theBook.id}`, options)
                        .then(response => response.json())
                        .then(book=> {
                            userList.innerHTML = ''
                            for(const user of book.users){
                                userList.insertAdjacentHTML('beforeend', `<li id="${user.id}">${user.username}</li>`)
                            }
                        })
                    }
                })
            }


        })
    }


    getBooks();
    clickHandler();
});
