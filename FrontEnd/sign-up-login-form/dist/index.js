const userNameSignUpElement   = document.getElementById('username');
const emailSignUpElement = document.getElementById('email-signup');
const passwordSignUpElement = document.getElementById('pswd-signup');
const signUpBtnElement = document.getElementById('sign-up-btn');
const emailLoginElement = document.getElementById('email-login');
const passwordLoginElement = document.getElementById('pswd-login');
const logInBtnElement = document.getElementById('log-in-btn');


////////////////////////////////////////////////////////////////////////////////////////////

const signUpApi =`https://truyen-today-api-be.onrender.com/auth/register`;
const logInApi =`https://truyen-today-api-be.onrender.com/auth/login`;

////////////////////////////////////////////////////////////////////////////////////////////
function saveTokenToLocalStorage(access_token ,userId) {
    localStorage.setItem("access-token", access_token);
    localStorage.setItem("user_id", userId);
}

///////////////////////////////////////////////////////////////////////////////////////////

const register = async () => {
    const responseAPI = await fetch(signUpApi ,{
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
        body: JSON.stringify( {
            "name": userNameSignUpElement.value,
            "email": emailSignUpElement.value,
            "password": passwordSignUpElement.value,
        },)
    });

    const  result  = await responseAPI.json();
    return result;

};

const logIn = async () => {
    const responseAPI = await fetch(logInApi ,{
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
        body: JSON.stringify( {
            "email": emailLoginElement.value,
            "password": passwordLoginElement.value,
        },)
    });

    const  result  = await responseAPI.json();
    return result;
};

///////////////////////////////////////////////////////////////////////////////////////////
const signUp = async () => {
    const result= await register();
    if (result.code === 400) {
        await alert(`Error: ${result.message} Vui lòng nhập lại!!`);
    }else {
        await saveTokenToLocalStorage(result.tokens.access.token, result.user.id);
        window.location.href = "../../index.html" ;
        alert('Đăng ký thành công!!!!!!!');
    }
}

const signIn = async () => {
    const result = await logIn();
    if (result.code === 400 || result.code === 401 ) {
        await alert(`Error: ${result.message} Vui lòng nhập lại!!`);
    }else {
        console.log('Deo on');
        await saveTokenToLocalStorage(result.tokens.access.token, result.user.id);
        window.location.href = "../../index.html";
        alert('Đăng nhập thành công!!!!!!!');
    }
}

////////////////////////////////////////////////////////////////////////////////////////////
//nhấn nút đăng ký
signUpBtnElement.addEventListener("click", signUp);
logInBtnElement.addEventListener("click", signIn);
