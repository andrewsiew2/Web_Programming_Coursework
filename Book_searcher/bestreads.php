<?php
    # Name: *YOUR NAME*
    # Date: *DATE*
    # Section: *YOUR QUIZ SECTION*
    # 
    # ***MAKE SURE TO REPLACE THIS WITH YOUR OWN DESCRIPTIVE HEADER COMMENT***
    # This is the structure.php page for CSE 154, showing what the basic 
    # structure of every php document should look like in this class.
    
    # Analogous to "use strict" from JS; adds stricter error reporting for php
    error_reporting(E_ALL);
    
    # Example on how to retrieve query parameters.
    #
    # NOTE: We check for/retrieve query parameters outside of any function
    # because GET and POST are defined as 'superglobals' in php and are 
    # available in all scopes throughout the file.
    if (isset($_GET["some_key"])) { # Always check if the key isset!
        handle_success($_GET["some_key"]);
    } else {
        # Print an error message for the user if the query parameter does
        # not exist.
        header("HTTP/1.1 400 Invalid Request");
        # Remember to ALWAYS set content-type before you print anything
        header("Content-Type: text/plain");
        print "Error: This parameter does not exist.";
    }
    
    # Execute initialize_php.
    initialize_php();
    
    # Make sure to always add a descriptive comment above
    # every function detailing what it's purpose is.
    # 
    # NOTE: It is not a requirement to create an initialize_php function in your
    # php file, however I HIGHLY RECOMMEND IT. It makes for much cleaner and
    # more readable code.
    function initialize_php() {
        # *SOME SETUP CODE*
        
        # Execute example_function.
        example_function();  
    }
    
    # Make sure to always add a descriptive comment above
    # every function detailing what it's purpose is.
    function handle_success($some_value) {
        # *SOME CODE THAT HANDLES A SUCCESSFUL GET OR POST CALL*
    }
    
    # Make sure to always add a descriptive comment above
    # every function detailing what it's purpose is.
    function example_function() {
        # *SOME CODE*
    }
?> 