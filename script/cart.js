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
                <td><button class="btn btn-danger" data-bs-toggle="modal"
                data-bs-target="#modal__remove-book" onclick="showModalRemoveBook(${books[i].id})"><i class="fa fa-trash"></i></button></td>
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

            let modal_footer = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                    <button type="button" class="btn btn-danger" onclick="removeBookFromCart(${bookId})" aria-label="Close" class="close" data-bs-dismiss="modal">Xóa</button>`;
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
        success: function () {
            displaySuccessToast("Đã xóa sách khỏi giỏ");
            drawCart();
        },
        error: function (errorMessage) {
            displayFailureToast(errorMessage.responseJSON.message);
        }
    });
}

function createBorrowTicket() {
    let userId = currentUser.id;
    let duration = $("#modal-input__duration").val();

    $.ajax({
        type: "POST",
        url: `http://localhost:8080/api/borrowTickets/${userId}?duration=${duration}`,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (borrowTicket) {
            displaySuccessToast("Tạo phiếu mượn thành công! Vui lòng chờ xét duyệt.");
            drawCart();
        },
        error: function (errorMessage) {
            displayFailureToast(errorMessage.message);
        }
    });


}

$(document).ready(function () {
    if (currentUser == null) {
        location.href = '/Module4_CS_LibraryManagement_FE/pages/login.html';
        return;
    }
    drawCart();
});