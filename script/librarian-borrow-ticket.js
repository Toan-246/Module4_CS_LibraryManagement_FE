let pageNumber = 0;
let totalPage = 1;
let hasNext;
let hasPrevious;


function getTicketFromAllCustomer() {
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/api/borrowTickets?page=${pageNumber}`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (page) {
            let borrowTickets = page.content;
            let content = '';
            for (let i = 0; i < borrowTickets.length; i++) {
                content += `
            <tr>
                <td>${i + 1}</td>
                <td>${borrowTickets[i].customer.username}</td>
                <td>${borrowTickets[i].borrowDate}</td>
                <td>${borrowTickets[i].duration}</td>
                <td>${borrowTickets[i].accepted ? "Đã được chấp nhận" : "Chưa được chấp nhận"}</td>
                <td>${borrowTickets[i].reviewed ? "Đã được xem qua" : "Chưa được xem qua"}</td>                
                <td>${borrowTickets[i].returned ? "Đã được trả lại" : "Chưa được trả lại"}</td>                
                <td><button class="btn btn-primary" data-target="#display-ticket-info" data-toggle="modal" type="button" onclick="borrowTicketDetails(${borrowTickets[i].id})">Xem chi tiết</button></td>
            </tr>`
            }
            $('#borrow-ticket-list').html(content);

            hasPrevious = !page.first
            hasNext = !page.last
            let currentPageNumber = pageNumber + 1;
            let nextPageNumber = currentPageNumber + 1;
            let previousPageNumber = currentPageNumber - 1;

            let content1 = '';
            content1 += `<ul class="pagination justify-content-end">
             <li class="page-item">
               <a class="page-link" onclick="previousPage()" aria-label="Previous">
                 <span aria-hidden="true">&laquo;</span>
               </a>
             </li>
             ${hasPrevious ? '<li class="page-item" ><a class="page-link" onclick="previousPage()"><span id="previous-page"></span></a></li>' : ''}  
             <li class="page-item" ><a class="page-link" onclick="getTicketFromAllCustomer()"><b><span id="current-page"></span></b></a></li>     
             ${hasNext ? '<li class="page-item" ><a class="page-link" onclick="nextPage()"><span id="next-page"></span></a></li>' : ''}
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
    if (pageNumber-1 < totalPage + 1) {
        pageNumber++;
        getTicketFromAllCustomer();
    }
}

function previousPage() {
    if (pageNumber > 0) {
        pageNumber--;
        getTicketFromAllCustomer();
    }
}

function acceptOrNot(id) {
    let content = `<button type="button" class="btn btn-danger" data-dismiss="modal" onclick="denyPermission(${id})">Không chấp nhận</button>
                    <button type="button" class="btn btn-success" onclick="acceptPermission(${id})" aria-label="Close" class="close" data-dismiss="modal" onclick="acceptPermission(id)">Chấp nhận</button>`;
    $('#accept-or-not').html(content)
}

function borrowTicketDetails(id) {
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/api/borrowTickets/${id}/details`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (details) {
            let contentDetails = `
            <ul>
                <li>Tên khách hàng: ${details.customer.username}</li>
                <li>Ngày mượn: ${details.borrowDate}</li>
                <li>Thời gian mượn: ${details.duration} ngày</li>
                <li><ul id="list_book">Danh sach</ul></li>
            </ul>
            `
            $('#ticket-info').html(contentDetails);

            $.ajax({
                type: 'GET',
                url: `http://localhost:8080/api/borrowTickets/${id}/books`,
                headers: {
                    'Authorization': 'Bearer ' + currentUser.token
                },
                success: function (books) {
                    let contentDetails1 = 'Danh sách';
                    for (let i = 0; i < books.length; i++) {
                        contentDetails1 += `<li>${books[i].name}</li>`;
                    }
                    $('#list_book').html(contentDetails1);
                }
            })


        }
    })
    acceptOrNot(id);
}

function denyPermission(id) {
    $.ajax({
        type: 'POST',
        url: `http://localhost:8080/api/borrowTickets/${id}/deny`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function () {
            getTicketFromAllCustomer();
        }
    })
}

function acceptPermission(id) {
    $.ajax({
        type: 'POST',
        url: `http://localhost:8080/api/borrowTickets/${id}/accept`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function () {
            getTicketFromAllCustomer();
            displaySuccessToast("Chấp nhận cho mượn sách");
        },
        error: function (errorMessage) {
            displayFailureToast(errorMessage.responseJSON.message);
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
                    <p><span> | </span><a onclick="doLogout()">  Đăng xuất  </a></p>
                    <p><span> | </span><a href="/Module4_CS_LibraryManagement_FE/pages/personal-info.html"> Thông tin tài khoản  </a></p>\
                          `
    } else {   // guest
        content += "<a href='/Module4_CS_LibraryManagement_FE/pages/login.html'></a>"
    }

    $("#login-details-librarian").html(content);
}
$(document).ready(function () {
    if (currentUser !=null){
        getTicketFromAllCustomer();
        drawLoginDetailsForAdmin()
    }
    else {
        location.href = '/Module4_CS_LibraryManagement_FE/pages/login.html';
    }
})