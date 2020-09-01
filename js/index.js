//Books to the boogie. Hide in the honey! 
document.addEventListener("DOMContentLoaded", function() {
    console.log('we ready to roll in this')
    get()
});//This line ends DOM. Please touch other stuff, but not this line

function get (){
    fetch('http://localhost:3000/books')
    .then(res=>res.json())
    .then(books=>books.forEach(book=>render(book)))
}

function render(book){//console.log(book)
    const list=document.querySelector('#list-panel')
    const title = document.createElement('li')
    list.appendChild(title)
    title.dataset.id=book.id
    title.className='book'
    title.innerText=`${book.title}`

    //This is the show constant where the stuff has to show up
        const show=document.querySelector('#show-panel')
        title.addEventListener('click',(e)=>{ //console.log("This is the book we are clicking on")
            show.innerHTML=""
            const div =document.createElement('div')
            show.appendChild(div)
            // console.log(book.author=="Angela Y. Davis")
            div.innerHTML=`<img src='${book.img_url}' alt='${book.author}'>
            <h4 id='book-title'>${book.title}</h4>
            <h4 id='book-subtitle'>${book.subtitle}</h4>
            <h4 id='book-author'>${book.author}</h4>
            <p id='description'>${book.description}</p>
            `
            //user management 
            const ul =document.createElement('ul')
            ul.id='users-list'
            const btn=document.createElement('button')//attached at the end
            btn.id='like-btn'
            btn.innerText="like"
            // btn.dataset.userId=
            div.appendChild(ul)
            div.appendChild(btn)
            createUserlist(book.users)
            // console.log(ul.lastChild.dataset.id==1)
            if (ul.lastChild.dataset.id==1){btn.innerText="unlike"}
            btn.addEventListener('click',(e)=>{//console.log(btn.innerText=="like")
                const user = {"id":1, "username":"pouros"}
                if (btn.innerText=="like"){// console.log(user) //console.log(book.users)
                    book.users.push(user) // console.log(book.id)// const url ="http://localhost:3000/books/"+book.id // console.log(url)
                    fetch('http://localhost:3000/books/'+book.id, {
                        method: "PATCH",
                        headers: {
                        "Content-type": "application/json",
                        "accept": "application/json"
                        },
                        body: JSON.stringify({
                            users: book.users
                        })
                    }).then(res=>res.json())
                    .then(book=>{
                        const usersList = document.querySelector('#users-list')
                        usersList.innerHTML=""
                        createUserlist(book.users)
                        usersList.nextElementSibling.innerText="unlike"
                    })
                }else{//console.log(book.users)
                    book.users.pop()
                    fetch('http://localhost:3000/books/'+book.id, {
                        method: "PATCH",
                        headers: {
                        "Content-type": "application/json",
                        "accept": "application/json"
                        },
                        body: JSON.stringify({
                            users: book.users
                        })   
                    }).then(res=>res.json())
                    .then(book=>{
                        const usersList = document.querySelector('#users-list')
                        usersList.innerHTML=""
                        createUserlist(book.users)
                        usersList.nextElementSibling.innerText="like"
                    })
                }
            })//this is the end of on my button 

        })//This is the end of list and add event listener
}//This is the end of render books

function createUserlist (users){
    for (const user of users){
        const usersList = document.querySelector('#users-list')
        const li =document.createElement('li')
        li.dataset.id=`${user.id}`
        li.innerText=`${user.username}`
        usersList.appendChild(li)
    }
}