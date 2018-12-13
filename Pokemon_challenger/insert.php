<?php
    # Name: Andrew Siew
    # Date: 5/26
    # Section: AI
    # 
    # This is a web service that inserts a pokemon into the database.
    # Will not add pokemon if the pokemon exists already.
    # The service is provided via POST request with parameters
    # name(case-insentitive) and nickname(optional). Not inserting a nickname
    # will cause the pokemon to be inserted with the default nickname.
    include('common.php');
    insert_pokemon(get_database($host, $dbname, $user, $password, $ds), "name", false);
?>