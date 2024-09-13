let currentPage=1
let lastPage=1
//INFINITE SCROLL
    window.addEventListener("scroll", function(){
        const endOfPage = window.innerHeight + window.pageYOffset >= document.body.scrollHeight;
        if(endOfPage && currentPage<lastPage){
            currentPage++
            getPosts(false,currentPage)
        }
    });
// Close INfinite

setupUI()
getPosts()
function getPosts(reload=true,page = 1){
    toggleLoader(true)
axios.get(`https://tarmeezacademy.com/api/v1/posts?limit=2&page=${page}`)
.then((respone)=> {
    toggleLoader(false)
    const posts = respone.data.data
    lastPage=respone.data.meta.last_page
    if(reload){
        document.getElementById("posts").innerHTML=""
    } 
    for(let post of posts){
        let posttitle=""
        if(post.title !=null){
            posttitle=post.title
        }

        let user = getcurrentuser()
        let isMyPost = user != null && post.author.id==user.id
        let editbuttonContent=``
        if(isMyPost){
            editbuttonContent=
            `
                <button class="btn btn-danger" style="float:right; margin-left:5px;" onclick="deletePostBtn('${encodeURIComponent(JSON.stringify(post))}')"> Delete </button>
                <button class="btn btn-secondary" style="float:right;" onclick="editPostBtn('${encodeURIComponent(JSON.stringify(post))}')"> Edit </button>
            `
        }
        let content= `
        <div class="card shadow my-4">
                <div class="card-header">
                <span onclick="userclicked(${post.author.id})" style="cursor:pointer;">
                    <img src="${post.author.profile_image}" class="rounded-circle border border-1" alt="" style="width: 40px; height: 40px;">
                    <b>${post.author.username}</b>
                </span>
                    ${editbuttonContent}
                </div>
                <div class="card-body" onclick="postClicked(${post.id})">
                    <img class="w-100" style="height: 300px;" src="${post.image}" alt="">
                    <h6 style="color: gray;">${post.created_at}</h6>
                    <h5>${posttitle}</h5>
                    <p>
                        ${post.body}
                    </p> 
                    <hr>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                            <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                        </svg>
                        <span>
                            ${post.comments_count} comments
                            <span id="post-tags-${post.id}">
                            </span>
                        </span>

                    </div>
                </div>
            </div>
        
        `
        document.getElementById("posts").innerHTML +=content
        const postTagsId=`post-tags-${post.id}`
        document.getElementById(postTagsId).innerHTML=""
        for(let tag of post.tags){
            let tagcontent=`
                <button class="btn btn-sm rounded-5" style="background-color:grey; color:white; ">
                    ${tag.name}
                </button>
            `
            document.getElementById(postTagsId).innerHTML +=tagcontent
        }
    }
})
}
function loginbtnclicked(){
    let username=document.getElementById("username-input").value
    let password = document.getElementById("password-input").value
    const params={
        "username":username,
        "password": password
    }
    axios.post("https://tarmeezacademy.com/api/v1/login",params)
    .then((response)=> {
        localStorage.setItem("token",response.data.token)
        localStorage.setItem("user",JSON.stringify(response.data.user))

        //اخفاء modal on bootstrap
        let modal=document.getElementById("login-modal")
        let modalInstance=bootstrap.Modal.getInstance(modal)
        modalInstance.hide()

        showAlert("Logged in , success",'success')
        setupUI()
    })
}

function setupUI(){
    const token=localStorage.getItem("token")
    const loginBtn=document.getElementById("login-btn")
    const registerBtn=document.getElementById("register-btn")
    const logoutBtn=document.getElementById("logout-btn")
    const addpostBtn=document.getElementById("addBtn")
    const imgNav=document.getElementById("img-navbar-logged")
    const usernameNav=document.getElementById("nav-username")
    if(token== null){
        //user is guest 
        logoutBtn.style.display="none"
        loginBtn.style.display="block"
        registerBtn.style.display="block"
        if(addpostBtn !=null){
        addpostBtn.style.display="none"}
        imgNav.style.display="none"
        usernameNav.style.display="none"
    }else{
        loginBtn.style.display="none"
        registerBtn.style.display="none"
        logoutBtn.style.display="block"
        if(addpostBtn !=null){
        addpostBtn.style.display="block"}
        imgNav.style.display="block"
        usernameNav.style.display="block"
        const user= getcurrentuser()
        usernameNav.innerHTML=user.username
        imgNav.src= user.profile_image
    }
}


function logout(){
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    showAlert("logged out , success",'success')
    setupUI()
}

function getcurrentuser(){
    let user=null
    const storageUser=localStorage.getItem("user")
    if(storageUser != null){
    user = JSON.parse(storageUser)}
    return user
}


function showAlert(customMessage,type){
    const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
    const appendAlert = (message, type) => {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
        ].join('')
    
        alertPlaceholder.append(wrapper)
    }
    appendAlert(customMessage , type)

    /*setTimeout(()=>{
        const alert = bootstrap.Alert.getOrCreateInstance('#liveAlertPlaceholder')
        alert.close()
    },2000)*/
    
    }

function registerbtnclicked(){
    let name=document.getElementById("register-name-input").value
    let username=document.getElementById("register-username-input").value
    let password = document.getElementById("register-password-input").value
    let image = document.getElementById("register-image-input").files[0]
    let formData =new FormData()
    formData.append("username",username)
    formData.append("password",password)
    formData.append("name",name)
    formData.append("image",image)


const headers={
    "Content-Type":"multipart/form-data",
}
    axios.post("https://tarmeezacademy.com/api/v1/register",formData,{
        headers: headers})
    .then((response)=> {
        localStorage.setItem("token",response.data.token)
        localStorage.setItem("user",JSON.stringify(response.data.user))

        //اخفاء modal on bootstrap
        let modal=document.getElementById("register-modal")
        let modalInstance=bootstrap.Modal.getInstance(modal)
        modalInstance.hide()

        showAlert("New User Register , successfully",'success')
        setupUI()
    }).catch((error)=>{
        const message = error.response.data.message
        showAlert(message,'danger')
    })
}


function creatpostbtnclicked(){
    let postID=document.getElementById("id-edit-post-input").value
    let isCreate= postID==null || postID==""
    let title=document.getElementById("title-input").value
    let body=document.getElementById("body-input").value
    let image = document.getElementById("image-input").files[0] //la7ata 5ali user y5tar soura w7de bas
    let formData =new FormData()
    formData.append("body",body)
    formData.append("title",title)
    formData.append("image",image)

let url=``
const token= localStorage.getItem("token")
const headers={
    "Content-Type":"multipart/form-data",
    "authorization": `Bearer ${token} `
}

if(isCreate){
    url=`https://tarmeezacademy.com/api/v1/posts`
    axios.post(url,formData,{
        headers: headers //3am eb3at token ma3 request la n3ml post jdid
    })
        .then((response)=> {
            let modal=document.getElementById("creat-post-modal")
            let modalInstance=bootstrap.Modal.getInstance(modal)
            modalInstance.hide()
            showAlert("New Post Has Been Created","success")
            getPosts()
        }).catch((error)=>{
            const message = error.response.data.message
            showAlert(message,'danger')
        })
}else{
    formData.append("_method","put")
    url=`https://tarmeezacademy.com/api/v1/posts/${postID}`
    axios.post(url,formData,{
        headers: headers //3am eb3at token ma3 request la n3ml post jdid
    })
        .then((response)=> {
            let modal=document.getElementById("creat-post-modal")
            let modalInstance=bootstrap.Modal.getInstance(modal)
            modalInstance.hide()
            showAlert("Update Post Succefully","success")
            getPosts()
        }).catch((error)=>{
            const message = error.response.data.message
            showAlert(message,'danger')
        })
}



}


function postClicked(postID){
    window.location=`postDetails.html?postId=${postID}`
}


function editPostBtn(postObj){
    let post=JSON.parse(decodeURIComponent(postObj))
    document.getElementById("creat-or-edit-submit").innerHTML="Update Post"
    document.getElementById("id-edit-post-input").value=post.id
    document.getElementById("postMadalTitle").innerHTML="Edit Post"
    document.getElementById("title-input").value=post.title
    document.getElementById("body-input").value=post.body
    let postModal= new bootstrap.Modal(document.getElementById("creat-post-modal"),{})
    postModal.toggle()

}


function addBtnClicked(){
    document.getElementById("creat-or-edit-submit").innerHTML="Creatw Post"
    document.getElementById("id-edit-post-input").value=""
    document.getElementById("postMadalTitle").innerHTML="Creat A New Post"
    document.getElementById("title-input").value=""
    document.getElementById("body-input").value=""
    let postModal= new bootstrap.Modal(document.getElementById("creat-post-modal"),{})
    postModal.toggle()
}
function deletePostBtn(postObj){
    let post=JSON.parse(decodeURIComponent(postObj))
    document.getElementById("delete-post-id-value").value=post.id
    let postModal= new bootstrap.Modal(document.getElementById("delete-post-modal"),{})
    postModal.toggle()
}

function confirmpostDelete(){
    const postID=document.getElementById("delete-post-id-value").value
    const token= localStorage.getItem("token")
    const headers={
        "Content-Type":"multipart/form-data",
        "authorization": `Bearer ${token} `
    }

    axios.delete(`https://tarmeezacademy.com/api/v1/posts/${postID}`,{
        headers: headers
    })
    .then((response)=> {

        //اخفاء modal on bootstrap
        let modal=document.getElementById("delete-post-modal")
        let modalInstance=bootstrap.Modal.getInstance(modal)
        modalInstance.hide()

        showAlert("Delete Successfully",'success')
        getPosts()
    }).catch((error)=>{
        const message = error.response.data.message
        showAlert(message,'danger')
    })
}

function userclicked(userID){
    window.location=`profile.html?userid=${userID}`
}


function profilecliked(){
    const user=getcurrentuser()
    const userID=user.id
    window.location=`profile.html?userid=${userID}`
}

function toggleLoader(show=true){
    if(show){
        document.getElementById("loader").style.visibility='visible'
    }else{
        document.getElementById("loader").style.visibility='hidden'
    }
}