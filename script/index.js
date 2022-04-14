let pageNumber = 0;
function getCurrentPage (){
    let currentPageNumber = pageNumber+1
    $('#current-page').html(currentPageNumber);
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/api/books/page/${pageNumber}`,
        success: function (page){
            let books = page.content
            let content = '';
            for (let i = 0; i < books.length; i++) {
                content +=`<li>
                   <div class="product">
                      <a href="#" class="info">
                         <span class="holder">
                           <img src="http://localhost:8080/image/${books[i].image}" alt="" />
                           <span class="book-name"${books[i].name}</span>
                           <span class="author">${books[i].publisher}</span>
                           <span class="description">${books[i].description}</span>
                        </span>
                     </a>
                      <a href="#" class="buy-btn">Mượn sách <span class="price">${books[i].quantity}</span></a>
                  </div>
               </li>`
            }
            $('#book-list-content').html(content);
            let totalPage = page.totalPages;
            $('#total-page').html(totalPage)
        }
    })
}
function getAllCategories(){
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/api/categories',
        success: function (categories){
            let content = '';
            for (let i = 0; i < categories.length; i++) {
                content += `<li><a href="#">${categories[i].name}</a></li>`
            }
            $('#categories-list-content').html(content);
        }
    })
}
function getAllPublisher(){
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/api/books',
        success: function (page){
            let books = page.content
            let content = '';
            for (let i = 0; i < books.length; i++) {
                content += `<li><a href="#">${books[i].publisher}</a></li>`
            }
            $('#publisher-list-content').html(content);
        }
    })
}
$(document).ready(function (){
    getCurrentPage();
    getAllCategories();
    getAllPublisher();
})

function nextPage(){
    pageNumber++;
    getCurrentPage();
}

function previousPage(){
    pageNumber--;
    getCurrentPage();
}





