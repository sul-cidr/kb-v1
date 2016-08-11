<?php

header('Content-Type: text/html; charset=utf-8');
$source = $_GET['s'];
$qType = $_GET['q'];

$link = pg_connect("host=orbis-prod.stanford.edu dbname=kindred user=webapp password=sl1ppy");

$sql="

WITH o as (
SELECT indiv.indiv_id FROM indiv WHERE indiv.indiv_id IN (".$source.")

LIMIT 100

)

SELECT

'{\"type\": \"Feature\", \"geometry\": '||
ST_AsGeoJson(st_simplify((s_uk4326.geom),.01),3,0)
||', \"properties\": {\"name\": \"'||s_uk4326.admin_name||
'\",\"gid\": '||s_uk4326.gid||
',\"total\":'||
COUNT(*)||
',\"when\": '||AVG(COALESCE(event.year,event.year_abt,event.year_est,indiv.birthyear,indiv.birth_abt,indiv.best))||
',\"who\": ['||string_agg('\"'||indiv.indiv_id||'\"',',')||
'],\"type\": \"fill\"}}'

FROM

event,
indiv,
place

LEFT JOIN s_uk4326 ON LOWER(COALESCE(s_uk4326.gmi_admin2,s_uk4326.admin_name)) = LOWER(COALESCE(place.admin2,ccode))

WHERE

event.indiv_id IN (

SELECT indiv_id FROM o

)

AND

event.place_id IS NOT NULL

AND

place.placeid = event.place_id

AND

(
place.admin2 IS NOT NULL

OR

place.ccode IS NOT NULL
)

AND

indiv.indiv_id = event.indiv_id

AND

s_uk4326.admin_name IS NOT NULL

GROUP BY
s_uk4326.gid,
s_uk4326.admin_name,
s_uk4326.gmi_admin2,
s_uk4326.geom

ORDER BY
gmi_admin2


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
	$lastobjectid = 0;
	while ($row = pg_fetch_row($result)) {
	  	array_push($tough, $row);
	}
	$t = 0;
	$id_hash = array();

	$b = 0;
echo '{
    "type": "FeatureCollection",
    "features": [
        ';
foreach($tough as $s){
	  	$t++;
		echo $s[0];
		if(count($tough) <> $t) {
		echo ",";
		}

}

echo "]
}";

pg_close($link);
?>