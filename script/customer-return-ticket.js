let currentUser = sessionStorage.getItem("currentUser");
currentUser = JSON.parse(currentUser);

function drawReturnTickets() {
    let userId = currentUser.id;
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/api/returnTickets/customer/${userId}`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (returnTickets) {
            let content = "";
            for (let i = 0; i < returnTickets.length; i++) {
                content += `<tr>
               <td>${i + 1}</td>
               <td>${returnTickets[i].id}</td>
               <td>${returnTickets[i].borrowTicket.id}</td>
               <td>${returnTickets[i].borrowTicket.borrowDate}</td>
               <td>${returnTickets[i].borrowTicket.duration}</td>
               <td>${returnTickets[i].returnDate != null ? returnTickets[i].returnDate : "-"}</td>
               <td>${returnTickets[i].reviewed ? "Đã duyệt" : "Chưa duyệt"}</td>
               <td>${returnTickets[i].reviewed ? (returnTickets[i].accepted ? "Chấp nhận trả" : "Từ chối trả") : "-"}</td>
                <td> <button class="btn btn-primary" data-bs-toggle="modal"
                data-bs-target="#modal__return-ticket-detail" onclick="showModalReturnTicketDetail(${returnTickets[i].id})">Xem chi tiết</button>
                    </td>
                </tr>`;
            }
            $("#table-body__tickets").html(content);
        },
        error: function (errorMessage) {
            showErrorMessage(errorMessage.responseJSON.message);``
        }
    });

}


function showModalReturnTicketDetail(returnTicketId) {
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/api/returnTickets/${returnTicketId}`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (returnTicket) {
            let borrowTicket = returnTicket.borrowTicket;

            let contentDetails = `
            <ul>
                <li>Tên khách hàng: ${borrowTicket.customer.username}</li>
                <li>Ngày mượn: ${borrowTicket.borrowDate}</li>
                <li>Thời gian mượn: ${borrowTicket.duration} ngày</li>
                <li>Ngày trả: ${returnTicket.returnDate != null ? returnTicket.returnDate : "N/A"}</li>
                <li>Được duyệt: ${returnTicket.reviewed ? "Đã duyệt" : "Chưa duyệt"}</li>
                <li>Chấp nhận: ${returnTicket.reviewed ? (returnTicket.accepted ? "Được chấp nhận" :"Không được chấp nhận") : "N/A"}</li>
                <li><ul id="list_book">Danh sach</ul></li>
            </ul>
            `
            $('#ticket-info').html(contentDetails);

            $.ajax({
                type: 'GET',
                url: `http://localhost:8080/api/borrowTickets/${borrowTicket.id}/books`,
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
    });
}


$(document).ready(function () {
    if (currentUser == null) {
        location.href = '/Module4_CS_LibraryManagement_FE/pages/login.html';
        return;
    }
    drawReturnTickets();
});