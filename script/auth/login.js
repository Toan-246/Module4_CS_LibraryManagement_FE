$(document).ready(function () {
    $("#button-login").click(function () {
        doLogin();
    });
})

function doLogin() {
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
        success: function (currentUser) {
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
            switch (currentUser.roles[0].authority) {
                case "ROLE_ADMIN": {
                    location.href = '/Module4_CS_LibraryManagement_FE/pages/admin-category.html';
                    break;
                }
                case "ROLE_LIBRARIAN": {
                    location.href = '/Module4_CS_LibraryManagement_FE/pages/librarian-book.html';
                    break;
                }
                case "ROLE_CUSTOMER":
                default: {
                    location.href = '/Module4_CS_LibraryManagement_FE/index.html';
                    break;
                }
            }
        },
        error: function (errorMessage) {
            alert(errorMessage.responseJSON.message);
        }
    })
}