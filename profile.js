getUser()
getPosts()
function getcurrentuserID(){
    const urlParam= new URLSearchParams(window.location.search)
const id=urlParam.get("userid")
return id
}
function getUser(){
    const id=getcurrentuserID()
    axios.get(`https://tarmeezacademy.com/api/v1/users/${id}`)
.then((respone)=> {
    const user=respone.data.data
    document.getElementById("email").innerHTML=user.email
    document.getElementById("name").innerHTML=user.name
    document.getElementById("username").innerHTML=user.username
    document.getElementById("comments_count").innerHTML=user.comments_count
    document.getElementById("post_count").innerHTML=user.posts_count
    document.getElementById("header-image").src=user.profile_image
    document.getElementById("name-posts").innerHTML=`${user.name}'s`
})

}


function getPosts(){
    const id=getcurrentuserID()
    axios.get(`https://tarmeezacademy.com/api/v1/users/${id}/posts`)
    .then((respone)=> {
        const posts = respone.data.data
        document.getElementById("user-posts").innerHTML=""

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
                        <img src="${post.author.profile_image}" class="rounded-circle border border-1" alt="" style="width: 40px; height: 40px;">
                        <b>${post.author.username}</b>
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
            document.getElementById("user-posts").innerHTML +=content
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