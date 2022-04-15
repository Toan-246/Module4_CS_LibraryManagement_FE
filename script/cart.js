let currentUser = localStorage.getItem('currentUser');
currentUser = JSON.parse(currentUser);

function getAllCart() {
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/api/carts`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (carts) {
            let content = "";
            for (let i = 0; i < carts.length; i++) {
                content += `
        <tr>
        <td>${i + 1}</td>
      
</tr>`
            }
            $('#book-list-content').html(content);
        }
    })
}