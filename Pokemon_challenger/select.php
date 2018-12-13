<?php
    # Name: Andrew Siew
    # Date: 5/26
    # Section: AI
    # 
    # This is a web service that returns all the pokemon in the database 
    # returns data int he form of a JSON 
    # service is via GET request.
    include("common.php");
    print_pokemon(get_database($host, $dbname, $user, $password, $ds));

    # inserts all the pokemon in the database in a JSON object and prints it
    # @param db, the database
    function print_pokemon($db){
        $result = array();
        $pokemon = array();
        $rows = $db->query("SELECT * FROM Pokedex;");
        
        foreach($rows as $row){
            $segment = array();
            $segment["name"] = $row["name"];
            $segment["nickname"] = $row["nickname"];
            $segment["datefound"] = $row["datefound"];
            array_push($pokemon, $segment);
        }
        $result["pokemon"] = $pokemon;
        header("Content-type: application/json");
        print(json_encode($result));
    }
?>