const baseURL = 'http://localhost:3000/books/'
const ulList = document.getElementById('list')
const showPanel = document.getElementById('show-panel')
const listPanel = document.getElementById('list-panel')

function createBookList(bookArray){
  for (const book of bookArray){
    const newLi = document.createElement('li')
    newLi.dataset.bookId = book.id 
    newLi.innerText = `${book.title}`
    ulList.append(newLi)
  }
}
function getBooks(){
  fetch(baseURL)
  .then(resp=>resp.json())
  .then(createBookList)
}

ulList.addEventListener('mouseover', e =>{
  if (e.target.matches('li')){
    e.target.style.cursor = "pointer"
  }
})

ulList.addEventListener('click', e => {
  if (e.target.matches('li')){
    const showBook = getSingleBook(e.target.dataset.bookId)
    showBook.then(createBookShow)
  }
})

function getSingleBook(bookId){
  return fetch(baseURL+bookId)
  .then(resp => resp.json())
}

function createBookShow(bookObj){
  showPanel.innerHTML = ""
  const newDiv = document.createElement('div')
  newDiv.dataset.bookId = bookObj.id
  newDiv.innerHTML = `
    <img src="${bookObj.img_url}">
    <h2>${bookObj.title}</h2>
    <h4>${bookObj.author}</h4>
    <h5>${bookObj.subtitle}</h5>
    <p>${bookObj.description}</p>
  `
  const newUl = document.createElement('ul')
  for (const user of bookObj.users){
    const newLi = document.createElement('li')
    newLi.dataset.userId = user.id
    newLi.innerText = `${user.username}`
    newUl.append(newLi)
  }
  newDiv.append(newUl)
  const button = document.createElement('button')
  button.innerText = "LICK"
  newDiv.append(button)
  showPanel.append(newDiv)
}

showPanel.addEventListener('click', e => {
  if (e.target.matches('button')){
    lickBook(e.target.parentNode.dataset.bookId, e.target)
  }
})

function lickBook(bookId, button){
  
  const usersPromise = getSingleBook(bookId).then(result => {return result.users})
  usersPromise.then(usersArray => {
  let usersObj = usersArray
  let newObj = {"id":1, "username":"pouros"}
  if (button.innerText === "LICK"){
  usersObj.push(newObj) 
  } else {
    for (const user of usersObj){
      if (user.id == "1"){usersObj.splice(usersObj.indexOf(user), 1)} 
    }
  }
    const configObj = {
      method: "PATCH", 
      headers: {"Content-Type": "application/json", "Accepts": "application/json"}, 
      body: JSON.stringify({users: usersObj})
    }
    fetch(baseURL + bookId, configObj)
    .then(resp=>resp.json())
    .then(obj => {
      updateUsersAndLickButton(obj)
    })
    
  })

}

function updateUsersAndLickButton(bookObj){
  const listUl = document.querySelectorAll('ul')[1]
  const button = document.querySelector('button')
  const newLi = document.createElement('li')
  if (button.innerText === "LICK"){
    newLi.dataset.userId = bookObj.users.slice(-1)[0].id
    newLi.innerText = `${bookObj.users.slice(-1)[0].username}`
  listUl.append(newLi)
  button.innerText = "UNLICK"
  } else {
    const foundLi = Array.from(listUl.children).find(li => {return li.dataset.userId === "1" })
    foundLi.remove()
    button.innerText = "LICK"
  }
}

// function deleteUser(userId){
//   fetch(baseURL+userId, {
//     method: "DELETE"
//   }).then(resp=>resp.json())
// }


getBooks()