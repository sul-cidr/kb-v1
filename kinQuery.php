<?php

header('Content-Type: text/html; charset=utf-8');
$source = $_GET['s'];
$qType = $_GET['q'];

$link = pg_connect("host=orbis-prod.stanford.edu dbname=kindred user=webapp password=sl1ppy");

$sqlsuffix ="

select DISTINCT 

indiv.indiv_id,
indiv.sex,
COALESCE(indiv.npfx||' ','')||indiv.fullname as fullname,
COALESCE(parentless,0),
COALESCE(indiv.birthyear, indiv.birth_abt, indiv.best) as yearb,
COALESCE(indiv.deathyear, indiv.death_abt, indiv.dest) as yeard,
16 as size,
(CASE
when sex = 'M' then 'palegreen'
when sex = 'F' then 'orchid'
else 'purple'
END
) as color,
(CASE
when indiv.sex = 'M' then 'male'
when indiv.sex = 'F' then 'female'
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

indiv.indiv_id IN (
SELECT indiv_id FROM o
)

GROUP BY
indiv.indiv_id,
sex,
fullname,
COALESCE(parentless,0),
COALESCE(indiv.birthyear, indiv.birth_abt, indiv.best),
COALESCE(indiv.deathyear, indiv.death_abt, indiv.dest),
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

ORDER BY
COALESCE(indiv.birthyear, indiv.birth_abt, indiv.best)
"
;

$sqlo="
WITH o as
(
SELECT
p_twogens as indiv_id FROM
p_twogens('".$source."')
)
";

if ($qType == "list") {
$sqlo="
WITH

o

AS
(
SELECT indiv_id FROM indiv WHERE indiv_id IN (".$source.")
)
";
}

if ($qType == "lum") {
$sqlo="
WITH o as
(SELECT indiv.* FROM indiv WHERE

REPLACE(indiv.indiv_id,'I','')::integer IN 
(
2248,
2263,
26969,
2346,
2373,
2777,
1797,
27325,
26992,
5558,
3587,
2967,
27278,
28149,
1787,
3012,
15189,
4437,
7901,
5457,
26113,
7999,
5804,
10762,
17628,
27821,
1889,
9417,
19233,
2007,
28778,
24214,
21391,
75,
12432,
4852,
4994,
24963,
7462,
9997,
12144,
25819,
7677,
3920,
3509,
8284,
9524,
20490,
22141,
10986,
2053,
29012,
6525,
26810,
6782,
19924,
12718,
9152,
2135,
7674,
5821,
28692,
27715,
21063,
22760,
5,
23175,
15361,
2105,
6268,
27868,
1976,
9048,
13754
)
)";
}


if ($qType == "loc") {
$sqlo="
WITH o as
(SELECT indiv.*

FROM indiv

WHERE

indiv.indiv_id IN (
SELECT
indiv.indiv_id FROM

indiv,event,place,s_uk4326 
WHERE 
s_uk4326.gid = ".$source." 
AND 
event.indiv_id = indiv.indiv_id 
AND 
place.placeid = event.place_id 
AND 
LOWER(COALESCE(s_uk4326.gmi_admin2,s_uk4326.admin_name)) = LOWER(COALESCE(place.admin2,ccode)) 
)

LIMIT 100
)
"
;
}

if ($qType == "occ") {
$sqlo="
WITH o as
(SELECT indiv.* FROM indiv WHERE

indiv.indiv_id IN (

SELECT indiv_id FROM indiv_occu LEFT JOIN occu ON occu.class = indiv_occu.occu WHERE occu.recno = '".$source."'

)

LIMIT 100
)
"
;
}

if ($qType == "name") {
$sqlo="
WITH o as
(SELECT indiv.* FROM indiv WHERE

indiv.indiv_id IN (

SELECT indiv_id FROM indiv WHERE LOWER(indiv.surn) = LOWER('".$source."')

)

LIMIT 100
)
"
;
}

$sql = $sqlo . $sqlsuffix;

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

	$id_list = '';

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
		$id_list .= "'".$s[0]."'";
		if($t <> $r) {
		$id_list .= ",";
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
source IN (".$id_list.")

AND

target IN (".$id_list.")

AND

relation <> 'selfLoop'

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
         (substr('I5906', 2, length('I5906') - 1))::integer, '{12144,9524,15189,25819,7462,7674}',
         false,false
     )

     LEFT JOIN indiv ON indiv.indiv_id = 'I'||vertex_id_target
";


$new_id_list = str_replace("'","",$id_list);

$sql = "

SELECT
string_agg('{\"activity\": '||'\"'||uber||'\",\"total\": '||count||'}', ',')

FROM

public.p_arrayoccu('{".$new_id_list."}')

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