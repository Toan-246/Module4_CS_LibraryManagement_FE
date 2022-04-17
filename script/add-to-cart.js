function addToCart(bookId){
    if (currentUser == null || currentUser.id == null){
        displayFailureToast("Xin hãy đăng nhập để thuê sách");
        return;
    }

    let userId = currentUser.id;
    $.ajax({
        type: "POST",
        url: `http://localhost:8080/api/carts/${userId}/add-book/${bookId}`,
        headers: {
            "Authorization": currentUser.token
        },
        success: function (){
            displaySuccessToast("Đã thêm vào giỏ hàng");
        },
        error: function (errorMessage) {
            displayFailureToast("Không thành công");
        }
    });
}