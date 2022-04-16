function getTicketFromAllCustomer() {
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/api/borrowtickets`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (borrowTickets) {
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
        }
    })
}

function acceptOrNot(id) {
    let content = `<button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="denyPermission(${id})">Không chấp nhận</button>
                    <button type="button" class="btn btn-danger" onclick="acceptPermission(${id})" aria-label="Close" class="close" data-dismiss="modal" onclick="acceptPermission(id)">Chấp nhận</button>`;
    $('#accept-or-not').html(content)
}

function borrowTicketDetails(id) {
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/api/borrowtickets/${id}/details`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (details) {
            let contentDetails = `
                <p>Tên khách hàng: ${details.customer.username}</p>
                <p>Ngày mượn: ${details.borrowDate}</p>
                <p>Thời gian mượn: ${details.duration}</p>
                <div id="list_book"></div>
            `
            $('#ticket-info').html(contentDetails);

            $.ajax({
                type: 'GET',
                url: `http://localhost:8080/api/borrowtickets/${id}/books`,
                headers: {
                    'Authorization': 'Bearer ' + currentUser.token
                },
                success: function (books) {
                    let contentDetails1 = '<p>Danh sách: </p>'
                    for (let i = 0; i < books.length; i++){
                        contentDetails1 += `<p>${books[i].name}</p>`;
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
        url: `http://localhost:8080/api/borrowtickets/${id}/deny`,
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
        url: `http://localhost:8080/api/borrowtickets/${id}/accept`,
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
$(document).ready(function () {
    getTicketFromAllCustomer();
})