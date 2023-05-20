// variables and classes
const postsContainer = document.getElementById("posts-container");
const addPostModal = document.getElementById("add-post-modal");
const showAddPostModal = document.getElementById("show-add-post-modal-btn");
const closeAddPostModal = document.getElementById("close-modal-btn");
const addPostForm = document.getElementById("add-post-form");
const postDetailContainer = document.getElementById("post-detail");
const commentsContainer = document.getElementById("comments-container");
const addCommentForm = document.getElementById("add-comment-form");

///////////////////////////////////////////////////////////////////////////////////////////
const AllPostApi = `http://localhost:3000/post`
const AddPostApi = `http://localhost:3000/post`

///////////////////////////////////////////////////////////////////////////////////////////

// const posts = loadPostsFromLocalStorage();

class Post {
    // fix undefined for post.votes by setting the default value to 0
    constructor(id, title, content, comments, votes = 0) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.comments = comments || [];
        this.votes = votes;
    }
}

class Comment {
    constructor(id, parentId, postId, content, author) {
        this.id = id;
        this.parentId = parentId || null;
        this.postId = postId;
        this.content = content;
        this.author = author;
        // forgot to add childComments array!
        this.childComments = [];
    }
}

///////////////////////////////////////////////////////////////////////////////
const getAllPost = (callback) => {
    fetch(AllPostApi)
        .then((response) => {
            return response.json()
        })
        .then(callback);
}

const AddPost = (callback, data) => {
    fetch(AllPostApi, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            'Authorization': data.auth_token,
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify( {
            "subject": data.title,
            "category": "default",
            "content": data.content,
            "user_id": data.user_id,
        },)
    })
}


///////////////////////////////////////////////////////////////////////////////

// we will wrap these event listeners in if statements because the elements won't be present on the post detail page and if we don't check for them the app would crash
if (showAddPostModal) {
    showAddPostModal.addEventListener("click", showModal);

    // close the add post modal if the user clicks outside of it
    window.addEventListener("click", (event) => {
        if (event.target === addPostModal) {
            closeModal();
        }
    });
}

if (closeAddPostModal) {
    closeAddPostModal.addEventListener("click", closeModal);
}



function showModal() {
    addPostModal.style.display = "flex";
    // prevent the posts page from scrolling when scrolling inside the posts modal
    document.body.style.overflow = "hidden";
}

function closeModal() {
    addPostModal.style.display = "none";
    document.body.style.overflow = "";
}

const renderPosts = (data) => {
    const post = data.results;
    console.log(post);
    if (post.length === 0) {
        postsContainer.innerHTML = `
      <div class="no-posts">
        <p>Chưa có truyện nào được đăng tải!!</p>
      </div>
    `;
    }
    else {
        post.forEach((post) => {
            const postElement = document.createElement("div");
            postElement.classList.add("post");

            postElement.innerHTML = `
        <div class="post-votes">
          <button ">
          </button>
          <span >
          </span>
          <button >
          👍
          </button>
        </div>
        <div class="post-content">
          <h2>
            <a href="post.html?id=${post.id}">
              ${post.subject}
            </a>
          </h2>
          <p>${post.content}</p>
        </div>
      `;
            postsContainer.appendChild(postElement);
        });
    }
}



//Thêm Bài đăng
if (addPostForm) {
    addPostForm.addEventListener("submit", addPost);
}

function addPost(event) {
    // we are going to use preventDefault to prevent the default behaviour of a form which is to submit the data to a URL and reload the page, instead we want to execute custom JavaScript code without causing the page to reload
    event.preventDefault();

    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    if (title && content) {
        const post = new Post(Date.now(), title, content);
        // add the post to the beginning of the posts array
        // renderPosts(posts);///////////////////////////////////////////////////
        document.getElementById("title").value = "";
        document.getElementById("content").value = "";

        const data ={
            title: post.title,
            content: post.content,
            user_id: '64688614135295300806a84f',
            auth_token: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NDY4ODYxNDEzNTI5NTMwMDgwNmE4NGYiLCJpYXQiOjE2ODQ1NzY2MjMsImV4cCI6MTY4NDU3ODQyMywidHlwZSI6ImFjY2VzcyJ9.N6SDaDNlsXPW4iO8AF9W2YXMn68aFjkInSf808zkT6I'
        }

        AddPost( renderPosts, data);
        closeModal();
        window.location.reload();

    }
}

const start = () => {
    getAllPost(renderPosts);
}

start();