// Lấy các phần tử DOM
const userNameSignUpElement = document.getElementById('username');
const emailSignUpElement = document.getElementById('email-signup');
const passwordSignUpElement = document.getElementById('pswd-signup');
const signUpBtnElement = document.getElementById('sign-up-btn');
const emailLoginElement = document.getElementById('email-login');
const passwordLoginElement = document.getElementById('pswd-login');
const logInBtnElement = document.getElementById('log-in-btn');


// Định nghĩa URL API
const signUpApi = `http://localhost:3000/auth/register`;
const logInApi = `http://localhost:3000/auth/login`;

// Lưu access token và user ID vào local storage
function saveTokenToLocalStorage(access_token, userId) {
    localStorage.setItem("access-token", access_token);
    localStorage.setItem("user_id", userId);
}

// Gửi yêu cầu đăng ký
const register = async () => {
    const responseAPI = await fetch(signUpApi, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify({
            "name": userNameSignUpElement.value,
            "email": emailSignUpElement.value,
            "password": passwordSignUpElement.value,
        }),
    });

    const result = await responseAPI.json();
    return result;
};

// Gửi yêu cầu đăng nhập
const logIn = async () => {
    const responseAPI = await fetch(logInApi, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow",
        // referrerPolicy: "no-referrer",
        body: JSON.stringify({
            "email": emailLoginElement.value,
            "password": passwordLoginElement.value,
        }),
    });

    const result = await responseAPI.json();
    return result;
};

////////////////////////////////////////////////


// Đăng ký
const signUp = async () => {
    const result = await register();
    if (result.code === 400) {
        await alert(`Error: ${result.message} Vui lòng nhập lại!!`);
    } else {
        saveTokenToLocalStorage(result.tokens.access.token, result.user.id);
        window.location.assign("../../index.html");
        alert('Đăng ký thành công!!!!!!!');
    }
}

// Đăng nhập
const signIn = async () => {
    const result = await logIn();
    if (result.code === 400 || result.code === 401) {
        await alert(`Error: ${result.message} Vui lòng nhập lại!!`);
    } else {
        saveTokenToLocalStorage(result.tokens.access.token, result.user.id);
        window.location.assign("../../index.html");
        alert('Đăng nhập thành công!!!!!!!');
    }
}

// Xử lý sự kiện click đăng ký
signUpBtnElement.addEventListener("click", (event) => {
    event.preventDefault();
    signUp();
});

// Xử lý sự kiện click đăng nhập
logInBtnElement.addEventListener("click", (event) => {
    event.preventDefault();
    signIn();
});

