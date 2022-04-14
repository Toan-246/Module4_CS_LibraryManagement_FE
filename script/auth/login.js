$(document).ready(function () {
    $("#button-login").click(function (){
        doLogin();
    });
})

function doLogin(){
    let username = $("#input-username").val();
    let password = $("#input-password").val();
    let user = {
        username: username,
        password: password
    }

    $.ajax({
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        type: "POST",
        url: USERS_WEBSERVICE_LOGIN,
        data: JSON.stringify(user),
        success: function (currentUser){
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
            location.href = '/Module4_CS_LibraryManagement_FE/index.html';
        },
        error: function (errorMessage){
            alert(errorMessage.message);
        }
    })
}