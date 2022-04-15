$(document).ready(function () {
    if (currentUser == null){
        location.href = '/Module4_CS_LibraryManagement_FE/pages/login.html';
    }
    $("#button-change-password").click(function (){
        doChangePassword();
    });
})

function doChangePassword(){
    let password = $("#input-password").val();
    let newPassword = $("#input-newPassword").val();
    let confirmNewPassword = $("#input-confirmNewPassword").val();
    let changePasswordForm = {
        password: password,
        newPassword: newPassword,
        confirmNewPassword: confirmNewPassword
    }

    $.ajax({
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": currentUser.token
        },
        type: "POST",
        url: USERS_WEBSERVICE_CHANGE_PASSWORD,
        data: JSON.stringify(changePasswordForm),
        success: function (currentUser){
            alert("Đổi mật khẩu thành công! \nQuay lại trang đăng nhập")
            location.href = '/Module4_CS_LibraryManagement_FE/pages/login.html';
        },
        error: function (errorMessage){
            alert(errorMessage.responseJSON.message);
        }
    })
}