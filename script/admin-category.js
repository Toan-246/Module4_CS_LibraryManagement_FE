let currentUser = sessionStorage.getItem('currentUser');
currentUser = JSON.parse(currentUser);// ep chuoi ve doi tuong
function getAllCategory() {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/api/categories',
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (categories) {
            let content = '';
            for (let i = 0; i < categories.length; i++) {
                content += ` <tr>
            <td>${i + 1}</td>
            <td>${categories[i].name}</td>
            <td><button class="btn btn-primary"data-toggle="modal"
                                        data-target="#input-category" onclick="showEditForm(${categories[i].id})"><i class="fa fa-edit"></i></button></td>
            <td><button class="btn btn-danger" data-toggle="modal"
                                        data-target="#delete-category" onclick="showDeleteForm(${categories[i].id})"><i class="fa fa-trash"></i></button></td>
        </tr>`
            }
            $('#category-list-content').html(content);
        }
    })
}

function showCreateForm(id) {
    let tittle = 'Tạo mới danh mục';
    $('#tittle-category-create').html(tittle)
    let content = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Đóng</button>
                    <button type="button" class="btn btn-primary" onclick="createNewCategory()" aria-label="Close" class="close" data-dismiss="modal">Tạo mới</button>`;
    $('#footer-category-create').html(content)
    $('#name').val('')
}

function createNewCategory() {
    let name = $('#name').val();
    let category = {
        name: name
    }
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/api/categories',
        data: JSON.stringify(category),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function () {
            getAllCategory();
            showSuccessMessage('Tạo mới thành công');
        },
        error: function () {
            showErrorMessage("Tạo mới thất bại");
        }
    })
}

function showDeleteForm(id) {
    let content = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Đóng</button>
                    <button type="button" class="btn btn-danger" onclick="deleteCategory(${id})" aria-label="Close" class="close" data-dismiss="modal">Xóa</button>`;
    $('#footer-category-delete').html(content)
}

function deleteCategory(id) {
    $.ajax({
        type: 'DELETE',
        url: `http://localhost:8080/api/categories/${id}`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function () {
            getAllCategory()
            showSuccessMessage('Xóa thành công')
        },
        error: function () {
            showErrorMessage('Xóa thất bại')
        }
    })
}

function showEditForm(id) {
    let tittle = 'Chỉnh sửa thông tin danh mục';
    $('#tittle-category-create').html(tittle)
    let content = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Đóng</button>
                    <button type="button" class="btn btn-primary" onclick="editCategory(${id})" aria-label="Close" class="close" data-dismiss="modal">Cập nhật</button>`;
    $('#footer-category-create').html(content)
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/api/categories/${id}`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (category) {
            $('#name').val(category.name);
        }
    })
}

function editCategory(id) {
    let name = $('#name').val();
    let category = {
        name: name
    }
    $.ajax({
        type: 'PUT',
        url: `http://localhost:8080/api/categories/${id}`,
        data: JSON.stringify(category),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function () {
            getAllCategory()
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
                    <div class="image">
                    <img src="http://localhost:8080/image/${currentUser.image}" class="img-circle elevation-2" alt="">
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
    if (currentUser!=null){
        getAllCategory();
        drawLoginDetailsForAdmin();
    }
    else {
        location.href = '/Module4_CS_LibraryManagement_FE/pages/login.html';
    }
})