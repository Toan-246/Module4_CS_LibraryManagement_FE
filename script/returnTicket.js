function saveReturnTicket(borrowTicketId){

    $.ajax({
        type:'POST',
        url:`http://localhost:8080/api/returnTickets/save-return-for-borrow/${borrowTicketId}`,
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json',
            'Authorization': 'Bearer ' + currentUser.token
        },
        success:function(){
            alert('tao thanh cong');
            getTicketOfCurrentUser();
        }

    })
}