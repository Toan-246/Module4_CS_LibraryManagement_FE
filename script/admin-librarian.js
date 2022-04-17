let currentUser = sessionStorage.getItem('currentUser');
currentUser = JSON.parse(currentUser);// ep chuoi ve doi tuong

let pageNumber = 0;
let totalPage = 1;


function showAllLibrarian() {
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/api/manage_user/librarians?page=${pageNumber}`,
        headers: {
            "Authoriration": currentUser.token
        },
        success: function (page) {
            let librarians = page.content;
            let content = "";
            for (let i = 0; i < librarians.length; i++) {
                content += `
                <tr>
                    <td>${i + 1 + page.pageable.pageNumber * page.pageable.pageSize}</td>
                    <td>${librarians[i].username}</td>
                    <td><img src="http://localhost:8080/image/${librarians[i].image}" style="height: 150px"></td>
                    <td>${librarians[i].email}</td>
                    <td>${librarians[i].phone}</td>
                    <td>${librarians[i].address}</td>
                    <td>${librarians[i].active ? "Đang hoạt động" : "Đã khóa"}</td>
                    <td><button class="btn btn-primary"data-toggle="modal"
                                        data-target="#modal_edit-user" onclick="showEditForm(${librarians[i].id})"><i class="fa fa-edit"></i></button></td>
                </tr>`;

            }
            $("#librarian-list-content").html(content);
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
            $('#modal__input-active').html(`
                <option value="true" ${user.active ? 'selected' : ''}>Đang hoạt động</option>
                <option value="false" ${!user.active ? 'selected' : ''}>Đã khóa</option>
            `);

            let content = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Đóng</button>
                    <button type="button" class="btn btn-primary" onclick="editUser(${id})" aria-label="Close" class="close" data-dismiss="modal">Cập nhật</button>`;
            $('#modal_footer__edit-user').html(content)
        }
    })
}

function editUser(id) {
    let email = $("#modal__input-email").val();
    let phone = $("#modal__input-phone").val();
    let address = $("#modal__input-address").val();
    let occupation = $("#modal__input-occupation").val();
    let active = $("#modal__input-active").val();

    let userInfoForm = new FormData();
    userInfoForm.append("email", email);
    userInfoForm.append("phone", phone);
    userInfoForm.append("address", address);
    userInfoForm.append("occupation", occupation);
    userInfoForm.append("active", active);

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
            showAllLibrarian()
            showSuccessMessage('Cập nhật thành công')
        },
        error: function () {
            showErrorMessage('Cập nhật thất bại')
        }
    })


}

$(document).ready(function () {
    if (currentUser == null)
        location.href = "/Module4_CS_LibraryManagement_FE/pages/login.html"
    showAllLibrarian();
})