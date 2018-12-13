<?php
    # Name: Andrew Siew
    # Date: 5/26
    # Section: AI
    # 
    # This is a web service that returns my UW ID and my unique token

    error_reporting(E_ALL);
    
    $PID = "aks42";
    $token = "poketoken_5b09af320cf139.86194421";
    
    header('Content-Type: text/plain');
    print_r($PID . "\n" . $token);
?> 