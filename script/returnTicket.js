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
        url: `http://localhost:8080/api/returnTickets/notReviewed`,
        type: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (returnTickets) {
            let content = '';
            for (let i = 0; i < returnTickets.length; i++) {
                content += `<tr>
        <td>${i + 1}</td>
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
        }
    })
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
                url: `http://localhost:8080/api/borrowtickets/${borrowTicketId}/books`,
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

$(document).ready(function () {
    getAllReturnTicketNotReviewed();
})