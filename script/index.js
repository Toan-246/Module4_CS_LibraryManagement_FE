let pageNumber = 0;
function getCurrentPage (){
    let currentPageNumber = pageNumber+1
    $('#current-page').html(currentPageNumber);
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/api/books/page/${pageNumber}`,
        success: function (page){
            let books = page.content
            let content = '';
            for (let i = 0; i < books.length; i++) {
                content +=`<li>
                   <div class="product">
                      <a href="#" class="info">
                         <span class="holder">
                           <img src="http://localhost:8080/image/${books[i].image}" alt="" />
                           <span class="book-name"${books[i].name}</span>
                           <span class="author">${books[i].publisher}</span>
                           <span class="description">${books[i].description}</span>
                        </span>
                     </a>
                      <a href="#" class="buy-btn">Mượn sách <span class="price">${books[i].quantity}</span></a>
                  </div>
               </li>`
            }
            $('#book-list-content').html(content);
            let totalPage = page.totalPages;
            $('#total-page').html(totalPage)
        }
    })
}
function getAllCategories(){
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/api/categories',
        success: function (categories){
            let content = '';
            for (let i = 0; i < categories.length; i++) {
                content += `<li><a href="#">${categories[i].name}</a></li>`
            }
            $('#categories-list-content').html(content);
        }
    })
}
function getAllPublisher(){
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/api/books',
        success: function (page){
            let books = page.content
            let content = '';
            for (let i = 0; i < books.length; i++) {
                content += `<li><a href="#">${books[i].publisher}</a></li>`
            }
            $('#publisher-list-content').html(content);
        }
    })
}
$(document).ready(function (){
    drawLoginDetails();

    getCurrentPage();
    getAllCategories();
    getAllPublisher();
})

function nextPage(){
    pageNumber++;
    getCurrentPage();
}

function previousPage(){
    pageNumber--;
    getCurrentPage();
}

function drawLoginDetails(){
    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    let content = "";
    if (currentUser != null){ // already logged in
        let username = currentUser.username;
        content += `<p>Xin chào, <a href="#" id="username-holder">${username}</a> | </p>
        <p><a href="#" class="cart" ><img src="css/images/cart-icon.png" alt="" /></a>Cart</p>
        <p><span> | </span><a href="#" onclick="doLogout()">  Đăng xuất  </a></p>
        <p><span> | </span><a href="/Module4_CS_LibraryManagement_FE/pages/change-password.html">  Đổi mật khẩu  </a></p>`

    } else {   // guest
        content += "<p>Ấn vào <a href='/Module4_CS_LibraryManagement_FE/pages/login.html'>đây</a> để đăng nhập</p>"
    }

    $("#login-details").html(content);
}

function doLogout(){
    sessionStorage.removeItem("currentUser");
    location.href = '/Module4_CS_LibraryManagement_FE/index.html';
}




