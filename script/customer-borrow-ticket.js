let currentUser = sessionStorage.getItem("currentUser");
currentUser = JSON.parse(currentUser);

function drawBorrowTickets() {
    let userId = currentUser.id;
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/api/borrowTickets/${userId}`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (borrowTickets) {
            let content = "";
            for (let i = 0; i < borrowTickets.length; i++) {
                content += `<tr>
               <td>${i + 1}</td>
               <td>${borrowTickets[i].id}</td>
               <td>${borrowTickets[i].borrowDate}</td>
               <td>${borrowTickets[i].duration}</td>
               <td>${borrowTickets[i].reviewed ? "Đã duyệt" : "Chưa duyệt"}</td>
               <td>${borrowTickets[i].reviewed ? (borrowTickets[i].accepted  ? "Chấp nhận" : "Từ chối") : "-"}</td>
               <td>${borrowTickets[i].reviewed ? (borrowTickets[i].returned  ? "Đã trả" : "Đang mượn") : "-"}</td>
               
               <td><button class="btn btn-primary" data-bs-toggle="modal"
                data-bs-target="#modal__borrow-ticket-detail" onclick="showModalDetail(${borrowTickets[i].id})">Xem chi tiết</button></td>
                
                <td> ${borrowTickets[i].accepted && !borrowTickets[i].returned && !borrowTickets[i].hasReturnTicket ? 
                `<button class="btn btn-primary" data-bs-toggle="modal"
                data-bs-target="#modal__return-book" onclick="showModalReturn(${borrowTickets[i].id})">Trả sách</button>`
                : "" }
                </td>
                </tr>`;
            }
            $("#table-body__tickets").html(content);


        },
        error: function (errorMessage) {
            showErrorMessage(errorMessage.responseJSON.message);
        }
    });

}

function showModalDetail(borrowTicketId){
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/api/borrowTickets/${borrowTicketId}/details`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (details) {
            let contentDetails = `
            <ul>
                <li>Tên khách hàng: ${details.customer.username}</li>
                <li>Ngày mượn: ${details.borrowDate}</li>
                <li>Thời gian mượn: ${details.duration} ngày</li>
                <li><ul id="modal__ticket-detail_list_book">Danh sach</ul></li>
            </ul>
            `
            $('#modal-body__borrow-ticket-detail').html(contentDetails);

            $.ajax({
                type: 'GET',
                url: `http://localhost:8080/api/borrowTickets/${borrowTicketId}/books`,
                headers: {
                    'Authorization': 'Bearer ' + currentUser.token
                },
                success: function (books) {
                    let listBook_content = 'Danh sách';
                    for (let i = 0; i < books.length; i++) {
                        listBook_content += `<li>${books[i].name}</li>`;
                    }
                    $('#modal__ticket-detail_list_book').html(listBook_content);
                }
            })
        }
    })
}


function acceptOrNot(borrowTicketId) {
    let content = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal" >Hủy</button>
                    <button type="button" class="btn btn-success" onclick="createReturnTicketFromBorrowTicket(${borrowTicketId})" aria-label="Close" class="close" data-bs-dismiss="modal">Tạo phiếu trả sách</button>`;
    $('#accept-or-not').html(content)
}

function showModalReturn(id) {
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

function createReturnTicketFromBorrowTicket(borrowTicketId) {

    $.ajax({
        type: "POST",
        url: `http://localhost:8080/api/returnTickets/save-return-for-borrow/${borrowTicketId}`,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (returnTicket) {
            displaySuccessToast("Tạo phiếu mượn trả sách thành công! Vui lòng chờ xét duyệt.");
            drawBorrowTickets();
        },
        error: function (errorMessage) {
            displayFailureToast(errorMessage.responseJSON.message);
        }
    });


}

$(document).ready(function () {
    if (currentUser == null) {
        location.href = '/Module4_CS_LibraryManagement_FE/pages/login.html';
        return;
    }
    drawBorrowTickets();
});