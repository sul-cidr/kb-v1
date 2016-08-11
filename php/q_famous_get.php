<?php
// $indiv = $_GET['i'];
if (isset ($_GET['o'])) {$idx = $_GET['o'];} else {$idx = 0;}

// $count = 0;
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
//$sql = "SELECT it.recno, it.indiv_id, i.fullname, coalesce(f.birthyear,f.birth_abt,f.birth_est) AS byear, coalesce(f.deathyear,f.death_abt,f.death_est) AS dyear, occutext, it.notes from indiv_text it JOIN extfamily f ON it.indiv_id=f.indiv_id JOIN indiv i ON it.indiv_id=i.indiv_id WHERE professions is null ORDER BY recno LIMIT 1";
// 19 June 2013 kg - new test -- lassttag = false
$sql = "SELECT it.recno, it.indiv_id, i.fullname, coalesce(f.birthyear,f.birth_abt,f.birth_est) AS byear, coalesce(f.deathyear,f.death_abt,f.death_est) AS dyear, occutext, it.professions from indiv_text it JOIN extfamily f ON it.indiv_id=f.indiv_id JOIN indiv i ON it.indiv_id=i.indiv_id WHERE occutext like '%*--*%' and lasttag = false ORDER BY recno LIMIT 1";
// if (isset ($_GET['i']) && isset ($_GET['y']) ) {
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
	  $r++;
	$count = $r;
	}
	if ($trimmed) {// && $arr[5] !== false) {
		handleRes($trimmed, $r);
	} else {
	//handleError('Array could not be filled.');
		handleError('no result');
	}
  } else {
    handleError('Query could not be executed [1]. PostgreSQL says "' . pg_last_error() . '"');
  }
//} else {
//  handleError('Didn\'t get an indiv. PostgreSQL says "' . pg_last_error() . '"');
//}

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
	echo "success: true,";
	echo "data: ";
	foreach($string as $s){
		echo "{";
		//echo "recno: '""',";
		echo "recno: '".(string)((int)$s[0])."',";
		echo "indiv_id: '".$s[1]."',";
		echo "fullname: '".addslashes($s[2])."',";
		echo "byear: '".$s[3]."',";
		echo "dyear: '".$s[4]."',";
		echo "occutext: '".addslashes($s[5])."',";
		echo "notes: '".addslashes($s[6])."',";
		echo "},";
	}
	echo "}";
  // echo json_encode($string);
  // echo json_encode($string->length);
  die(); 
}
?>