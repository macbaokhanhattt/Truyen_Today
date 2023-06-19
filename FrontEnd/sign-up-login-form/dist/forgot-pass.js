const sendCodeBtn = document.getElementById('send-code-btn');
const forgotPassEmailInput =document.getElementById('email-forgot-pass-input');
const confirmCodeForm =document.getElementById('confirm-code-form');
const sendCodeForm =document.getElementById('send-code-form');
const confirmCodeBtn =document.getElementById('confirm-code-btn');


//////////////////////////////////////////////////////////////////////////////

const forgotPassApi = `http://localhost:3000/auth/forgot-password`;


///////////////////////////////////////////////////////////////////////////////

const forgotPass = async () => {
    const responseApi = await fetch(forgotPassApi, {
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
                "email": forgotPassEmailInput.value,
            })
        }
    )
    return responseApi;
};

//////////////////////////////////////////////////////////////////////////////////
const handleForgotPass = async () => {
    const result = await forgotPass();
    if (result.code === 400 || result.code === 401) {
        await alert(`Error: ${result.message} Vui lòng nhập lại!!`);
    }

}

////////////////////////////////////////////////////////////////////////////
sendCodeBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    sendCodeBtn.disabled = true; // Vô hiệu hóa nút để ngăn chặn việc nhấn lại
    sendCodeForm.style.display = 'none';
    confirmCodeForm.style.display = 'flex';
    await handleForgotPass();
    sendCodeBtn.disabled = false; // Kích hoạt lại nút sau khi xử lý hoàn tất
});

confirmCodeBtn.addEventListener("click", (event) => {
    event.preventDefault();
    window.location.href = "index.html";
})



