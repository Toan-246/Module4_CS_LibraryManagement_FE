let currentUser = sessionStorage.getItem('currentUser');
currentUser = JSON.parse(currentUser);// ep chuoi ve doi tuong
let pageNumber = 0;
function getCurrentPage() {
    let currentPageNumber = pageNumber + 1
    $('#current-page').html(currentPageNumber);
    $.ajax({
        type: 'GET',
        url:` 'http://localhost:8080/api/books/page/${pageNumber}'`,
        success: function (page) {
            let books = page.content
            let content = '';
            for (let i = 0; i < books.length; i++) {
                content += ` <tr>
            <td>${i + 1}</td>
            <td>${books[i].name}</td>
            <td>${books[i].quantity}</td>
            <td><img src="http://localhost:8080/image/${books[i].image}"></td>
            <td>${books[i].description}</td>
            <td>${books[i].publisher}</td>
            <td>${books[i].status}</td>
            <td>${books[i].category == null ? '' : books[i].category.name}</td>
            <td><button class="btn btn-primary"data-toggle="modal"
                                        data-target="#input-product" onclick="showEditForm(${books[i].id})"><i class="fa fa-edit"></i></button></td>
            <td><button class="btn btn-danger" data-toggle="modal"
                                        data-target="#delete-product" onclick="showDeleteForm(${books[i].id})"><i class="fa fa-trash"></i></button></td>
        </tr>`
            }
            $('#book-table').html(content);
        }
    })
}

function showCreateForm(id) {
    let tittle = 'Tạo mới sản phẩm';
    $('#create-product-tittle').html(tittle)
    let content = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Đóng</button>
                    <button type="button" class="btn btn-primary" onclick="createNewProduc()" aria-label="Close" class="close" data-dismiss="modal">Tạo mới</button>`;
    $('#footer-create').html(content)
    $('#name').val('')
    $('#price').val('')
    $('#description').val('')
    $('#image').val('')
    $('#category').val('')
    drawCategory()
}

function createNewProduc() {
    let name = $('#name').val();
    let price = $('#price').val();
    let description = $('#description').val();
    let image = $('#image').prop('files')[0];
    let category = $('#category').val();
    let product = new FormData();
    product.append('name', name);
    product.append('price', price);
    product.append('description', description);
    product.append('category', category);
    product.append('image', image);
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/products',
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        data: product,
        enctype: 'multipart/form-data',
        processData:false,
        contentType: false,
        success: function () {
            getAllBook();
            showSuccessMessage('Tao moi thanh cong');
        },
        error: function () {
            showErrorMessage("Tao moi that bai");
        }
    })
}

function showDeleteForm(id) {
    let content = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Đóng</button>
                    <button type="button" class="btn btn-danger" onclick="deleteProduct(${id})" aria-label="Close" class="close" data-dismiss="modal">Xóa</button>`;
    $('#footer-delete').html(content)
}

function deleteProduct(id) {
    $.ajax({
        type: 'DELETE',
        url: `http://localhost:8080/products/${id}`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function () {
            getAllBook()
            showSuccessMessage('Xoa thanh cong')
        },
        error: function () {
            showErrorMessage('Xoa that bai')
        }
    })
}

function showEditForm(id) {
    let tittle = 'Chỉnh sửa  thông thin sản phẩm';
    $('#create-product-tittle').html(tittle)
    let content = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Đóng</button>
                    <button type="button" class="btn btn-primary" onclick="editProduct(${id})" aria-label="Close" class="close" data-dismiss="modal">Cập nhật</button>`;
    $('#footer-create').html(content)
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/products/${id}`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (product) {
            drawCategory(product.category.id);
            $('#name').val(product.name);
            $('#price').val(product.price);
            $('#description').val(product.description);
            $('#image').val('')
            $('#category').val(product.category);

        }
    })
}

function editProduct(id) {
    let name = $('#name').val();
    let price = $('#price').val();
    let description = $('#description').val();
    let image = $('#image');
    let category = $('#category').val();
    let product = new FormData();
    product.append('name', name);
    product.append('price', price);
    product.append('description', description);
    product.append('category', category);
    product.append('image', image.prop('files')[0]);
    $.ajax({
        type: 'POST',
        url: `http://localhost:8080/products/${id}`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        data: product,
        enctype: 'multipart/form-data',
        processData:false,
        contentType: false,
        success: function () {
            getAllBook()
            showSuccessMessage('Cập nhật thành công')
        },
        error: function () {
            showErrorMessage('Cập nhật thất bại')
        }
    })
}

function drawCategory(selected_id) {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/categories',
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (categories) {
            let content = `<option selected disabled>Chọn danh mục sản phẩm</option>`
            for (let category of categories) {
                content += `<option value="${category.id}" ${selected_id != null && selected_id == category.id ? 'selected' : ''}>${category.name}</option>`
                // content += `<option value="${category.id}">${category.name}</option>`
            }
            $('#category').html(content)
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
                    <p><span> | </span><a href="/Module4_CS_LibraryManagement_FE/pages/change-password.html">  Đổi mật khẩu  </a></p>\
                          `
    } else {   // guest
        content += "<a href='/Module4_CS_LibraryManagement_FE/pages/login.html'></a>"
    }

    $("#login-details-librarian").html(content);
}
function doLogout() {
    sessionStorage.removeItem("currentUser");
    location.href = '/Module4_CS_LibraryManagement_FE/pages/login.html';
}
$(document).ready(function () {
    getAllBook();
    drawLoginDetailsForAdmin()
})