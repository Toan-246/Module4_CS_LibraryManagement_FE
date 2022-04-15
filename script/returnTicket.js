function saveReturnTicket(borrowTicketId){
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
            'Content-Type':'application/json',
            'Authorization': 'Bearer ' + currentUser.token
        },
        success:function(){
            alert('tao thanh cong')
        }

    })
}