$(function() {
    var handler = StripeCheckout.configure({
        key: 'pk_live_B2ZMFvZ49OKRZciS3PHtDiQW',
        image: '/assets/img/emberjs.png',
        token: function(token) {
            $("#processing-payment").show();
            $.post("/charge.php", {stripeToken: token.id, email: token.email})
            .done(function(data) {
                $('#success-payment').fadeIn().delay(5000).fadeOut();
                $("#processing-payment").hide();
            })
            .fail(function(data) {
                $('#fail-payment').find('p').html(data.responseJSON.message);
                $('#fail-payment').fadeIn().delay(5000).fadeOut();
                $("#processing-payment").hide();
            });
        }
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
