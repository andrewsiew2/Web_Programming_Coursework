<?php
    # Name: Andrew Siew
    # Date: 5/26
    # Section: AI
    # 
    # This is a web service that deletes a pokemon or all pokemon that is already caught and 
    # contained in the database. The service is provided via POST request
    # with parameters mode(case-sentitive) or name(case-insentitive). 
    include('common.php');
    delete_pokemon(get_database($host, $dbname, $user, $password, $ds), "name");

    # Deletes a certain number of pokemon
    # @param db, the database the pokemon are stored in
    function delete_pokemon($db){
        if(!isset($_POST["mode"]) && !isset($_POST["name"])){
            set_error_header("Missing mode or name parameter");
        }else{
            delete_name($db, "name", false);
            delete_all($db);
        }
    }
    
    # Deletes all the pokemon
    # @param db, the database the pokemon are stored in
    function delete_all($db){
        if(isset($_POST["mode"])){
            if($_POST["mode"] == "removeall"){
                $db->query("DELETE FROM Pokedex");
                set_success_header("All Pokemon");
            }else{
                set_error_header("Error: Unknown mode " . $_POST["mode"] . ".");
            }
        }
    }
?>