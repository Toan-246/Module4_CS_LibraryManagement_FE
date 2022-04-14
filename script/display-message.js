
function displaySuccessToast(message){
    // https://www.jqueryscript.net/other/Highly-Customizable-jQuery-Toast-Message-Plugin-Toastr.html
    toastr.success(message)
}
function displayFailureToast(message){
    toastr.error(message)
}

function generalToast(heading, message, icon){
    // $.toast().reset('all');
    // $.toast({
    //     text: message,
    //     heading: heading,
    //     icon: icon,
    //     showHideTransition: 'slide', // fade, slide or plain
    //     allowToastClose: true,
    //     hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
    //     stack: 10,
    //     position: 'bottom-left',
    //
    //     // afterHidden: function (){
    //     //    this.reset();
    //     // }
    // });


    $.toast({
        text: "Don't forget to star the repository if you like it.", // Text that is to be shown in the toast
        heading: 'Note', // Optional heading to be shown on the toast
        icon: 'warning', // Type of toast icon
        showHideTransition: 'slide', // fade, slide or plain
        allowToastClose: true, // Boolean value true or false
        hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
        stack: 10, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
        position: 'bottom-left', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values



        textAlign: 'left',  // Text alignment i.e. left, right or center
        loader: true,  // Whether to show loader or not. True by default
        loaderBg: '#9EC600',  // Background color of the toast loader
        beforeShow: function () {}, // will be triggered before the toast is shown
        afterShown: function () {}, // will be triggered after the toat has been shown
        beforeHide: function () {}, // will be triggered before the toast gets hidden
        afterHidden: function () {}  // will be triggered after the toast has been hidden
    });
}
