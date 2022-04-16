function saveReturnTicket(borrowTicketId) {
    let returnTicket = {
        borrowTicket: {
            id: borrowTicketId
        }
    };
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/api/returnTickets',
        data: JSON.stringify(returnTicket),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function () {
            alert('tao thanh cong')
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
        <td><button class="btn btn-primary" data-bs-target="#modal__review-return-ticket" data-bs-toggle="modal"  type="button" onclick="showReturnTicketReviewed(${returnTickets[i].id})">Duyệt</td>
    </tr>`
            }
            $('#table-body__return-ticket').html(content);
        }
    })
}

function showReturnTicketReviewed(returnTicketId) {
    $.ajax({
        url: `http://localhost:8080/api/returnTickets/${returnTicketId}`,
        type: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (returnTickets) {
            let content = `
        <p>Tên người dùng : ${returnTickets.borrowTicket.customer.username}</p>
        <p>Ngày mượn : ${returnTickets.borrowTicket.borrowDate}</p>
        <p>Thời hạn : ${returnTickets.borrowTicket.duration}</p>
        `
            let select = `
<button class="btn btn-danger" data-bs-dismiss="modal" type="button" onclick="denyReturnTicket(${returnTicketId})">Deny</button>
                    <button class="btn btn-success" data-bs-dismiss="modal" onclick="acceptReturnTicket(${returnTicketId})" type="button">Accept</button>`;
            $('#content_return_ticket').html(content);
            $('#footer-show').html(select);
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