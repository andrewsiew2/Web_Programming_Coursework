<?php
    # Name: Andrew Siew
    # Date: 5/26
    # Section: AI
    # 
    # This is a web service that updates the nickname of the pokemon.
    # This service is provided via POST request with parameters
    # name(case-insentitive) and nickname(optional). Not having a nickname will set it
    # to the default nickname.
    include('common.php');
    update_pokemon(get_database($host, $dbname, $user, $password, $ds), "name", false);
    
    # Updates the pokemon in the database with a new nickname.
    # Pokemon must be contained in the database.
    # @param db, the database the pokemon are stored in
    function update_pokemon($db){
        if(isset($_POST["name"])){
            $name = strtolower($_POST["name"]);
            if(exists($db, $name)){
                $nickname = "";
                if(isset($_POST["nickname"])){
                    $nickname = $_POST["nickname"];
                }else{
                    $nickname = strtoupper($name);
                }
                $db->query("UPDATE Pokedex SET nickname = '" . $nickname . "' WHERE name = '" . $name . "';");
                set_success_header("Your " . $_POST["name"] . " is now named " . $nickname . "!");
            }else{
                set_error_header("Error: Pokemon " . $_POST["name"] . " not found in your Pokedex.");
            }
        }else{
            set_error_header("Missing name parameter");
        }
    }
?>