<?php
header('Content-type: application/json');
include 'secret-stripe.php';
require 'stripe-php/init.php';

$status = "fail";

try {
    // Use Stripe's bindings...
    \Stripe\Stripe::setApiKey($SECRET);

    $token = filter_var($_POST['stripeToken'], FILTER_SANITIZE_STRING);
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);

    \Stripe\Charge::create(array(
        "amount" => 500,
        "currency" => "eur",
        "receipt_email" => $email,
        "source" => $token, // obtained with Stripe.js
        "description" => "Curso CRUD con ember.js 26 de junio. embermadrid.com",
        "capture" => false,
    ));

    $status = "ok";
    $message = "Succesfully capture the payment";
} catch(\Stripe\Error\Card $e) {
    // Since it's a decline, \Stripe\Error\Card will be caught
    $body = $e->getJsonBody();
    $err  = $body['error'];

    $message = $err['message'];
    http_response_code(402);
} catch (\Stripe\Error\InvalidRequest $e) {
    // Invalid parameters were supplied to Stripe's API
    $message = "Having problems in our end. Please contact hola@embermadrid.com";
    http_response_code(402);
} catch (\Stripe\Error\Authentication $e) {
    $message = "Having problems in our end. Please contact hola@embermadrid.com";
    http_response_code(402);
    // Authentication with Stripe's API failed
    // (maybe you changed API keys recently)
} catch (\Stripe\Error\ApiConnection $e) {
    $message = "Having problems with stripe.";
    http_response_code(402);
    // Network communication with Stripe failed
} catch (\Stripe\Error\Base $e) {
    http_response_code(402);
    $message = "Having problems in our end. Please contact hola@embermadrid.com";
    // Display a very generic error to the user, and maybe send
    // yourself an email
} catch (Exception $e) {
    $message = "Having problems in our end. Please contact hola@embermadrid.com";
    http_response_code(402);
    // Something else happened, completely unrelated to Stripe
}

$return = array(
    "status" => $status,
    "message" => $message
);

echo json_encode($return);
?>
