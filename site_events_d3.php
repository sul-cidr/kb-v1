<?php
$indiv = $_GET['i'];
$year = $_GET['y'] + 50;
$yearBefore = $_GET['y'] - 50;
$count = 0;

include("conn.php");
$link = pg_connect($connection_string);

$sql = "
with listed AS
(
with orderedby AS 
(
 select
indiv.indiv_id,
'{\"indiv_id\": \"'||indiv.indiv_id||'\", \"fullname\": \"'||
COALESCE(date_part('year',mean_time(event.event_period)),date_part('year',mean_time(indiv.lifeperiod)))||' - '||substring(event.label from 0 for 60)||'... '||indiv.fullname
||'\", \"byear\": '||
COALESCE(date_part('year',mean_time(event.event_period)),date_part('year',mean_time(indiv.lifeperiod)))||', \"dyear\": '||
@(COALESCE(date_part('year',mean_time(event.event_period)),date_part('year',mean_time(indiv.lifeperiod))) - ".$year.")||'}' as content

from indiv,event,place,s_uk4326 
WHERE 
s_uk4326.gid = ".$indiv." 
AND 
event.indiv_id = indiv.indiv_id 
AND 
place.placeid = event.placeid 
AND 
LOWER(COALESCE(s_uk4326.gmi_admin2,s_uk4326.admin_name)) = LOWER(COALESCE(place.admin2,ccode)) 
AND 
COALESCE(date_part('year',mean_time(event.event_period)),date_part('year',mean_time(indiv.lifeperiod))) < ".$year." 
AND 
COALESCE(date_part('year',mean_time(event.event_period)),date_part('year',mean_time(indiv.lifeperiod))) > ".$yearBefore." 

ORDER BY 
@(COALESCE(date_part('year',mean_time(event.event_period)),
date_part('year',mean_time(indiv.lifeperiod))) - '".$year."') ASC 

OFFSET 1 limit 15
)

SELECT DISTINCT ON (orderedby.indiv_id)
content
FROM

orderedby

LIMIT 15
)

SELECT

string_agg(content,',')

FROM
listed";

echo '{"nodes": [';
if (!$link) {
    echo "error, didn't make the pg_connect()";
} else {
  $result = pg_query($link,$sql);
	while ($row = pg_fetch_row($result)) {
	  	echo $row[0];
	}
}
  
echo "],";


$sql = "
SELECT
'{\"id\": \"'||s_uk4326.gid||'\",\"gender\": \"Y\", \"name\": \"'||admin_name||'\", \"occu\": []}'

FROM

s_uk4326

WHERE
s_uk4326.gid = ".$indiv
;

echo '"indiv": ';
if (!$link) {
    echo "error, didn't make the pg_connect()";
} else {
  $result = pg_query($link,$sql);
	while ($row = pg_fetch_row($result)) {
	  	echo $row[0];
	}
}
  
echo "}";

pg_close($link);
?>