function saveReturnTicket(){
    let borrowTicketId =$('#input-borrowTicketId').val();
    let returnTicket = {
        borrowTicket: {
            id: borrowTicketId
        }
    };
    $.ajax({
        type:'POST',
        url:'http://localhost:8080/api/returnTickets',
        data:JSON.stringify(returnTicket),
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json'

        },
        success:function(){
            alert('tao thanh cong')
        }

    })
}
function getAllReturnTicketNotReviewed() {
    $.ajax({
        url: `http://localhost:8080/api/returnTickets/notReviewed`,
        type: 'GET',
        headers: {
            'Accept':'application/json',
            'Content-Type':'application/json',
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (returnTickets){
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
        <td><button class="btn btn-primary" data-bs-target="#modal__review-return-ticket" data-bs-toggle="modal"  type="button" onclick="showReturnTicketReviewed(id)">Duyệt</td>
    </tr>`
            }
            $('#return-ticket-not-reviewed').html(content);
        }
    })
}
$(document).ready(function (){
    getAllReturnTicketNotReviewed();
})
function showReturnTicketReviewed(id) {
    let content = `<button class="btn btn-secondary" data-dismiss="modal" type="button" onclick="">Deny</button>
                    <button class="btn btn-danger" data-bs-dismiss="modal" onclick="acceptReturnTicket()" type="button">Accept</button>`;
    $('#footer-show').html(content);
}
function acceptReturnTicket() {
    $.ajax({
        url: `http://localhost:8080/api/returnTickets/${id}/accept`,
        type: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        success: function () {
            getAllReturnTicketNotReviewed();
        }
    })
}