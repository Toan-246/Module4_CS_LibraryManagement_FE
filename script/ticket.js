function getTicketOfCurrentUser() {
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/api/borrowtickets/customer/${currentUser.id}`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (borrowTickets) {
            let content = '';
            for (let i = 0; i < borrowTickets.length; i++) {
                content += `<tr>
                    <td>${i + 1}</td> 
                    <td>${borrowTickets[i].customer.username}</td>
                    <td>${borrowTickets[i].borrowDate}</td>
                    <td>${borrowTickets[i].duration}</td>
                    <td>${borrowTickets[i].isAccepted ? "Đã được chấp nhận" : "Không được chấp nhận"}</td>
                    <td>${borrowTickets[i].isReviewed ? "Đã được xem qua" : "Chưa được xem qua"}</td>
                    <td>${borrowTickets[i].isReturned ? "Đã trả lại" : "Chưa được trả lại"}</td>
                    <td>${borrowTickets[i].isReturned ? '' : '<button type="button" onclick="saveReturnTicket(' + borrowTickets[i].id + ')">Trả lại sách ngay bây giờ</button>'}</td>
                    </tr>`
            }
            $('#borrow-ticket-list').html(content);
        }
    })
}

$(document).ready(function () {
    getTicketOfCurrentUser();
});

