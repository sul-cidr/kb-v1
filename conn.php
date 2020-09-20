<?php
$dbhost = getenv("DBHOST") ?: "localhost";
$dbname = getenv("DBNAME") ?: "kindred";
$dbuser = getenv("DBUSER") ?: "webapp";

$connection_string = "host={$dbhost} dbname={$dbname} user={$dbuser}";

if (getenv("DBPASSWORD")) $connection_string .= " password={getenv('DBPASSWORD')}";
?>
