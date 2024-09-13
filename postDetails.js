setupUI()

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



const urlParam= new URLSearchParams(window.location.search)
const id=urlParam.get("postId")
getPost()
function getPost(){
    axios.get(`https://tarmeezacademy.com/api/v1/posts/${id}`)
    .then((respone)=> {
        const post = respone.data.data
        const comment = post.comments
        const auth =post.author
        document.getElementById("username-span").innerHTML = auth.username
        let posttitle=""
        if(post.title !=null){
            posttitle=post.title
        }
        let commentsContent=``
        for(let comments of comment){
            commentsContent+=`

            <div id="comments">
                        <div class="p-3" style="background-color: rgb(235, 235, 235);">
                            <!--PROFILE PICTURE+USERNAME-->
                                <div>
                                    <img src="${comments.author.profile_image}" class="rounded-circle " style="width: 40px; height: 40px;" alt="">
                                    <b>${comments.author.username}</b>
                                </div>
                            <!--Close PROFILE PICTURE+USERNAME -->
                            <!--Comments BODY-->
                                <div>
                                    ${comments.body}
                                </div>
                            <!--CLOSE COMMENTS BODY-->
                        </div>
            </div>
            
            `
        }
        const postContent=`
        <div class="card shadow my-4">
                    <div class="card-header">
                        <img src="${auth.profile_image}" class="rounded-circle border border-1" alt="" style="width: 40px; height: 40px;">
                        <b>@${auth.username}</b>
                    </div>
                    <div class="card-body">
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
                            <span>${post.comments_count} comments</span>
                        </div>
                    </div>
                    <div id="comments">
                        ${commentsContent}
                    </div>
                    <div class="input-group mb-3" id="add-comment-div">
                        <input id="comment-input" type="text" placeholder="add your comment here..." class="form-control">
                        <button class="btn btn-outline-primary" type="button" onclick="creatCommentClicked()">send</button>
                    </div>
                </div>
        
        `
        document.getElementById("post").innerHTML=postContent
    })
    
    }

function creatCommentClicked(){
    let commentBody=document.getElementById("comment-input").value
    let params={
        "body":commentBody
    }
    let token = localStorage.getItem("token")

    axios.post(`https://tarmeezacademy.com/api/v1/posts/${id}/comments`,params,{
        headers:{
            "authorization":`Bearer ${token}`
        }
    })
    .then((response)=>{
        getPost()
    }).catch((error)=>{
        const errorMessage=error.response.data.message
        showAlert(errorMessage,"danger")
    })
}




