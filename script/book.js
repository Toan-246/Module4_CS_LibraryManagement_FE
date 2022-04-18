let currentUser = sessionStorage.getItem('currentUser');
currentUser = JSON.parse(currentUser);// ep chuoi ve doi tuong
let pageNumber = 0;
let totalPage = 1;
let hasNext;
let hasPrevious;


let API_BOOKS = "http://localhost:8080/api/books";
let API_CATEGORIES = "http://localhost:8080/api/categories";

function changeApiSource(source) {
    apiSource = source;
}
function getCurrentPage() {

    $.ajax({
        type: 'GET',
        url: apiSource + `/page/${pageNumber}`,
        success: function (page) {

            let books = page.content
            let content = '';
            for (let i = 0; i < books.length; i++) {
                content += ` <tr>
            <td>${i + 1 + page.pageable.pageNumber * page.pageable.pageSize}</td>
            <td>${books[i].name}</td>
            <td>${books[i].quantity}</td>
            <td><img src="http://localhost:8080/image/${books[i].image}" style="height: 150px"></td>
            <td>${books[i].description}</td>
            <td>${books[i].publisher}</td>
            <td>${books[i].status}</td>
            <td>${books[i].category == null ? '' : books[i].category.name}</td>
            <td><button class="btn btn-primary"data-toggle="modal"
                                        data-target="#input-book" onclick="showEditForm(${books[i].id})"><i class="fa fa-edit"></i></button></td>
            
        </tr>`
            }
            $('#book-table').html(content);
            totalPage = page.totalPages;
            $('#total-page').html(totalPage)

            hasPrevious = !page.first
            hasNext = !page.last
            let currentPageNumber = pageNumber + 1
            let nextPageNumber = currentPageNumber + 1
            let previousPageNumber = currentPageNumber - 1



            let content1 = '';
            content1 += `<ul class="pagination justify-content-end">
             <li class="page-item">
               <a class="page-link"onclick="previousPage()" aria-label="Previous">
                 <span aria-hidden="true">&laquo;</span>
               </a>
             </li>
             ${hasPrevious ? '<li class="page-item" ><a class="page-link" onclick="previousPage()"><span id="previous-page"></span></a></li>' : ''}  
             <li class="page-item" ><a class="page-link" onclick="getCurrentPage()"><b><span id="current-page"></span></b></a></li>     
             ${hasNext ? '<li class="page-item" ><a class="page-link" onclick="nextPage()"><span id="next-page"></span></a></li>' : '' }
             <li class="page-item">
               <a class="page-link" onclick="nextPage()" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </a>
             </li>
          </ul>`
            $('#paging').html(content1);
            $('#current-page').html(currentPageNumber);
            $('#previous-page').html(previousPageNumber);
            $('#next-page').html(nextPageNumber);
        }
    })
}

function searchBookByName() {
    let q = $('#q').val()
    $.ajax({
        type: 'GET',
        url: apiSource + `/page/${pageNumber}`+ `?q=${q}`,
        success: function (page) {

            console.log(hasPrevious, hasNext);
            let books = page.content
            let content = '';
            for (let i = 0; i < books.length; i++) {
                content += ` <tr>
            <td>${i + 1 + page.pageable.pageNumber * page.pageable.pageSize}</td>
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

            hasPrevious = !page.first
            hasNext = !page.last
            let currentPageNumber = pageNumber + 1
            let nextPageNumber = currentPageNumber + 1
            let previousPageNumber = currentPageNumber - 1



            let content1 = '';
            content1 += `<ul class="pagination justify-content-end">
             <li class="page-item">
               <a class="page-link"onclick="previousPage()" aria-label="Previous">
                 <span aria-hidden="true">&laquo;</span>
               </a>
             </li>
             ${hasPrevious ? '<li class="page-item" ><a class="page-link" onclick="previousPage()"><span id="previous-page"></span></a></li>' : ''}  
             <li class="page-item" ><a class="page-link" onclick="getCurrentPage()"><b><span id="current-page"></span></b></a></li>     
             ${hasNext ? '<li class="page-item" ><a class="page-link" onclick="nextPage()"><span id="next-page"></span></a></li>' : '' }
             <li class="page-item">
               <a class="page-link" onclick="nextPage()" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </a>
             </li>
          </ul>`
            $('#paging').html(content1);
            $('#current-page').html(currentPageNumber);
            $('#previous-page').html(previousPageNumber);
            $('#next-page').html(nextPageNumber);
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
    $('#image-holder').html('')
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
            getAllPublisher();
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
            getAllPublisher();
            getCurrentPage();
            showSuccessMessage('Xóa thành công');
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
            $('#image-holder').html(`<img src="http://localhost:8080/image/${book.image}" alt="" id="image-holder" height="150px">`)
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
    if (image == undefined) image = new File([""], "empty-file");
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
            getAllPublisher();
            getCurrentPage();
            showSuccessMessage('Cập nhật thành công');
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
                    <div class="image ml-2 mr-2">
                    <img src="http://localhost:8080/image/${currentUser.image}" height="30px" class="img-circle elevation-2" alt="">
                    </div>
                    <p><span> | </span><a href="#" onclick="doLogout()">  Đăng xuất  </a></p>
                    <p><span> | </span><a href="/Module4_CS_LibraryManagement_FE/pages/personal-info.html"> Thông tin tài khoản  </a></p>\
                          `
    } else {   // guest
        content += "<a href='/Module4_CS_LibraryManagement_FE/pages/login.html'></a>"
    }

    $("#login-details-librarian").html(content);
}

function getAllCategories() {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/api/categories',
        success: function (categories) {
            let content = '';
            for (let i = 0; i < categories.length; i++) {
                content += `<li class="nav-item">
                                        <a href="#" class="nav-link" onclick="getCurrentPageByCategory(${categories[i].id})">
                                            <i class="far fa-dot-circle nav-icon"></i>
                                            ${categories[i].name}
                                        </a>
                             </li>`
            }
            $('#categories-list-content').html(content);
        }
    })
}
function getCurrentPageByCategory(id) {
    let newApiSource = API_CATEGORIES + `/${id}`;
    changeApiSource(newApiSource);
    pageNumber = 0;
    getCurrentPage();
}

function getCurrentPageAllBook() {
    let newApiSource = API_BOOKS;
    changeApiSource(newApiSource);
    pageNumber = 0;
    getCurrentPage();
}

function getAllPublisher() {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/api/books',
        success: function (publisheres) {
            let content = '';
            for (let i = 0; i < publisheres.length; i++) {
                content += `<li class="nav-item">
                                        <a href="#" class="nav-link" onclick="getCurrentPageByPublisher('${publisheres[i]}')">
                                            <i class="far fa-dot-circle nav-icon"></i>
                                            ${publisheres[i]}
                                        </a>
                            </li>`
            }
            $('#publisher-list-content').html(content);
        }
    })
}
function getCurrentPageByPublisher(publisher) {
    let newApiSource = API_BOOKS + `/${publisher}`;
    changeApiSource(newApiSource);
    pageNumber = 0;
    getCurrentPage();
}

function doLogout() {
    sessionStorage.removeItem("currentUser");
    location.href = '/Module4_CS_LibraryManagement_FE/pages/login.html';
}
function homePage(){
    changeApiSource(API_BOOKS);
    getCurrentPage();
}
$(document).ready(function () {
    if (currentUser!=null){
        changeApiSource(API_BOOKS);
        getCurrentPage();
        drawLoginDetailsForAdmin();
        getAllCategories();
        getAllPublisher();

    }
    else {
        location.href = "/Module4_CS_LibraryManagement_FE/pages/login.html"
    }
})