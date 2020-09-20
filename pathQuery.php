<?php

header('Content-Type: text/html; charset=utf-8');
$source = $_GET['s'];
$target = $_GET['t'];
$ancestry = $_GET['c'];
$before = $_GET['b'];
$after = $_GET['a'];

/*
$vehicle = $_GET['v'] ;
$pathtype = $_GET['p'];
$coastal = $_GET['c'];
$modelist = $_GET['ml'];
*/

include("conn.php");
$link = pg_connect($connection_string);

if ($before + $after > 0){

$sql = "
SELECT MIN(COALESCE(birthyear,birth_abt,best)) as min,MAX(COALESCE(deathyear,death_abt,dest)) as max FROM indiv

WHERE

indiv.indiv_id IN ('".$source."','".$target."')
";
if (!$link) {
    echo "error, didn't make the pg_connect()";
} else {
	$result = pg_query($link, $sql);
	if (!$result) {
	  echo "error, no result!<br>";
      print pg_last_error($link);	  
	  exit;
	}
}

	while ($row = pg_fetch_row($result)) {
		if ($before == 1) {
	  	$before = $row[1] + 1;
		}
		else{
	  		$before = 2000;
		}
		if ($after == 1){
		  	$after = $row[0] - 1;		
		}
		else {
			$after = 100;
		}
	}
}
else {
	$before = 2050;
	$after = 100;
}

if ($ancestry == 1) {
$sql = "
SELECT string_agg(''''||source||''''||','||''''||target||'''',',') FROM public.o_indiv_path_forward('".$source."','".$target."','childOf')
";
}
else {
$sql = "
SELECT string_agg(''''||source||''''||','||''''||target||'''',',') FROM public.o_indiv_path_undirected('".$source."','".$target."',".$before.",".$after.")
";
}


if (!$link) {
    echo "error, didn't make the pg_connect()";
} else {
	$result = pg_query($link, $sql);
	if (!$result) {
	  echo "error, no result!<br>";
      print pg_last_error($link);	  
	  exit;
	}
}

	while ($row = pg_fetch_row($result)) {
	  	$id_array = $row[0];
	}

$sql="
SELECT

indiv.indiv_id,
sex,
fullname,
COALESCE(parentless,0),
COALESCE(birthyear,birth_abt,best) as yearb,
COALESCE(deathyear,death_abt,dest) as yeard,
16 as size,
(CASE
when sex = 'M' then 'blue'
when sex = 'F' then 'red'
else 'purple'
END
) as color,
(CASE
when sex = 'M' then 'male'
when sex = 'F' then 'female'
else 'purple'
END
) as image,
COALESCE(char_length(indiv_text.occutext),0) as char_size,
indiv_dist.centrality,
indiv_dist.tragedy,
indiv_dist.odnb,
indiv_dist.inbred,
COALESCE(indiv_events.particip_array,'[]') as particip_array,
(SELECT string_agg('\"'||p_indivoccu||'\"',',') FROM public.p_indivoccu(indiv.indiv_id))

FROM
indiv

LEFT JOIN indiv_dist ON indiv.indiv_id = indiv_dist.indiv_id
LEFT JOIN indiv_text ON indiv_text.indiv_id = indiv_dist.indiv_id
LEFT JOIN indiv_events ON indiv_events.indiv_id = indiv.indiv_id

WHERE

indiv.indiv_id IN (".$id_array.")

GROUP BY
indiv.indiv_id,
sex,
fullname,
COALESCE(parentless,0),
COALESCE(birthyear,birth_abt,best),
COALESCE(deathyear,death_abt,dest),
(CASE
when sex = 'M' then 'blue'
when sex = 'F' then 'red'
else 'purple'
END
),
(CASE
when sex = 'M' then 'male'
when sex = 'F' then 'female'
else 'purple'
END
),
COALESCE(char_length(indiv_text.occutext),0),
indiv_dist.centrality,
indiv_dist.tragedy,
indiv_dist.odnb,
indiv_dist.inbred,
particip_array
"
;

//echo('<p>The query sent: '.$sql.'</p><p>The link: '.$link.'</p><h3>The official fubar PHP report is: </h3>');

if (!$link) {
    echo "error, didn't make the pg_connect()";
} else {
	$result = pg_query($link, $sql);
	if (!$result) {
	  echo "error, no result!<br>";
      print pg_last_error($link);	  
	  exit;
	}
}
// echo $result;	

	$tough = array();
	$r = 0;
	while ($row = pg_fetch_row($result)) {
	  	array_push($tough, $row);
	  $r++;
	}
	$t = 0;
	$id_hash = array();
	
echo '{"nodes":
		[';
foreach($tough as $s){
	  	$id_hash[$s[0]] = $t;
		$t++;
		echo "{";
		echo '"id": "'.$s[0].'",';
		echo '"gender": "'.$s[1].'",';
		echo '"name": "'.$s[2].'",';
		echo '"parentless": '.$s[3].',';
		echo '"birthyear": '.$s[4].',';
		echo '"end": '.$s[5].',';
		echo '"size": '.$s[6].',';
		echo '"color": "'.$s[7].'",';
		echo '"image": "'.$s[8].'",';
		echo '"charsize": '.$s[9].',';
		echo '"centrality": '.$s[10].',';
		echo '"tragedy": '.$s[11].',';
		echo '"odnb": '.$s[12].',';
		echo '"relatedness": '.$s[13].',';
		echo '"aevents": '.$s[14].',';
		echo '"occus": ['.$s[15].']';
		echo "}";
		if($t <> $r) {
		echo ",";
		}		
}
echo "],";

$sql="
SELECT
source,
target,
relation,
recno,
(CASE
when relation = 'childOf' then 'blue'
when relation = 'spouseOf' then 'green'
else 'purple'
END
) as color

FROM
edges
WHERE

edges.source IN (".$id_array.")

AND

edges.target IN (".$id_array.")

AND

edges.source <> edges.target

";

//echo('<p>The query sent: '.$sql.'</p><p>The link: '.$link.'</p><h3>The official fubar PHP report is: </h3>');

if (!$link) {
    echo "error, didn't make the pg_connect()";
} else {
	$result = pg_query($link, $sql);
	if (!$result) {
	  echo "error, no result!<br>";
      print pg_last_error($link);	  
	  exit;
	}
}
// echo $result;	

	$sorted = array();
	$r = 0;
	while ($row = pg_fetch_row($result)) {
	  	array_push($sorted, $row);
	  $r++;
	}

echo '"links": [';
$t = 0;
foreach($sorted as $s){
		$t++;
		echo "{";
		echo '"source": '.$id_hash[$s[0]].',';
		echo '"target": '.$id_hash[$s[1]].',';
		echo '"sid": "'.$s[0].'",';
		echo '"tid": "'.$s[1].'",';
		echo '"value": 5,';
		echo '"relation": "'.$s[4].'",';
		echo '"id": "'.$s[3].'",';
		echo '"color": "'.$s[4].'"';
		echo "}";	
	if($t <> $r) {
		echo ",";
		}
}
echo "],";

$new_id_array = str_replace("'","",$id_array);

$sql = "

SELECT
string_agg('{\"activity\": '||'\"'||uber||'\",\"total\": '||count||'}', ',')

FROM

public.p_arrayoccu('{".$new_id_array."}')
";

if (!$link) {
    echo "error, didn't make the pg_connect()";
} else {
	$result = pg_query($link, $sql);
	if (!$result) {
	  echo "error, no result!<br>";
      print pg_last_error($link);	  
	  exit;
	}
}
echo '"occu": [';
	while ($row = pg_fetch_row($result)) {
	  	echo $row[0];
	}

echo "]}";
pg_close($link);
?>