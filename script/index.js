let pageNumber = 0;
let totalPage = 1;
let API_BOOKS = "http://localhost:8080/api/books";
let API_CATEGORIES = "http://localhost:8080/api/categories";

let apiSource;


function changeApiSource(source) {
    apiSource = source;
}

function getCurrentPage() {
    let currentPageNumber = pageNumber + 1
    $('#current-page').html(currentPageNumber);
    $.ajax({
        type: 'GET',
        url: apiSource + `/page/${pageNumber}`,
        success: function (page) {
            let books = page.content
            let content = '';
            for (let i = 0; i < books.length; i++) {
                content += `<li>
                   <div class="product">
                      <a href="#" class="info">
                         <span class="holder">
                           <img src="http://localhost:8080/image/${books[i].image}" alt="" />
                           <span>${books[i].name}</span>
                        </span>
                     </a>
                      <a class="buy-btn" onclick="addToCart(${books[i].id})">Mượn sách <span class="price">${books[i].quantity}</span></a>
                  </div>
               </li>`
            }
            $('#book-list-content').html(content);
            totalPage = page.totalPages;
            $('#total-page').html(totalPage)
        }
    })
}

function getHomePage(){
    changeApiSource(API_BOOKS);
    pageNumber = 0;
    getCurrentPage();
}

function getCurrentPageByCategory(id) {
    let newApiSource = API_CATEGORIES + `/${id}`;
    changeApiSource(newApiSource);
    pageNumber = 0;
    getCurrentPage();
}

function getCurrentPageByPublisher(publisher) {
    let newApiSource = API_BOOKS + `/${publisher}`;
    changeApiSource(newApiSource);
    pageNumber = 0;
    getCurrentPage();
}

function getAllCategories() {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/api/categories',
        success: function (categories) {
            let content = '';
            for (let i = 0; i < categories.length; i++) {
                content += `<li><a onclick="getCurrentPageByCategory(${categories[i].id})">${categories[i].name}</a></li>`
            }
            $('#categories-list-content').html(content);
        }
    })
}

function getAllPublisher() {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/api/books',
        success: function (publisheres) {
            let content = '';
            for (let i = 0; i < publisheres.length; i++) {
                content += `<li><a onclick="getCurrentPageByPublisher('${publisheres[i]}')">${publisheres[i]}</a></li>`
            }
            $('#publisher-list-content').html(content);
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

function drawLoginDetails() {
    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    let login_details_html = "";
    let navbar_ul_html = "";

    if (currentUser == null) {    // guest
        login_details_html += "<a href='/Module4_CS_LibraryManagement_FE/pages/login.html'><button><img src=\"css/images/login-icon.png\" alt=\"\" height='20px' />Đăng nhập</button></a>";
        navbar_ul_html += `<li><a onClick="getHomePage()">Trang chủ</a></li>`;

    } else {    // already logged in
        let username = currentUser.username;
        let image = IMAGE_FOLDER + currentUser.image;
        login_details_html += `<img src="${image}" alt="" width="30px" height="30px">
                            <div><a href="#" id="username-holder">${username}</a></div>
                             <div><a href="#" onclick="doLogout()">  Đăng xuất  </a></div>
                            
                               `;
        navbar_ul_html += `<li><a onClick="getHomePage()">Trang chủ</a></li>
                            <li><a href="/Module4_CS_LibraryManagement_FE/pages/personal-info.html">Thông tin tài khoản</a></li>
                            <li><a href="/Module4_CS_LibraryManagement_FE/pages/customer-borrow-ticket.html">Quản lý mượn / trả sách</a></li>
                            <li><a href="/Module4_CS_LibraryManagement_FE/pages/cart.html"><img src="css/images/cart-icon.png" alt="" /> Giỏ sách</a></li>
                            `;
    }

    $("#login-details").html(login_details_html);
    $("#navbar-ul").html(navbar_ul_html);




}

function doLogout() {
    sessionStorage.removeItem("currentUser");
    location.href = '/Module4_CS_LibraryManagement_FE/index.html';
}

function homePage() {
    changeApiSource(API_BOOKS);
    getCurrentPage();
}

function searchBookByName() {
    let q = $('#q').val()
    let currentPageNumber = pageNumber + 1
    $('#current-page').html(currentPageNumber);
    $.ajax({
        type: 'GET',
        url: apiSource + `/page/${pageNumber}`+ `?q=${q}`,
        success: function (page) {
            let books = page.content
            let content = '';
            for (let i = 0; i < books.length; i++) {
                content += `<li>
                   <div class="product">
                      <a href="#" class="info">
                         <span class="holder">
                           <img src="http://localhost:8080/image/${books[i].image}" alt="" />
                           <span>${books[i].name}</span>
                        </span>
                     </a>
                      <a class="buy-btn" onclick="addToCart(${books[i].id})">Mượn sách <span class="price">${books[i].quantity}</span></a>
                  </div>
               </li>`
            }
            $('#book-list-content').html(content);
            totalPage = page.totalPages;
            $('#total-page').html(totalPage)
        }
    })
}



$(document).ready(function () {
    drawLoginDetails();
    changeApiSource(API_BOOKS);
    getCurrentPage();
    getAllCategories();
    getAllPublisher();
})




