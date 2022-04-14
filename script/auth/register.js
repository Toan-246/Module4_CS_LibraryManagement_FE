$(document).ready(function () {
    $("#button-register").click(function () {
        doRegister();
    });
})


function doRegister() {
    let username = $("#input-username").val();
    let password = $("#input-password").val();
    let confirmPassword = $("#input-confirmPassword").val();

    /*
        VALIDATE HERE
     */

    let registerForm = {
        username: username,
        password: password,
        confirmPassword: confirmPassword
    }

    $.ajax({
        url: USERS_WEBSERVICE_REGISTER,
        type: 'POST',
        data: JSON.stringify(registerForm),
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        success: function (data) {
            alert("Đăng ký thành công, điều hướng đến trang đăng nhập.");
            location.href = '/Module4_CS_LibraryManagement_FE/pages/login.html';
        },
        error: function (errorMessage){
            alert(errorMessage.responseJSON.message);
        }
    });

}