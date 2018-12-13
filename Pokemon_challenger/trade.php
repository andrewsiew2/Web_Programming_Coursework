<?php
    # Name: Andrew Siew
    # Date: 5/26
    # Section: AI
    # 
    # This is a web service that trades pokemon by removing an
    # existing pokemon and adding a non existing pokemon into 
    # the database. The service is provided via POST request
    # with parameters mypokemon(case-insentitive) add theirpokemon(case-insentitive).
    include('common.php');
    trade(get_database($host, $dbname, $user, $password, $ds));
    
    # Trades my pokemon with another pokemon.
    # Must contain pokemon trading away in database and not contain
    # the pokemon being received.
    # @param db, the database the pokemon are stored in
    function trade($db){
        if(isset($_POST["mypokemon"]) && isset($_POST["theirpokemon"])){
            if(exists($db, $_POST["mypokemon"]) && !exists($db, $_POST["theirpokemon"])){
                delete_name($db, "mypokemon", true);
                insert_pokemon($db, "theirpokemon", true);
                set_success_header("You have traded your " . $_POST["mypokemon"]
                                    . " for " . $_POST["theirpokemon"] . "!");
            }else if(!exists($db, strtolower($_POST["mypokemon"]))){
                set_error_header("Error: Pokemon " . $_POST["mypokemon"] .
                                 " not found in your Pokedex.");
            }else{
                set_error_header("Error: You have already found " .
                                 $_POST["theirpokemon"] . ".");
            }
        }else{
            set_error_header("Missing mypokemon and theirpokemon parameter");
        }
    }
?>