// variables and classes
const postsContainer = document.getElementById("posts-container");
const updatePostModal = document.getElementById("add-post-modal");
const showAddPostModal = document.getElementById("show-add-post-modal-btn");
const closeUpdatePostModal = document.getElementById("close-modal-btn");
const updatePostForm = document.getElementById("add-post-form");
const postDetailContainer = document.getElementById("post-detail");
const commentsContainer = document.getElementById("comments-container");
const addCommentForm = document.getElementById("add-comment-form");
const deletePostBtn = document.getElementById("delete-post-btn");
const updatePostBtn = document.getElementById("update-post-btn");
const likePostBtn = document.getElementById("like-post-btn");
const unlikePostBtn = document.getElementById("unlike-post-btn");
const categoryBtn = document.getElementById('category-btn');
const category = document.getElementById('category');

///////////////////////////////////////////////////////////////////////////////////////////////

const PostApi = "http://localhost:3000/post/";
const AllPostApi = "http://localhost:3000/post";
const DeletePostApi = "http://localhost:3000/post/";
const UpdatePostApi = "http://localhost:3000/post/";
const GetCommentByPostIdApi ="http://localhost:3000/comment/";
const GetCommentByIdApi ="http://localhost:3000/comment/getcomment/";
const CreateCommentApi = "http://localhost:3000/comment/";
const UpdateCommentApi = "http://localhost:3000/comment/";
const DeleteCommentApi = "http://localhost:3000/comment/";
const getUserApi = `http://localhost:3000/users/`;
const checkAuthApi = `http://localhost:3000/auth/check-auth`;
const checkLikedApi = 'http://localhost:3000/post/checklike/';
const LikeApi = 'http://localhost:3000/post/like/';
const UnLikeApi = 'http://localhost:3000/post/unlike/';
const CreateLikeTracking = 'http://localhost:3000/post/createLikeTracking/';
const countCommentApi = `http://localhost:3000/comment/count/`;
const UpdatePostViewsApi = "http://localhost:3000/post/views-count/";

////////////////////////////////////////////////////////////////////////////////////////////////
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
const getPost = async (postId) => {
  const responseApi = await fetch(PostApi + postId);
  return responseApi.json();
};

const deletePost = async (postId, auth_token) => {
  const responseApi = await fetch(DeletePostApi + postId, {
    method: "DELETE",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      Authorization: "Bearer " + auth_token,
      "Content-Type": "application/json",
    },
  });
  return responseApi.json();
};

const updatePost = async (postId, data) => {
  const responseApi = await fetch(UpdatePostApi + postId, {
    method: "PUT",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      Authorization: "Bearer " + data.auth_token,
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify({
      subject: data.title,
      category: data.category,
      content: data.content,
      views_count: data.views_count,
    }),
  });
  return responseApi.json();
};

const updatePostViews = async (postId, data) => {
  const responseApi = await fetch(UpdatePostViewsApi + postId, {
    method: "PUT",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      Authorization: "Bearer " + data.auth_token,
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify({
      views_count: data.views_count,
      views: data.views,
    }),
  });
  return responseApi.json();
};

const createComment = async (postId, content, auth_token, user_id) => {
  const responseApi = await fetch(CreateCommentApi, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      Authorization: "Bearer " + auth_token,
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify({
      post_id: postId,
      content: content,
      user_id: user_id
    }),
  });
  return responseApi.json();
};

const getCommentById = async (commentId) => {
  const responseApi = await fetch(GetCommentByIdApi+commentId);
  return responseApi.json();
};

const deleteComment = async (commentId, auth_token) => {
  const responseApi = await fetch(DeleteCommentApi+commentId, {
    method: "DELETE",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      Authorization: "Bearer " + auth_token,
      "Content-Type": "application/json",
    },
  });
};

const updateComment = async (commentId, content, auth_token) => {
  await fetch(UpdateCommentApi+commentId, {
    method: "PUT",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      Authorization: "Bearer " + auth_token,
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify({
      content: content,
    }),
  })
}

const getCommentsByPostId = async (postId) => {
  const responseApi = await fetch(GetCommentByPostIdApi+postId);
  return responseApi.json();
};

const checkLike = async (postId) => {
  const auth_token = await localStorage.getItem('access-token');
  const responseApi = await fetch(checkLikedApi+postId, {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      Authorization: "Bearer " + auth_token,
      "Content-Type": "application/json",
    },
  })
  return responseApi.json();
}

const likePost = async (postId) => {
  const auth_token = await localStorage.getItem('access-token');
  const responseApi = await fetch(LikeApi+postId, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      Authorization: "Bearer " + auth_token,
      "Content-Type": "application/json",
    },
  })
  return responseApi;
};

const unLikePost = async (postId) => {
  const auth_token = await localStorage.getItem('access-token');
  const responseApi = await fetch(UnLikeApi+postId, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      Authorization: "Bearer " + auth_token,
      "Content-Type": "application/json",
    },
  })
  return responseApi;
};

const createLikeTracking = async (postId) => {
  const auth_token = await localStorage.getItem('access-token');
  return await fetch(CreateLikeTracking + postId, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      Authorization: "Bearer " + auth_token,
      "Content-Type": "application/json",
    },
  });
}

const countComment = async (postId) => {
  return await fetch(countCommentApi+postId, {
    method: "POST",
  });
}

///////////////////////////////////////////////////////////////////////////////////////////////

// now let's add functionality to be able to vote on posts
function postVote(id, type) {
  const post = posts.find((post) => post.id === id);
  post.votes += type === "upvote" ? 1 : -1;
  const votesElement = document.getElementById(`votes-${id}`);
  votesElement.innerText = post.votes;
  votesElement.className = setPostVoteColor(post.votes);
  savePostsToLocalStorage();
}

function setPostVoteColor(postVotes) {
  if (postVotes === 0) {
    return "";
  }

  return postVotes > 0 ? "positive" : "negative";
}

// now let's add the post-detail page

async function renderPostDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");
  const posts = await getPost(postId);
  console.log(posts);
  let views = {
    views_count:posts.views_count +1,
    views: posts.views_count+ 1,
  }

  await updatePostViews(postId, views);

  const checkAuth = await checkAuthorize();
  if (checkAuth.code === 401) {
    deletePostBtn.style.display = "none";
    updatePostBtn.style.display = "none";
    likePostBtn.style.display= "none";
  }else {
    const likeTracking = await createLikeTracking(postId);
  }


  const checkLiked = await checkLike(postId);
  if (checkLiked.isLike === 1) {
    likePostBtn.style.display= "none";
  }else{
    unlikePostBtn.style.display="none";
  }

  if (posts.user_id !== localStorage.getItem("user_id")) {
    deletePostBtn.style.visibility = "hidden";
    updatePostBtn.style.visibility = "hidden";
  }
  if (!posts || !postDetailContainer) {
    return;
  }

  postDetailContainer.innerHTML = `
    <div class="post">
      <div class="post-votes"></div>
      <div class="post-content">
        <h2>
          <a href="post.html?id=${posts.id}">
            ${posts.subject}
          </a>
        </h2>
        <p style="font-weight: bold">Người đăng: ${posts.username}</p>
        <p>${posts.content}</p>
      </div>
    </div>
  `;
  renderComments();
}

const handleDeletePost = async (event) => {
  event.preventDefault();
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");
  const accessTokens = localStorage.getItem("access-token");
  const confirmDeletePost = confirm('Bạn có chắc muốn xóa không ???');
  if (confirmDeletePost){
    console.log('Chill');
    deletePost(postId, accessTokens);
    window.location.assign("/Truyen_Today/FrontEnd/index.html");
  }

};

const handleUpdatePost = async (event) => {
  event.preventDefault();

  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");
  const accessTokens = localStorage.getItem("access-token");
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;
  const category = document.getElementById("category").innerHTML;
  const data = {
    title: title,
    content: content,
    category: category,
    auth_token: accessTokens,
  };
  await updatePost(postId, data);
  alert('Chỉnh sửa thành công');
  window.location.reload();
};

const handleLikePost = async (event) => {
  event.preventDefault();
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");
  await likePost(postId);
  likePostBtn.style.display = "none";
  unlikePostBtn.style.display = "block";
}

const handleUnLikePost = async (event) => {
  event.preventDefault();
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");
  await unLikePost(postId);
  unlikePostBtn.style.display = "none";
  likePostBtn.style.display = "block";

}

// now let's add commenting functionality

if (addCommentForm) {
  addCommentForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const checkAuth = await checkAuthorize();
    if (checkAuth.code === 401) {
      alert('Có vẻ như bạn chưa đăng nhập \nVui lòng đăng nhập để có thể sử dụng chức năng này');
      window.location.assign('/Truyen_Today/FrontEnd/sign-up-login-form/dist/index.html');
    }else {
      handleAddCommentFormSubmit()
    }

  })
}

if (deletePostBtn) {
  deletePostBtn.addEventListener("click", handleDeletePost);
}

if (updatePostBtn) {
  updatePostBtn.addEventListener("click", showUpdateForm);
}

if (updatePostForm) {
  updatePostForm.addEventListener("submit", handleUpdatePost);
}

if (closeUpdatePostModal) {
  closeUpdatePostModal.addEventListener("click", closeUpdatePost);
}

if (likePostBtn) {
  likePostBtn.addEventListener("click", handleLikePost)
}

if (unlikePostBtn) {
  unlikePostBtn.addEventListener("click", handleUnLikePost)
}

if (categoryBtn) {
  categoryBtn.addEventListener("mouseover", toggleDropdown);
}

/////////////////////////////Category////////////////////////////////////////
const genres = [
  'Tiểu thuyết',
  'Truyện ngắn',
  'Truyện dài',
  'Truyện tranh',
  'Kinh dị',
  'Phiêu lưu',
  'Hài hước',
  'Tình cảm',
  'Khoa học viễn tưởng',
  'Lịch sử',
  'Học đường',
  'Văn học cổ điển',
  'Văn học hiện đại',
  'Trinh thám',
  'Văn học nước ngoài',
  'Cổ tích',
  'Viễn tưởng',
  'Kịch',
  'Hành động',
  'Bí ẩn',
  'Tâm lý',
  'Công nghệ',
  'Lãng mạn',
  'Văn học Việt Nam',
  'Tự truyện',
  'Suy ngẫm',
  'Đời sống',
  'Huyền bí',
  'Tưởng tượng',
  'Tài liệu',
  'Thể thao',
  'Kinh tế',
  'Chính trị',
  'Tôn giáo',
  'Sức khỏe',
  'Manga',
  'Light Novel',
  'Đam mỹ',
  'Lịch sử hư cấu',
  'Du ký',
  'Xuyên không',
  'Harem',
  'Trọng sinh',
  'Ngôn tình',
  'Cổ điển Trung Quốc',
  'Ngôn tình sắc',
  'Điện ảnh',
  'Âm nhạc',
  'Thiếu nhi',
  'Kỳ ảo',
  'Ngôn tình hiện đại',
  'Khác'
];

function toggleDropdown() {
  const dropdownContent = document.getElementById('dropdown-content');
  dropdownContent.classList.toggle('show');
  genres.forEach(function(genre) {
    const option = document.createElement('a');
    option.href = '#';
    option.textContent = genre;
    dropdownContent.appendChild(option);
    option.addEventListener("click", () => {
      category.innerHTML= genre;
    })
  });
}





/////////////////////////////////////////////////////////////////
async function showUpdateForm(event) {
  event.preventDefault();

  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");
  const post = await getPost(postId);

  const title = (document.getElementById("title").value = post.subject);
  const content = (document.getElementById("content").value = post.content);
  const category = (document.getElementById("category").innerHTML = post.category);

  updatePostModal.style.display = "flex";
  // prevent the posts page from scrolling when scrolling inside the posts modal
  document.body.style.overflow = "hidden";

  window.addEventListener("click", (event) => {
    if (event.target === updatePostModal) {
      closeUpdatePost();
    }
  });
}

function closeUpdatePost() {
  updatePostModal.style.display = "none";
  document.body.style.overflow = "";
}


function handleAddCommentFormSubmit() {


  const commentTextarea = document.getElementById("comment");
  const commentContent = commentTextarea.value;

  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");
  const accessTokens = localStorage.getItem("access-token");
  const userId = localStorage.getItem("user_id");

  createComment(postId, commentContent, accessTokens, userId);

  commentTextarea.value = "";
  window.location.reload();
}


async function renderComments(depth = 0) {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");
  const comments = await getCommentsByPostId(postId);
  if (comments.length === 0 || !comments) {
    commentsContainer.innerHTML = "";
  } else {
    comments.forEach(async (comment) => {
      // create comment element
      const userData = await getUser(comment.user_id);
      const author = await userData.name;
      const commentElement = await createCommentElement(comment, depth, author);
      const UpdateBtn = commentElement.querySelector(".comment-manage#update-comment-button");
      const DeleteBtn = commentElement.querySelector(".comment-manage#delete-comment-button");
      const UserId = localStorage.getItem('user_id');

      if (comment.user_id !== UserId) {
        UpdateBtn.style.display = 'none';
        DeleteBtn.style.display = 'none';
      }

      commentsContainer.appendChild(commentElement);

      // display nested comments with an increased depth
      if (comment.childComments && comment.childComments.length > 0) {
        renderComments(comment.childComments, container, depth + 1);
      }
    });
  }
}


async function createCommentElement(comment, depth, author) {
  const commentElement = document.createElement("div");
  commentElement.className = "comment";
  commentElement.style.marginLeft = `${depth * 20}px`;
  commentElement.innerHTML = `
    <p class="comment-author">${author}</p>
    <p class="comment-content">${comment.content}</p>
    <button class="comment-manage" id="update-comment-button" data-comment-id="${comment.id}">
      Chỉnh sửa
    </button>
    <button class="comment-manage" id="delete-comment-button" data-comment-id="${comment.id}">
      Xóa
    </button>
  `;

  const UpdateBtn = commentElement.querySelector(".comment-manage#update-comment-button");
  UpdateBtn.addEventListener("click", handleUpdateComment);
  const DeleteBtn = commentElement.querySelector(".comment-manage#delete-comment-button");
  DeleteBtn.addEventListener("click", handleDeleteComment);

  return commentElement;
}

// now lets add functionality for comment replies!
async function handleUpdateComment(event) {
  event.preventDefault();
  const button = event.target;
  const commentId = button.getAttribute("data-comment-id");
  const dataComment = await getCommentById(commentId);

  const commentElement = button.closest(".comment");
  const commentForm = commentElement.querySelector(".update-comment-form");

  // if the commentForm is displayed change the button to a cancel button which will remove the comment form when clicked
  if (!commentForm) {
    button.innerHTML = `<i class="las la-times" style="pointer-events: none;"></i> Hủy chỉnh sửa`;
    //////////
    const commentForm = document.createElement("form");
    commentForm.className = "update-comment-form";
    commentForm.innerHTML = `
    <textarea class="update-comment-textarea" rows="4" required></textarea>
    <button type="submit">Chỉnh sửa</button>
  `;

    const commentTextarea = commentForm.querySelector(".update-comment-textarea");
    commentTextarea.value = dataComment.content;


    // set the data-parent-id attribute of the form to the parentCommentId
    commentForm.addEventListener("submit",  async (event) => {
      event.preventDefault();
      const form = event.target;
      const commentTextarea = form.querySelector(".update-comment-textarea");
      const commentContent = commentTextarea.value;
      const accessTokens = localStorage.getItem("access-token");
      const checkAuth = await checkAuthorize();

      if (checkAuth.code === 401) {
        alert('Có vẻ như bạn chưa đăng nhập \nVui lòng đăng nhập để có thể sử dụng chức năng này');
        window.location.assign('/Truyen_Today/FrontEnd/sign-up-login-form/dist/index.html');
      }else {
        // add the new comment with the parentCommentId and commentContent
        const confirmUpdateComment = confirm('Bạn có chắc muốn thay đổi bình luận này không????');
        if (confirmUpdateComment) {
          await updateComment(commentId, commentContent, accessTokens );
          window.location.reload();
        }


        // clear the textarea and hide the comment form
        commentTextarea.value = "";
        form.style.display = "none";
      }
    } );
    commentElement.appendChild(commentForm);
    commentForm.style.display = "flex";
    //////////
  } else {
    button.innerHTML = `Chỉnh sửa`;
    commentElement.removeChild(commentForm);
  }
}

async function handleDeleteComment(event) {
  event.preventDefault();
  const button = event.target;
  const commentId = button.getAttribute("data-comment-id");
  const confirmDeleteComment = confirm('Bạn có chắc muốn xóa bình luận này không???');
  const accessTokens = localStorage.getItem("access-token");

  if(confirmDeleteComment){
    await deleteComment(commentId, accessTokens);
    window.location.reload();
  }
}


// render the post detail and comments if a post is specified in the URL, otherwise, render all posts
  renderPostDetail();

