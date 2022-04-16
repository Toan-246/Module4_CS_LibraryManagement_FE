function drawUserInfo() {
    let userId = currentUser.id;
    $.ajax({
        type: 'GET',
        url: USERS_WEBSERVICE_GET_INFO + `/${userId}`,
        headers: {
            "Authorization": currentUser.token
        },
        success: function (user){
            let username = user.username;
            let email = user.email != null? user.email : "-";
            let phone = user.phone != null? user.phone : "-";
            let address = user.address != null? user.address : "-";
            let occupation = user.email != null? user.occupation : "-";
            let role = user.role.name;

            $("#td__username-holder").html(username);
            $("#td__email-holder").html(email);
            $("#td__phone-holder").html(phone);
            $("#td__address-holder").html(address);
            $("#td__occupation-holder").html(occupation);
            $("#td__role-holder").html(role);
            $("#td__image-holder").html(`<img src="${IMAGE_FOLDER + user.image}" alt="-" height="200px">`);
        }
    });
}

$(document).ready(function () {
    if (currentUser == null)
        location.href = '/Module4_CS_LibraryManagement_FE/index.html';
    drawUserInfo();
});