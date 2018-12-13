-- CSE 154
-- HW7
-- Name : Andrew Siew
-- TA : Jeremy
-- This is a database that stores data of all the pokemon I have caught
-- This database does not take in duplicates of pokemon with thsame name
CREATE DATABASE IF NOT EXISTS hw7;
USE hw7;

CREATE TABLE Pokedex(
  name             VARCHAR(50) UNIQUE,
  nickname         VARCHAR(50),
  datefound        DATETIME 
);
