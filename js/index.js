document.addEventListener("DOMContentLoaded", () => {
    const baseUrl = 'http://localhost:3000/books/'

    const fetchBooks = () => {
        fetch(baseUrl)
        .then(resp => resp.json())
        .then(books => renderBooks(books))
    }

    const renderBooks = (bookArray) => {
        for (const book of bookArray) {
            renderBook(book)
        }
    }

    const renderBook = ( {title, id} ) => {
        const li = document.createElement("li")
        const ul = document.querySelector("#list")
        li.dataset.id = id 
        li.innerHTML = title 
        ul.append(li)
    }

    const clickHandler = () => {
        document.addEventListener("click", (e) => {
            if (e.target.matches("#list li")) {
                fetchBookInfo(e.target.dataset.id)
            }
            else if (e.target.matches(".like")) {
                const bookId = parseInt(e.target.dataset.id)
                getBookLikes(bookId)
            }
        })
    }
    
    const fetchBookInfo = (id) => {
        fetch(baseUrl + id)
        .then(res => res.json())
        .then(bookInfo => {
            renderBookInfo(bookInfo)
        })
    }

    const renderBookInfo = ( {id, title, subtitle, description, author, img_url, users} ) => {
        const div = document.getElementById("show-panel")
        div.innerHTML = ""
        
        //make title h4
        const h4 = document.createElement("h4")
        h4.innerHTML = title 
        div.append(h4)

        //make author h3 
        const authh3 = document.createElement("h3")
        authh3.innerHTML = author
        div.append(authh3) 

        //make image
        const img = document.createElement("img")
        img.src = img_url
        div.append(img)

        //make subtitle h3
        const subh3 = document.createElement("h3")
        subh3.innerHTML = subtitle 
        div.append(subh3)

        //make description p
        const p = document.createElement("p")
        p.innerHTML = description
        div.append(p)

        //make ul for li of users
        const ul = document.createElement("ul")
        div.append(ul)

        for (const user of users) {
            const li = document.createElement("li")
            li.innerText = user.username
            ul.append(li)
        }

        //make like button
        const button = document.createElement("button")
        button.classList.add("like")
        button.dataset.id = id 
        button.dataset.users = users
        button.innerText = "Like"
        ul.append(button)
    }

    const getBookLikes = (bookId) => {
        fetch(baseUrl)
        .then(resp => resp.json())
        .then(bookArray => {
            console.log(book_id)
            let book = bookArray.find(element => element.id === bookId)
            let users = book.users 
            addLike(book.id, users)
        })
    }

    const addLike = (id, userArray) => {
        const self = {"id":1, "username":"pouros"}

        if (userArray.find(el => el.id === self.id)) {
            userArray = userArray.filter(element => element.id !== self.id)
            const options = {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    "Accept": 'application/json'
                },
                body: JSON.stringify({ users: userArray })
            } 
            fetch(baseUrl + id, options)
            .then(res => res.json())
            .then(bookInfo => {
                renderBookInfo(bookInfo)
            })
        } else {
            userArray.push(self)
            const options = {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    "Accept": 'application/json'
                },
                body: JSON.stringify({ users: userArray})
            }
            
            fetch(baseUrl + id, options)
            .then(res => res.json())
            .then(bookInfo => {
                renderBookInfo(bookInfo)
            })
        }
    }

    fetchBooks()
    clickHandler()

});

