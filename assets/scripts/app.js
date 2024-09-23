const listElement = document.querySelector(".posts");
const postTemplate = document.getElementById("single-post");

const form=document.querySelector('#new-post form')
const fetchButton=document.querySelector('#available-posts button')
const postList=document.querySelector('ul')

function sendHttpRequest(method, url,data) {
  const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open(method, url);

    // xhr.addEventListener()
    xhr.responseType='json'
    xhr.onload = function () {
        if(xhr.status>=200&& xhr.status<300){
            resolve(xhr.response)
        }
        else{
            reject(new Error('Something Went Wrong'));
        }
     
    };
    xhr.onerror=function(){
        reject(new Error('Failed to Send Request!'))
        console.log(xhr.response)
        console.log(xhr.status)
    }
    xhr.send(JSON.stringify(data));
  });
  return promise
}

function fetchPosts(){
    sendHttpRequest('GET','https://jsonplaceholder.typicode.com/posts').then(responseData=>{
        const listOfPosts = responseData;
        console.log(listOfPosts);
        for (const post of listOfPosts) {
          const postEl = document.importNode(postTemplate.content, true);
          postEl.querySelector("h2").textContent = post.title.toUpperCase();
          postEl.querySelector("p").textContent = post.body;
          postEl.querySelector('li').id=post.id
  
          listElement.append(postEl);
        }
    }).catch(err=>{
        alert(err.message)
    })
}

async function createPost(title,content){
    const userId=Math.random().toString();
    const post={
        title:title,
        body:content,
        userId:userId
    }

    sendHttpRequest('POST','https://jsonplaceholder.typicode.com/posts',post)
}

createPost('Dummy','A Dummy Post')

fetchButton.addEventListener('click',fetchPosts);
form.addEventListener('submit',event=>{
    event.preventDefault();
    const enteredTitle=event.currentTarget.querySelector('#title').value
    const enteredContent=event.currentTarget.querySelector('#content').value

    createPost(enteredTitle,enteredContent)
})

postList.addEventListener('click',event=>{
    if(event.target.tagName==='BUTTON'){
        const postId=event.target.closest('li').id;
        console.log(postId)
        sendHttpRequest('DELETE',`https://jsonplaceholder.typicode.com/posts/${postId}`)
    }
})