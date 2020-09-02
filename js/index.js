document.addEventListener("DOMContentLoaded", function() {
    //first create global variables for the html area's I need to add the books into
    const list = document.querySelector('ul#list')
    const showPanel = document.querySelector('div#show-panel')
    const self = {"id":1, "username":"pouros"}

    const bookUrl = 'http://localhost:3000/books/'
    // console.log(list, showPanel)

    //fetch the data for ALL THE BOOKS
    function getBooks () {
        fetch(bookUrl)
        .then(resp => resp.json())
        .then(books => {
            renderBooks(books);
            window.allBooks = books
        }) //aspirational code to renderBooks(books)
    }

    //create the renderBooks (PLURAL) function
    function renderBooks(books) {
        for (const book of books) {
            renderBook(book)
        }
    }
    
    function renderBook(book) {
        let bookLi = document.createElement('li')
        bookLi.innerHTML = `<li id="${book.id}" class="book">${book.title}</li>`
        list.append(bookLi)
        // debugger
    }

    //create the function to show the book details
    function showBook(book) {
        showPanel.innerHTML = `
        <img src=${book.img_url}/>
        <h3>${book.title}</h3>
        <h4>${book.subtitle}</h4>
        <h5>${book.author}</h5>
        <p>${book.description}</p>
        `
        let ul = document.createElement("ul")
        showPanel.append(ul)
        // let users = `${book.users}`

        for (const user of book.users) {
            let li = document.createElement('li')
            li.innerHTML = user.username
            ul.append(li)
        }
        // debugger

        //create the like button with the corresponding id for each book
            //with the id, we can associate the button with appropriate users
        let likeButton = document.createElement('button')
        likeButton.innerHTML = "LIKE"
        likeButton.bookId = book.id
        likeButton.dataset.bookUsers = book.users
        showPanel.append(likeButton)        
    };

    //fetch data from a single book -> useful for the PATCH request
   
    function getBook(obj) {
        fetch(bookUrl + obj.id)
        .then(response => response.json());
    }

    //Create the function to PATCH book details
    const patchBook = (button) => {
        getBook(button)
        .then((obj) => {
          let user = { id: 1, username: "pouros" };
          let bookUsers = obj.users;
          bookUsers.push(user);
          
          const options = {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            body: JSON.stringify({ users: bookUsers }),
          };
          fetch(bookUrl + button.id, options)
            .then(resp => resp.json())
            .then(showBook);
        });
    }
  
    
    
    function clickHandler() {
        document.addEventListener('click', e => {
            if (e.target.matches('li.book')){
                let clickedBook = allBooks.find(book => {
                    return book.id == e.target.id
                })
                // debugger
                showBook(clickedBook);
            } else if (e.target.matches('button')) {
                let button = e.target
                patchBook(button)
            }
        })
    }
    


    //invoke the functions
    getBooks()
    clickHandler()
});
