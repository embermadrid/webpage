$(function() {
    var handler = StripeCheckout.configure({
        key: 'pk_test_hPcrVWUXFGuto5XNvj25Uwnc',
        image: '/assets/img/emberjs.png',
    });

    $('.pay-stripe button').on('click', function(e) {
        // Open Checkout with further options
        handler.open({
            name: 'EmberMadrid',
            description: 'iniciación a ember.js en EmberMadrid. 26 junio',
            currency: "eur",
            amount: 500
        });
        e.preventDefault();
    });
});
