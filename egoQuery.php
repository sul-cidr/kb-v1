<?php

header('Content-Type: text/html; charset=utf-8');
$source = $_GET['s'];

include("conn.php");
$link = pg_connect($connection_string);

$sql="
SELECT

indiv.indiv_id,
sex,
fullname,
COALESCE(parentless,0),
date_part('year',first(lifeperiod)) as yearb,
date_part('year',last(lifeperiod)) as yeard,
16 as size,
(CASE
when sex = 'M' then 'palegreen'
when sex = 'F' then 'orchid'
else 'purple'
END
) as color,
(CASE
when sex = 'M' then 'male'
when sex = 'F' then 'female'
else 'purple'
END
) as image,
COALESCE(char_length(indiv_text.occutext),0) as char_size


FROM
indiv

LEFT JOIN indiv_dist ON indiv.indiv_id = indiv_dist.indiv_id

LEFT JOIN indiv_text ON indiv_text.indiv_id = indiv_dist.indiv_id

WHERE

indiv.indiv_id = '".$source."'

OR

indiv.indiv_id IN (

SELECT DISTINCT
source

FROM
edges
WHERE
source = '".$source."'

or

target = '".$source."'
)

OR

indiv.indiv_id IN (

SELECT DISTINCT
target

FROM
edges
WHERE
source = '".$source."'

or

target = '".$source."'
)

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
		echo '"size": '.$s[6].',';
		echo '"color": "'.$s[7].'",';
		echo '"image": "'.$s[8].'",';
		echo '"charsize": '.$s[9].'';
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
source = '".$source."'

or

target = '".$source."'

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

$sql = "

SELECT string_agg('{\"name\": \"'||fullname||'\", \"id\": \"'||indiv_id||'\",\"distance\": '||cost||'}',',') FROM KDijkstra_dist_sp
     ('
     SELECT
recno as id,
(substr(source, 2, length(source) - 1))::integer as source,
(substr(target, 2, length(target) - 1))::integer as target,
1::double precision as cost

         FROM edges',
         (substr('".$source."', 2, length('".$source."') - 1))::integer, '{12144,9524,15189,25819,7462,7674}',
         false,false
     )

     LEFT JOIN indiv ON indiv.indiv_id = 'I'||vertex_id_target
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
echo '"smallworld": [';
	while ($row = pg_fetch_row($result)) {
	  	echo $row[0];
	}

echo "]}";

pg_close($link);
?>