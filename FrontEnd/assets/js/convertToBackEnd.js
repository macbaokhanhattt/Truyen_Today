// variables and classes
const bodyElement = document.querySelector('body');
const postsContainer = document.getElementById("posts-container");
const addPostModal = document.getElementById("add-post-modal");
const showAddPostModal = document.getElementById("show-add-post-modal-btn");
const closeAddPostModal = document.getElementById("close-modal-btn");
const addPostForm = document.getElementById("add-post-form");
const postDetailContainer = document.getElementById("post-detail");
const commentsContainer = document.getElementById("comments-container");
const addCommentForm = document.getElementById("add-comment-form");
const addPlsLoginModal =document.getElementById('add-pls-login-modal');
const logOutBtn = document.getElementById('logout');
const endPageElement = document.getElementById('end-page');
const endPageLoginBtn = document.getElementById('end-page-login');
const loginAlert = document.getElementById('login-alert');

///////////////////////////////////////////////////////////////////////////////////////////
const NewPostApi = `http://localhost:3000/post?sortBy=createdAt:desc&limit=5&page=`
const AddPostApi = `http://localhost:3000/post`
const checkAuthApi = `http://localhost:3000/auth/check-auth`
const getUserApi = `http://localhost:3000/users/`
///////////////////////////////////////////////////////////////////////////////////////////

// const posts = loadPostsFromLocalStorage();

class Post {
    // fix undefined for post.votes by setting the default value to 0
    constructor(id, title, content,category,comments, votes = 0) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.category = category;
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
const getUser = async (userId) => {
    const getUserByIdApi = getUserApi+userId;
    const responseApi = await fetch(getUserByIdApi,{
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
    });
    return await responseApi.json();
};

const checkAuthorize = async () => {
    const auth_token = await localStorage.getItem('access-token');
     const responseApi = await fetch(checkAuthApi, {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            'Authorization': "Bearer "+ auth_token,
            "Content-Type": "application/json",
        },
    });
     return responseApi.json();
}

const getNewsPost = async (page) => {
    const responseApi = await fetch(NewPostApi +page);
    return responseApi.json();

}

const AddPost = (data) => {
    fetch(AddPostApi, {
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
            "category": data.category,
            "content": data.content,
            "user_id": data.user_id,
            "username": data.username,
        },)
    })
}


///////////////////////////////////////////////////////////////////////////////

// we will wrap these event listeners in if statements because the elements won't be present on the post detail page and if we don't check for them the app would crash

logOutBtn.addEventListener("click", () => {
    localStorage.removeItem('access-token');
    window.location.href="/Truyen_Today/FrontEnd/sign-up-login-form/dist/index.html";
});

endPageLoginBtn.addEventListener("click", () => {
    window.location.href="/Truyen_Today/FrontEnd/sign-up-login-form/dist/index.html";
});

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


async function showModal() {

    const result = await checkAuthorize();
    if (result.code === 401) {
        alert('Có vẻ như bạn chưa đăng nhập \nVui lòng đăng nhập để có thể sử dụng chức năng này');
        window.location.href = "/Truyen_Today/FrontEnd/sign-up-login-form/dist/index.html";
    } else {
        addPostModal.style.display = "flex";
        // prevent the posts page from scrolling when scrolling inside the posts modal
        document.body.style.overflow = "hidden";
    }
}

function closeModal() {
    addPostModal.style.display = "none";
    document.body.style.overflow = "";
}

const renderPostsByPage = async (pageNumber) => {
    // Xóa các thẻ con trong postsContainer trước khi hiển thị bài đăng mới
    postsContainer.innerHTML = '';

    // Gọi API hoặc thực hiện truy vấn dữ liệu để lấy các bài đăng của trang pageNumber
    const data = await getNewsPost(pageNumber);

    // Kiểm tra nếu không có bài đăng nào được tìm thấy
    if (data.results.length === 0) {
        postsContainer.innerHTML = `
      <div class="no-posts">
        <p>Chưa có bài đăng nào!</p>
      </div>
    `;
        return;
    }

    // Hiển thị các bài đăng của trang pageNumber
    data.results.forEach((post) => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');

        postElement.innerHTML = `<div class="post-votes">
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
                   <p>Thể loại: ${post.category}</p>
                   <p>Người đăng: ${post.username}</p>
                </div>`;

        postsContainer.appendChild(postElement);
    });
};


const renderPosts = async (pageNumber) => {
    let page ;
    if (!pageNumber){
        page =1;
    } else {
        page = pageNumber
    };
    const data = await getNewsPost(String(page));

    let post = data.results;

    if (post.length === 0) {
        postsContainer.innerHTML = `
      <div class="no-posts">
        <p>Chưa có truyện nào được đăng tải!!</p>
      </div>
    `;
    } else {
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
                   <p>Thể loại: ${post.category}</p>
                   <p>Người đăng: ${post.username}</p>
                </div>
                `;
            postsContainer.appendChild(postElement);
        });
    }

    for (let i = 0; i < data.totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.classList.add('page-button');
        pageButton.textContent = i + 1;
        pageButton.id = `page-button-${i + 1}`;
        endPageElement.appendChild(pageButton);


        // Lấy đối tượng button theo ID
        const button = document.querySelector(`#page-button-${i + 1}`);
        let post;
        // Thêm sự kiện "click" cho button
        button.addEventListener('click', async function() {
            // Xử lý sự kiện khi button được nhấp vào
            // console.log(`Button ${i + 1} clicked!`);
            renderPostsByPage(i+1);
        });
    }


    const checkAuth = await checkAuthorize();
    if (checkAuth.code === 401) {
        logOutBtn.style.visibility = 'hidden';
    }else {
        endPageLoginBtn.style.visibility = 'hidden';
        loginAlert.style.visibility= 'hidden';
    }
}



//Thêm Bài đăng
if (addPostForm) {
    addPostForm.addEventListener("submit", createPost);
}

async function createPost(event) {
    // we are going to use preventDefault to prevent the default behaviour of a form which is to submit the data to a URL and reload the page, instead we want to execute custom JavaScript code without causing the page to reload
    event.preventDefault();

    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    const category = document.getElementById('category').value;

    if (title && content) {
        const post = new Post(Date.now(), title, content, category);
        // add the post to the beginning of the posts array
        // renderPosts(posts);///////////////////////////////////////////////////
        document.getElementById("title").value = "";
        document.getElementById("content").value = "";
        document.getElementById('category').value = "";
        const accessToken = localStorage.getItem('access-token');
        const result = await checkAuthorize();

        if (result.code === 401) {
            alert('Hết thời gian\nVui lòng đăng nhập lại để có thể sử dụng chức năng này');
            window.location.href = "/Truyen_Today/FrontEnd/sign-up-login-form/dist/index.html";
        }

        const findUser = await getUser(result.data.user_id) ;
        const username = await findUser.name;

        const data ={
            title: post.title,
            content: post.content,
            category: post.category,
            user_id: result.data.user_id,
            auth_token: "Bearer " + accessToken,
            username: username,
        }

        AddPost(data);
        closeModal();

        window.location.reload();

    }
}

const start = () => {
    renderPosts();
}

start();