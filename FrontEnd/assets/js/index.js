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

///////////////////////////////////////////////////////////////////////////////////////////////

const PostApi = `https://truyen-today-api-be.onrender.com/post/`
const AllPostApi = `https://truyen-today-api-be.onrender.com/post`
const DeletePostApi = 'https://truyen-today-api-be.onrender.com/post/'
const UpdatePostApi = `https://truyen-today-api-be.onrender.com/post/`

////////////////////////////////////////////////////////////////////////////////////////////////
const getPost = async (postId) => {
  const responseApi = await fetch(PostApi+postId);
  return responseApi.json();
}

const deletePost = async (postId, auth_token) => {
  const responseApi = await fetch(DeletePostApi+postId, {
    method: "DELETE",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      'Authorization': "Bearer "+ auth_token,
      "Content-Type": "application/json",
    },
    })
  return responseApi.json();
}

const updatePost = async (postId, data) => {
  console.log(UpdatePostApi+postId);
  const responseApi = await fetch(UpdatePostApi+postId,{
    method: "PUT",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      'Authorization': "Bearer"+ data.auth_token,
      // "Content-Type": "application/json",s
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify( {
      "subject": data.title,
      "category": data.category,
      "content": data.content,
    },)
  });
  return responseApi.json();
}

///////////////////////////////////////////////////////////////////////////////////////////////

// now lets add functionality to be able to vote on posts
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

// now lets add the post-detail page

async function renderPostDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");
  const posts = await getPost(postId);

  if (posts.user_id !== localStorage.getItem("user_id")) {
    deletePostBtn.style.visibility = "hidden";
    updatePostBtn.style.visibility = "hidden";
  }
  if (!posts || !postDetailContainer) {
    return;
  }

  postDetailContainer.innerHTML = `
    <div class="post">
      <div class="post-votes">
      </div>
      <div class="post-content">
        <h2>
          <a href="post.html?id=${posts.id}">
            ${posts.subject}
          </a>
        </h2>
        <p style ="font-weight: bold">Người đăng: ${posts.username}</p>
        <p>${posts.content}</p>
      </div>
    </div>
  `;
}

const handleDeletePost = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");
  const accessTokens = localStorage.getItem("access-token");
  await deletePost(postId, accessTokens);
  window.location.href = "../../index.html";
};

const handleUpdatePost = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");
  const accessTokens = localStorage.getItem("access-token");
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;
  const category = document.getElementById('category').value;
  console.log(accessTokens);
  const data = {
    subject : title,
    content: content,
    category: category,
    auth_key: accessTokens
  }
  console.log(data);
  await updatePost(postId,data);
  // window.location.reload();
}

// now lets add commenting functionality
if (addCommentForm) {
  addCommentForm.addEventListener("submit", handleAddCommentFormSubmit);
}

if(deletePostBtn) {
  deletePostBtn.addEventListener("click",handleDeletePost);
}

if(updatePostBtn) {
  updatePostBtn.addEventListener("click",showUpddateForm);
}

if (updatePostForm) {
  updatePostForm.addEventListener("submit",handleUpdatePost);
}

if (closeUpdatePostModal) {
  closeUpdatePostModal.addEventListener("click", closeUpdatePost);
}


async function showUpddateForm(event) {
  event.preventDefault();

  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");
  const post = await getPost(postId);

  const title = document.getElementById("title").value = post.subject;
  const content = document.getElementById("content").value= post.content;
  const category = document.getElementById('category').value= post.category;

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


function handleAddCommentFormSubmit(event) {
  event.preventDefault();

  const commentTextarea = document.getElementById("comment");
  const commentContent = commentTextarea.value;

  // call the addComment function with a null parentCommentId for top-level comments
  addComment(null, commentContent);

  commentTextarea.value = "";
}

// we need to adjust some of these functions now to support nested comments
function addComment(postId,parentCommentId, replyContent) {
  // get the postId from the currently displayed post
  const post = getPost(postId);

  const newComment = new Comment(
    Date.now(),
    Number(parentCommentId),
    post.id,
    replyContent,
    "WebDevASMR" // hard coded, in a real app with users this would be dynamic
  );

  // add the comment to the post as a top-level comment or as a child comment if applicable
  if (!parentCommentId) {
    post.comments.push(newComment);
  } else {
    const parentComment = findCommentById(
      post.comments,
      Number(parentCommentId)
    );
    if (parentComment) {
      parentComment.childComments.push(newComment);
    }
  }

  savePostsToLocalStorage();
  renderComments(post.comments, commentsContainer);
}

// this is a recursive function to find a comment from its ID, if it is not found and the comment has childComments, the function will recall itself with those childComments. This continues until either the comment is found or there are no comments left.
function findCommentById(comments, id) {
  for (const comment of comments) {
    if (comment.id === id) {
      return comment;
    } else if (comment.childComments.length > 0) {
      const foundComment = findCommentById(comment.childComments, id);
      if (foundComment) {
        return foundComment;
      }
    }
  }
}

function renderComments(comments, container, depth = 0) {
  if (depth === 0) {
    container.innerHTML = "";
  }

  comments.forEach((comment) => {
    // create comment element
    const commentElement = createCommentElement(comment, depth);

    container.appendChild(commentElement);

    // display nested comments with an increased depth
    if (comment.childComments && comment.childComments.length > 0) {
      renderComments(comment.childComments, container, depth + 1);
    }
  });
}

function createCommentElement(comment, depth) {
  const commentElement = document.createElement("div");
  commentElement.className = "comment";
  commentElement.style.marginLeft = `${depth * 20}px`;
  commentElement.innerHTML = `
    <p class="comment-author">${comment.author}</p>
    <p class="comment-content">${comment.content}</p>
    <button class="comment-reply" data-comment-id="${comment.id}">
      <i class="las la-reply"></i> reply
    </button>
  `;

  const replyBtn = commentElement.querySelector(".comment-reply");
  replyBtn.addEventListener("click", handleCommentReply);

  return commentElement;
}

// now lets add functionality for comment replies!
function handleCommentReply(event) {
  const button = event.target;
  const commentId = button.getAttribute("data-comment-id");

  const commentElement = button.closest(".comment");
  const replyForm = commentElement.querySelector(".reply-form");

  // if the replyForm is displayed change the button to a cancel button which will remove the comment form when clicked
  if (!replyForm) {
    button.innerHTML = `<i class="las la-times"></i> cancel`;
    displayReplyForm(commentId, commentElement);
  } else {
    button.innerHTML = `<i class="las la-reply"></i> reply`;
    commentElement.removeChild(replyForm);
  }
}

function displayReplyForm(parentCommentId, commentElement) {
  const replyForm = document.createElement("form");
  replyForm.className = "reply-form";
  replyForm.innerHTML = `
    <textarea class="reply-textarea" rows="4" required></textarea>
    <button type="submit">Add reply</button>
  `;

  // set the data-parent-id attribute of the form to the parentCommentId
  replyForm.setAttribute("data-parent-id", parentCommentId);
  replyForm.addEventListener("submit", handleReplyFormSubmit);
  commentElement.appendChild(replyForm);
  replyForm.style.display = "flex";
}

function handleReplyFormSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const parentCommentId = form.getAttribute("data-parent-id");
  const replyTextarea = form.querySelector(".reply-textarea");
  const replyContent = replyTextarea.value;

  // add the new comment with the parentCommentId and replyContent
  addComment(parentCommentId, replyContent);

  // clear the textarea and hide the reply form
  replyTextarea.value = "";
  form.style.display = "none";
}

// render the post detail and comments if a post is specified in the URL, otherwise, render all posts
  renderPostDetail();

