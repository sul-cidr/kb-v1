<?php
// http://localhost/dhdev/poh/php/q_famous_submit.php?i=I13047&p=colonist&t=foo,bar&n=here's a piece of text, can you insert it?
$indiv = $_GET['i'];
$prof = $_GET['p'];
$tags = $_GET['t'];
$notes = $_GET['n'];
// $year = $_GET['y'];
// $count = 0;
// display errors or not...
ini_set('display_errors', 'on');
error_reporting(1);
// database connection
include("../../conn/conn_webapp.php");
$dbconn = pg_connect($connectString_kindred_prod);
//

// Report error and terminate
function handleError($string) {
  echo strip_tags(utf8_decode("ERROR:\n\n" . $string));
  die();
}
// Return info message and terminate
function handleInfo($string) {
  echo strip_tags(utf8_decode("INFO:\n\n" . $string));
  die();
}

if (!$dbconn) {
  handleError('Could not connect to the database');
}
// ------------------------------------------------------------------
// Run SQL
// ------------------------------------------------------------------
// set lasttag = true; 19 June 2013 kg
$sql = "UPDATE indiv_text set lasttag = true, professions2 = '". $_GET['p'] . "', tags = '".$_GET['t'].
	"', profnotes = '".pg_escape_string($_GET['n'])."' WHERE indiv_id = '". $_GET['i'] . "';";

//$foo = pg_query("set search_path = i;");
$result = pg_query($sql);
// echo $result;
if ($result) {
	echo '{';
	echo '"success": true,';
	echo '"msg":"Famous person updated"}';
	//echo '"msg":"'.$sql.'"}';
	} else { 
	echo '{';
	echo '"success": false,';
	echo '"msg":"'.$sql.'? No can do, Poncho"}';
	}
?>