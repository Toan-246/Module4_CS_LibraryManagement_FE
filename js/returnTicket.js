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