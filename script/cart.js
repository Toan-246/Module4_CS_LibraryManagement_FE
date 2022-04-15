

$(document).ready(function (){
   getCartDetails();
});

function getCartDetails() {
    let currentUser = sessionStorage.getItem('currentUser');
    currentUser = JSON.parse(currentUser);
    let userId = currentUser.id;
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/api/carts/get-cart-of-user/${userId}`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (cart) {
            let cartId = cart.id;
            $.ajax({
                type: 'GET',
                url: `http://localhost:8080/api/carts/${cartId}`,
                headers: {
                    'Authorization': 'Bearer ' + currentUser.token
                },
                success: function (books) {
                    let content = "";
                    for (let i = 0; i < books.length; i++) {
                        content += `<tr>
                            <td>${i+1}</td>
                            <td>${books[i].name}</td>
                            <td>${books[i].category.name}</td>
                            <td>${books[i].image}</td>
                            <td>${books[i].publisher}</td>
                            <td>${books[i].description}</td>
                            <td>${books[i].status}</td>
                        </tr>`;
                    }//for
                }// success
            });
        }
    })
}