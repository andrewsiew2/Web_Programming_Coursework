<?php
    # Name: Andrew Siew
    # Date: 5/26
    # Section: AI
    # 
    # This is php file that contains methods that are used by the other web
    # service files for the pokedex.

    error_reporting(E_ALL);
    $host =  'localhost'; #fill in with server name
    $dbname = 'hw7';    #fill in with db name
    $user = 'root';       #fill in with user name
    $password = '';       #fill in with password
    
    # Make a data source string that will be used in creating the PDO object
    $ds = "mysql:host={$host};dbname={$dbname};charset=utf8";
    
    # Returns the database. Note that this is taken from lecture slides
    # @param host, the name of server
    # @param dbname, the name of the database
    # @param user, the  naem fo the user
    # @param password, the password for the user
    function get_database($host, $dbname, $user, $password, $ds){
        try {
            $db = new PDO($ds, $user, $password);
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        }catch (PDOException $ex) {
            header("Content-Type: text/plain");
            print ("Can not connect to the database. Please try again later.\n");
            print ("Error details: $ex \n");
            die();
        }
        return $db;
    }
    
    # Deletes a single name from the database.
    # The pokemon must be contained in the database.
    # @param db, the database the pokemon are stored in
    # @param parameter, the name fo the parameter for a request
    # @param trademode, a boolean that denotes if this is being called
    #                   for a trade.
    function delete_name($db, $parameter, $trademode){
        $name = "";
        if(isset($_POST[$parameter])){
            $name = strtolower($_POST[$parameter]);
            if(exists($db, $name)){
                $db->query("DELETE FROM Pokedex WHERE name LIKE '" . $name . "';");
                if(!$trademode){
                    set_success_header($_POST[$parameter] . " removed from your Pokedex!");
                }
            }else{
                set_error_header("Error: Pokemon " . $_POST[$parameter] . " not found in your Pokedex.");
            }
        }
    }
    
    # Inserts a pokemon into the database 
    # The pokemon must not be contained in the database.
    # @param db, the database the pokemon are stored in
    # @param parameter, the name fo the parameter for a request
    # @param trademode, a boolean that denotes if this is being called
    #                   for a trade.
    function insert_pokemon($db, $parameter, $trademode){
        date_default_timezone_set('America/Los_Angeles');
        $nickname = "";
        $name = "";
        $time = date('y-m-d H:i:s');
        if(isset($_POST[$parameter])){
            $name = strtolower($_POST[$parameter]);
            try{
                if(isset($_POST["nickname"])){
                    $nickname = $_POST["nickname"];
                }else{
                    $nickname = strtoupper($_POST[$parameter]);
                }
                $db->query("INSERT INTO Pokedex(name, nickname, datefound) VALUES ('" .
                            $name . "', '" . $nickname . "', '" . $time . "');");
                if(!$trademode){
                    set_success_header($_POST[$parameter] . " added to your Pokedex!");
                }
            }catch (PDOException $ex){
                set_error_header("Error: Pokemon " . $_POST[$parameter] . " already found.");
            }
            
        }else{
            set_error_header("Missing name parameter");
        }
    }
    
    # Returns true if the pokemon exists in the database
    # @param db, the database the pokemon is stored in
    # @param name, the name of the pokemon
    function exists($db, $name){
        $pokemon = $db->query("SELECT name FROM Pokedex WHERE name LIKE '" . $name . "';");
        return($pokemon->rowCount() > 0);
    }
    
    # Prints a JSON file as an error 
    # @param error, the error message
    function set_error_header($error){
        header("HTTP/1.1 400 Invalid Request");
        header("Content-Type: application/json");
        $result = array();
        $result["error"] = $error;
        print(json_encode($result));
    }
    
    # Prints a JSON file as a success
    # @param success, the success message
    function set_success_header($success){
        header("Content-Type: application/json");
        $result = array();
        $result["success"] = "Success! " . $success;
        print(json_encode($result));
    }
?>