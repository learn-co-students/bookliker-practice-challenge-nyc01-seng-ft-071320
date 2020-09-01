document.addEventListener("DOMContentLoaded", function() {

    const url = "http://localhost:3000/books/"
    const list = document.querySelector("#list")
    const show = document.querySelector("#show-panel")

    function getBooks(){
        fetch(url)
        .then(res => res.json())
        .then(data => renderBooks(data))
    }

    function renderBooks(data){
        for(let book of data){
            let li = document.createElement('li')
            li.innerHTML = `<p>${book.title}</p>`
            list.append(li)
        }
    }

    function clickHandler(){
        document.addEventListener("click", (e) => {
            button = e.target
            console.log(e)
            if(button.tagName === "P"){
                selectedTitle = button.innerText
                bookLookup(selectedTitle)
            } else if(button.tagName === "BUTTON"){
                const bookId = parseInt(button.dataset.id)
                getCurrLikes(bookId)
                
            }
        })
    }

    function bookLookup(title){
        
        fetch(url)
        .then(res => res.json())
        .then(data => {
            let bookObj = data.find(el => el.title === title);
            renderBook(bookObj)
        })
    }

    function renderBook(bookObj){
        show.innerHTML = ""
        show.innerHTML = `
            <img src="${bookObj.img_url}"></img>
            <h4>${bookObj.title}</h4>
            <h4>${bookObj.subtitle}</h4>
            <h4>${bookObj.author}</h4>
            <h5>${bookObj.description}</h5>
            <ul class="users-list"></ul>
            <button class="like-button" data-id="${bookObj.id}">LIKE</button>
        `
        addBookUsers(bookObj)
    }

    function addBookUsers(bookObj) {
        const usersDiv = document.querySelector(".users-list")
        for (let i = 0; i < bookObj.users.length; i++) {
            let li = document.createElement("li")
            li.innerText = bookObj.users[i].username
            usersDiv.append(li)
        }
    }

    function getCurrLikes(bookId){
        fetch(url)
        .then(res => res.json())
        .then(data => {
            
            let bookObj = data.find(el => el.id === bookId);
            let arrOfLikes = bookObj.users
            likeBook(bookObj, arrOfLikes)
        })
    }

    function likeBook(bookObj, arrOfLikes){
        const person = {"id": 1, "username": "pouros"}

        if ((arrOfLikes.find(e => e.username === 'pouros'))) {
            arrOfLikes.pop()
            const options = {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ users: arrOfLikes }),
            }
            // debugger
            fetch(url + bookObj.id, options)
            .then(res => res.json())
            .then(console.log)
          } else {
        
        arrOfLikes.push(person)
        
        const options = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ users: arrOfLikes }),
        }
        // debugger
        fetch(url + bookObj.id, options)
        .then(res => res.json())
        .then(console.log)
    }}








    getBooks()
    clickHandler()
});
