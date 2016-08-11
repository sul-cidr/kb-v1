<?php
$count = 0;
// display errors or not...
ini_set('display_errors', 'on');
error_reporting(1);
// database connection
include("../../conn/conn_webapp.php");
$dbconn = pg_connect($connectString_kindred_prod);
//
if (!$dbconn) {
  handleError('Could not connect to the database');
}
// ------------------------------------------------------------------
// Run SQL
// ------------------------------------------------------------------
$sql = "select distinct(tags) from indiv_text where tags !='' order by tags";
//$sql = "select distinct(tags) from indiv_text order by tags";

if (isset ($count)) {
// echo $cmd2;
// else...
  // run query
  //$foo = pg_query("set search_path = i;");
  $res = pg_query($sql);
  if ($res) {
    // query executed, so
	$trimmed = array();
	$r = 0;
	while ($row = pg_fetch_row($res)) {
	  	array_push($trimmed, $row);
		echo $row[0]."<br/>";
	  $r++;
	$count = $r;
	}
	if ($trimmed) {// && $arr[5] !== false) {
		echo $trimmed;
		//handleRes($trimmed, $r);
	} else {
	//handleError('Array could not be filled.');
		handleError('no result');
	}
  } else {
    handleError('Query could not be executed [1]. PostgreSQL says "' . pg_last_error() . '"');
  }
} else {
  handleError('Didn\'t get an indiv. PostgreSQL says "' . pg_last_error() . '"');
}

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
// encode result and return it **ALL** as a geojson feature
function handleRes($string,$count) {
	echo "{";
	echo "results: ".$count.",";
	echo "rows: [";
	foreach($string as $s){
		echo "{";
		echo "indiv_id: '".$s[0]."',";
		echo "fullname: '".addslashes($s[1])."',";
		echo "byear: '".$s[2]."',";
		echo "dyear: '".$s[3]."',";
		echo "occutext: '".addslashes($s[4])."',";
		echo "weight: ".$s[5];
		echo "},";
	}
	echo "]}";
  // echo json_encode($string);
  // echo json_encode($string->length);
  die(); 
}
?>