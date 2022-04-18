function drawUserInfo() {
    let userId = currentUser.id;
    $.ajax({
        type: 'GET',
        url: USERS_WEBSERVICE_GET_INFO + `/${userId}`,
        headers: {
            "Authorization": currentUser.token
        },
        success: function (user) {
            let username = user.username;
            let email = user.email != null ? user.email : "-";
            let phone = user.phone != null ? user.phone : "-";
            let address = user.address != null ? user.address : "-";
            let occupation = user.email != null ? user.occupation : "-";
            let role = user.role.name;

            $("#td__username-holder").html(username);
            $("#td__email-holder").html(email);
            $("#td__phone-holder").html(phone);
            $("#td__address-holder").html(address);
            $("#td__occupation-holder").html(occupation);
            $("#td__role-holder").html(role);
            $("#td__image-holder").html(`<img src="${IMAGE_FOLDER + user.image}" alt="-" height="200px">`);

            $("#input__username").val(username);
            $("#input__email").val(email);
            $("#input__phone").val(phone);
            $("#input__address").val(address);
            $("#input__occupation").val(occupation);
            $("#image__image-holder").prop("src", IMAGE_FOLDER + user.image);

            switch(role){
                case "ROLE_ADMIN": {
                    $("#a__back").prop("href", "/Module4_CS_LibraryManagement_FE/pages/admin-category.html");
                    break;
                }
                case "ROLE_LIBRARIAN": {
                    $("#a__back").prop("href", "/Module4_CS_LibraryManagement_FE/pages/librarian-book.html");
                    break;
                }
                case "ROLE_CUSTOMER":
                default: {
                    $("#a__back").prop("href", "/Module4_CS_LibraryManagement_FE/index.html");
                    break;
                }
            }
        }
    });
}

function showEditUserInfoModal(){
    let userId = currentUser.id;
    $.ajax({
        type: 'GET',
        url: USERS_WEBSERVICE_GET_INFO + `/${userId}`,
        headers: {
            "Authorization": currentUser.token
        },
        success: function (user) {
            let username = user.username;
            let email = user.email;
            let phone = user.phone;
            let address = user.address;
            let occupation = user.email;

            $("#input__username").val(username);
            $("#input__email").val(email);
            $("#input__phone").val(phone);
            $("#input__address").val(address);
            $("#input__occupation").val(occupation);
            $("#image__image-holder").val(null);
        }
    });
}

function saveUserInfo() {
    let userId = currentUser.id;
    let username = $("#input__username").val();
    let email = $("#input__email").val();
    let phone = $("#input__phone").val();
    let address = $("#input__address").val();
    let occupation = $("#input__occupation").val();
    let image = $("#input__image").prop('files')[0];
    if (image == undefined) image = new File([""], "empty-file");

    let userInfoForm = new FormData();
    userInfoForm.append("id", userId);
    userInfoForm.append("username", username);
    userInfoForm.append("email", email);
    userInfoForm.append("phone", phone);
    userInfoForm.append("address", address);
    userInfoForm.append("occupation", occupation);
    userInfoForm.append("image", image);
    userInfoForm.append("active", true);

    $.ajax({
        type: 'POST',
        url: `http://localhost:8080/api/users/${userId}`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        data: userInfoForm,
        enctype: 'multipart/form-data',
        processData:false,
        contentType: false,
        success: function () {
            displaySuccessToast('Cập nhật thành công');
            drawUserInfo();
        },
        error: function (error) {
            displayFailureToast(error.responseJSON.message);
        }
    })

}

$(document).ready(function () {
    if (currentUser == null)
        location.href = '/Module4_CS_LibraryManagement_FE/index.html';
    drawUserInfo();
});