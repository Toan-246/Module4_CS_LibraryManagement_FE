let currentUser = sessionStorage.getItem('currentUser');
currentUser = JSON.parse(currentUser);// ep chuoi ve doi tuong

let pageNumber = 0;
let totalPage = 1;


function showAllCustomer() {
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/api/manage_user/customers?page=${pageNumber}`,
        headers: {
            "Authoriration": currentUser.token
        },
        success: function (page) {
            let customers = page.content;
            let content = "";
            for (let i = 0; i < customers.length; i++) {
                content += `
                <tr>
                    <td>${i + 1 + page.pageable.pageNumber * page.pageable.pageSize}</td>
                    <td>${customers[i].username}</td>
                    <td><img src="http://localhost:8080/image/${customers[i].image}" style="height: 150px"></td>
                    <td>${customers[i].email}</td>
                    <td>${customers[i].phone}</td>
                    <td>${customers[i].address}</td>
                    <td>${customers[i].active ? "Đang hoạt động" : "Đã khóa"}</td>
                    <td><button class="btn btn-primary"data-toggle="modal"
                                        data-target="#modal_edit-customer" onclick="showEditForm(${customers[i].id})"><i class="fa fa-edit"></i></button></td>
                </tr>`;

            }
            $("#customer-list-content").html(content);
        }
    });
}

function showEditForm(id) {
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/api/users/${id}`,
        headers: {
            'Authorization': currentUser.token
        },
        success: function (user) {
            $('#modal__input-username').val(user.username);
            $('#modal__input-email').val(user.email);
            $('#modal__input-phone').val(user.phone);
            $('#modal__input-address').val(user.address);
            $('#modal__input-occupation').val(user.occupation);
            $('#modal__input-role').html(`
                <option value="1" ${user.role.id == 1 ? 'selected' : ''}>Admin</option>
                <option value="2" ${user.role.id == 2 ? 'selected' : ''}>Thủ thư</option>
                <option value="3" ${user.role.id == 3 ? 'selected' : ''}>Người dùng</option>
            `);
            $('#modal__input-active').html(`
                <option value="true" ${user.active ? 'selected' : ''}>Đang hoạt động</option>
                <option value="false" ${!user.active ? 'selected' : ''}>Đã khóa</option>
            `);

            let content = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Đóng</button>
                    <button type="button" class="btn btn-primary" onclick="editUser(${id})" aria-label="Close" class="close" data-dismiss="modal">Cập nhật</button>`;
            $('#modal_footer__edit-customer').html(content)
        }
    })
}

function editUser(id) {
    let email = $("#modal__input-email").val();
    let phone = $("#modal__input-phone").val();
    let address = $("#modal__input-address").val();
    let occupation = $("#modal__input-occupation").val();
    let active = $("#modal__input-active").val();
    let role = $("#modal__input-role").val();

    let userInfoForm = new FormData();
    userInfoForm.append("email", email);
    userInfoForm.append("phone", phone);
    userInfoForm.append("address", address);
    userInfoForm.append("occupation", occupation);
    userInfoForm.append("active", active);
    userInfoForm.append("role", role);

    $.ajax({
        type: 'POST',
        url: `http://localhost:8080/api/users/${id}`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        data: userInfoForm,
        enctype: 'multipart/form-data',
        processData:false,
        contentType: false,
        success: function () {
            showAllCustomer()
            showSuccessMessage('Cập nhật thành công')
        },
        error: function () {
            showErrorMessage('Cập nhật thất bại')
        }
    })
}
function drawLoginDetailsForAdmin() {
    let content = "";
    if (currentUser != null) { // already logged in
        // let username = currentUser.username;
        content += `<div class="info"><a href="#" id="username-holder">${currentUser.username}</a></div>
                    <div class="image ml-2 mr-2">
                    <img src="http://localhost:8080/image/${currentUser.image}" height="30px" class="img-circle elevation-2" alt="">
                    </div>
                    <p><span> | </span><a href="#" onclick="doLogout()">  Đăng xuất  </a></p>
                    <p><span> | </span><a href='/Module4_CS_LibraryManagement_FE/pages/personal-info.html'> Thông tin tài khoản  </a></p>\
                          `
    } else {   // guest
        content += "<a href='/Module4_CS_LibraryManagement_FE/pages/login.html'></a>"
    }

    $("#login-details-admin").html(content);
}
function doLogout() {
    sessionStorage.removeItem("currentUser");
    location.href = '/Module4_CS_LibraryManagement_FE/pages/login.html';
}


$(document).ready(function () {
    if (currentUser == null)
        location.href = "/Module4_CS_LibraryManagement_FE/pages/login.html"
    showAllCustomer();
    drawLoginDetailsForAdmin();
})