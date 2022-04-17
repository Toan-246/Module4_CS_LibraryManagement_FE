let currentUser = sessionStorage.getItem("currentUser");
currentUser = JSON.parse(currentUser);

function drawCart() {
    let userId = currentUser.id;
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/api/carts/${userId}`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (books) {
            let content = "";
            for (let i = 0; i < books.length; i++) {
                content += `<tr>
               <td>${i + 1}</td>
               <td>${books[i].name}</td>
               <td><img src="http://localhost:8080/image/${books[i].image}" style="height: 150px"></td>
               <td>${books[i].category?.name}</td>
               <td>${books[i].publisher}</td>
               <td>${books[i].description}</td>
               <td>${books[i].status}</td>
                <td><button class="btn btn-danger" data-toggle="modal"
                data-target="#modal__remove-book" onclick="showModalRemoveBook(${books[i].id})"><i class="fa fa-trash"></i></button></td>
                </tr>`;
            }
            $("#table-body__books").html(content);


        },
        error: function (errorMessage) {
            showErrorMessage(errorMessage.responseJSON.message);
        }
    });

}


function showModalRemoveBook(bookId) {
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/api/books/${bookId}`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (book) {
            let book_info = `
            <img src="http://localhost:8080/image/${book.image}" style="height: 150px" class="mb-3">
            <strong><h6 class="mb-3">${book.name}</h6></strong>
            <p>Xác nhận xóa sách khỏi giỏ?</p>
         `;
            $("#div__remove-book-info").html(book_info);

            let modal_footer = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Đóng</button>
                    <button type="button" class="btn btn-danger" onclick="removeBookFromCart(${bookId})" aria-label="Close" class="close" data-dismiss="modal">Xóa</button>`;
            $("#modal-footer__remove-book").html(modal_footer);

        },
        error: function (errorMessage) {
            showErrorMessage(errorMessage.responseJSON.message);
        }
    });
}

function removeBookFromCart(bookId) {
    let userId = currentUser.id;
    $.ajax({
        type: "DELETE",
        url: `http://localhost:8080/api/carts/${userId}/remove-book/${bookId}`,
        headers: {
            "Authorization": currentUser.token
        },
        success: function (){
            displaySuccessToast("Đã xóa sách khỏi giỏ");
            drawCart();
        },
        error: function (errorMessage) {
            showErrorMessage(errorMessage.responseJSON.message);
        }
    });
}

$(document).ready(function () {
    drawCart();
});