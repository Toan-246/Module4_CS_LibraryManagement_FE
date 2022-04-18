let pageNumber = 0;
let totalPage = 1;
let hasNext;
let hasPrevious;

function saveReturnTicket(borrowTicketId) {

    $.ajax({
        type: 'POST',
        url: `http://localhost:8080/api/returnTickets/save-return-for-borrow/${borrowTicketId}`,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function () {
            alert('tao thanh cong');
            getTicketOfCurrentUser();
        }

    })
}

function getAllReturnTicketNotReviewed() {
    $.ajax({
        url: `http://localhost:8080/api/returnTickets/notReviewed/page/${pageNumber}`,
        type: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (page) {
            let returnTickets = page.content
            totalPage = page.totalPages;
            // let returnTickets = page.content
            let content = '';
            for (let i = 0; i < returnTickets.length; i++) {
                content += `<tr>
        <td>${i + 1 + page.pageable.pageNumber * page.pageable.pageSize}</td>
        <td>${returnTickets[i].borrowTicket.customer.username}</td>
        <td>${returnTickets[i].borrowTicket.borrowDate}</td>
        <td>${returnTickets[i].borrowTicket.duration}</td>
        <td>${returnTickets[i].status}</td>
        <td>${returnTickets[i].isReviewed ? "Đã duyệt" : "Chưa duyệt"}</td>
        <td>${returnTickets[i].isAccepted ? "Đã thuê" : "-"}</td>
        <td><button class="btn btn-primary" data-bs-target="#modal__review-return-ticket" data-bs-toggle="modal"  type="button" onclick="showModalReturnTicket(${returnTickets[i].id})">Duyệt</td>
    </tr>`
            }
            $('#table-body__return-ticket').html(content);

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
function nextPage() {
    if (pageNumber < totalPage - 1){
        pageNumber++;
        getAllReturnTicketNotReviewed();
    }
    // pageNumber++;
    // getAllReturnTicketNotReviewed();

}

function previousPage() {
    if (pageNumber > 0){
        pageNumber--;
        getAllReturnTicketNotReviewed();
    }
}
function showModalReturnTicket(returnTicketId) {
    $.ajax({
        url: `http://localhost:8080/api/returnTickets/${returnTicketId}`,
        type: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (returnTicket) {
            let content = `
        <ul>
            <li>Tên người dùng : ${returnTicket.borrowTicket.customer.username}</li>
            <li>Ngày mượn : ${returnTicket.borrowTicket.borrowDate}</li>
            <li>Thời hạn : ${returnTicket.borrowTicket.duration}</li>
            <li><ul id="list_book">Danh sach</ul></li>
        </ul>
        `
            $('#content_return_ticket').html(content);
            let footerContent = `
<button class="btn btn-danger" data-bs-dismiss="modal" type="button" onclick="denyReturnTicket(${returnTicketId})">Từ chối trả sách</button>
                    <button class="btn btn-success" data-bs-dismiss="modal" onclick="acceptReturnTicket(${returnTicketId})" type="button">Chấp nhận trả sách</button>`;

            $('#footer-show').html(footerContent);

            let borrowTicketId = returnTicket.borrowTicket.id;
            $.ajax({
                type: 'GET',
                url: `http://localhost:8080/api/borrowTickets/${borrowTicketId}/books`,
                headers: {
                    'Authorization': 'Bearer ' + currentUser.token
                },
                success: function (books) {
                    let contentDetails1 = 'Danh sách';
                    for (let i = 0; i < books.length; i++){
                        contentDetails1 += `<li>${books[i].name}</li>`;
                    }
                    $('#list_book').html(contentDetails1);
                }
            })
        }
    })
}

function acceptReturnTicket(returnTicketId) {
    $.ajax({
        url: `http://localhost:8080/api/returnTickets/${returnTicketId}/accept`,
        type: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function () {
            getAllReturnTicketNotReviewed();
            displaySuccessToast("Đã duyệt");
        },
        error: function () {
            displaySuccessToast("Lỗi duyệt");
        }
    })
}

function denyReturnTicket(returnTicketId) {
    $.ajax({
        url: `http://localhost:8080/api/returnTickets/${returnTicketId}/deny`,
        type: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function () {
            getAllReturnTicketNotReviewed();
            displaySuccessToast("Đã duyệt");
        },
        error: function () {
            displaySuccessToast("Lỗi duyệt");
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
                    <p><span> | </span><a href="/Module4_CS_LibraryManagement_FE/pages/personal-info.html"> Thông tin tài khoản  </a></p>\
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
    if (currentUser!=null){
        getAllReturnTicketNotReviewed();
        drawLoginDetailsForAdmin();
    }
    else {
        location.href = '/Module4_CS_LibraryManagement_FE/pages/login.html';
    }
})