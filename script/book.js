let currentUser = sessionStorage.getItem('currentUser');
currentUser = JSON.parse(currentUser);// ep chuoi ve doi tuong
let pageNumber = 0;
let totalPage = 1;

function getCurrentPage() {
    let currentPageNumber = pageNumber + 1
    $('#current-page').html(currentPageNumber);
    $.ajax({
        type: 'GET',
        url:` http://localhost:8080/api/books/page/${pageNumber}`,
        success: function (page) {
            let books = page.content
            let content = '';
            for (let i = 0; i < books.length; i++) {
                content += ` <tr>
            <td>${i + 1}</td>
            <td>${books[i].name}</td>
            <td>${books[i].quantity}</td>
            <td><img src="http://localhost:8080/image/${books[i].image}" style="width: 150px"></td>
            <td>${books[i].description}</td>
            <td>${books[i].publisher}</td>
            <td>${books[i].status}</td>
            <td>${books[i].category == null ? '' : books[i].category.name}</td>
            <td><button class="btn btn-primary"data-toggle="modal"
                                        data-target="#input-book" onclick="showEditForm(${books[i].id})"><i class="fa fa-edit"></i></button></td>
            <td><button class="btn btn-danger" data-toggle="modal"
                                        data-target="#delete-book" onclick="showDeleteForm(${books[i].id})"><i class="fa fa-trash"></i></button></td>
        </tr>`
            }
            $('#book-table').html(content);
            totalPage = page.totalPages;
            $('#total-page').html(totalPage)
        }
    })
}

function showCreateForm(id) {
    let tittle = 'Tạo mới sách';
    $('#tittle-book-create').html(tittle)
    let content = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Đóng</button>
                    <button type="button" class="btn btn-primary" onclick="createNewBook()" aria-label="Close" class="close" data-dismiss="modal">Tạo mới</button>`;
    $('#footer-book-create').html(content)
    $('#name').val('')
    $('#quantity').val('')
    $('#description').val('')
    $('#publisher').val('')
    $('#image').val('')
    $('#status').val('')
    $('#category').val('')
    drawCategory();
    drawStatus();
}

function createNewBook() {
    let name = $('#name').val();
    let quantity = $('#quantity').val();
    let description = $('#description').val();
    let publisher = $('#publisher').val();
    let image = $('#image').prop('files')[0];
    let status = $('#status').val();
    let category = $('#category').val();
    let book = new FormData();
    book.append('name', name);
    book.append('quantity', quantity);
    book.append('description', description);
    book.append('publisher', publisher);
    book.append('status', status);
    book.append('category', category);
    book.append('image', image);
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/api/books',
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        data: book,
        enctype: 'multipart/form-data',
        processData:false,
        contentType: false,
        success: function () {
            getCurrentPage();
            showSuccessMessage('Tạo mới thành công');
        },
        error: function () {
            showErrorMessage("Tạo mới thất bại");
        }
    })
}

function showDeleteForm(id) {
    let content = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Đóng</button>
                    <button type="button" class="btn btn-danger" onclick="deleteBook(${id})" aria-label="Close" class="close" data-dismiss="modal">Xóa</button>`;
    $('#footer-book-delete').html(content)
}

function deleteBook(id) {
    $.ajax({
        type: 'DELETE',
        url: `http://localhost:8080/api/books/${id}`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function () {
            getCurrentPage()
            showSuccessMessage('Xóa thành công')
        },
        error: function () {
            showErrorMessage('Xóa thất bại')
        }
    })
}

function showEditForm(id) {
    let tittle = 'Chỉnh sửa  thông tin sách';
    $('#tittle-book-create').html(tittle)
    let content = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Đóng</button>
                    <button type="button" class="btn btn-primary" onclick="editBook(${id})" aria-label="Close" class="close" data-dismiss="modal">Cập nhật</button>`;
    $('#footer-book-create').html(content)
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/api/books/${id}`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (book) {
            drawCategory(book.category.id);
            drawStatus(book.status);
            $('#name').val(book.name);
            $('#quantity').val(book.quantity);
            $('#description').val(book.description);
            $('#publisher').val(book.publisher);
            $('#image').val('')
            $('#status').val(book.status);
            $('#category').val(book.category);
        }
    })
}

function editBook(id) {
    let name = $('#name').val();
    let quantity = $('#quantity').val();
    let description = $('#description').val();
    let publisher = $('#publisher').val();
    let image = $('#image').prop('files')[0];
    let status = $('#status').val();
    let category = $('#category').val();
    let book = new FormData();
    book.append('name', name);
    book.append('quantity', quantity);
    book.append('description', description);
    book.append('publisher', publisher);
    book.append('status', status);
    book.append('category', category);
    book.append('image', image);
    $.ajax({
        type: 'POST',
        url: `http://localhost:8080/api/books/${id}`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        data: book,
        enctype: 'multipart/form-data',
        processData:false,
        contentType: false,
        success: function () {
            getCurrentPage()
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
        url: 'http://localhost:8080/api/categories',
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
function drawStatus(selected_status) {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/api/books/status',
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (statuses) {
            let content = `<option selected disabled>Trạng thái sách</option>`
            for (let status of statuses) {
                content += `<option value="${status}"${selected_status != null && selected_status == status? 'selected' : ''}>${status}</option>`
                // content += `<option value="${category.id}">${category.name}</option>`
            }
            $('#status').html(content)
        }
    })
}
function nextPage() {
    if (pageNumber < totalPage - 1){
        pageNumber++;
        getCurrentPage();
    }

}

function previousPage() {
    if (pageNumber > 0){
        pageNumber--;
        getCurrentPage();
    }
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
function page(){
    let content = '';
    content += `<ul class="pagination justify-content-end">
            <li class="page-item">
                <a class="page-link" th:if="${products.hasPrevious()}"
                   th:href="@{'/products'(page=${products.number - 1}, q=${q})}">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
            <li class="page-item"><a class="page-link" th:if="${products.hasPrevious()}"
                                     th:href="@{'/products'(page=${products.number - 1}, q=${q})}"
                                     th:text="${products.number}"></a></li>
            <li class="page-item"><a class="page-link" th:href="@{'/products'(page=${products.number}, q=${q})}"
                                     th:text="${products.number + 1}"></a></li>
            <li class="page-item"><a class="page-link" th:if="${products.hasNext()}"
                                     th:href="@{'/products'(page=${products.number +1 }, q=${q})}"
                                     th:text="${products.number} + 2"></a></li>
            <li class="page-item">
                <a class="page-link" th:if="${products.hasNext()}"
                   th:href="@{'/products'(page=${products.number + 1}, q=${q})}">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        </ul>`
    $('#page').html(content);
}


function doLogout() {
    sessionStorage.removeItem("currentUser");
    location.href = '/Module4_CS_LibraryManagement_FE/pages/login.html';
}
$(document).ready(function () {
    if (currentUser!=null){
        getCurrentPage();
        drawLoginDetailsForAdmin();
        page();
    }
    else {
        location.href = '/Module4_CS_LibraryManagement_FE/pages/login.html';
    }
})