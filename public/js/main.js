$(document).ready(() => {
    //For navbar
    $('ul.navbar-nav li.active').removeClass('active');
    $('a[href="' + this.location.pathname + '"]').parents('li,ul').addClass('active');

    //For nav tabs
    $('.nav-tabs a.active').removeClass('active');
    $('a[href="' + this.location.pathname + '"]').addClass('active')
});