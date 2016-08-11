<?php
$indiv = $_GET['i'];
$year = $_GET['y'];
$count = 0;
// display errors or not...

$link = pg_connect("host=orbis-dev.stanford.edu dbname=kindred user=elijah password=pog55ger");

$sql = "
with listed AS
(
with orderedby AS 
(
select
p_likeme2.indiv_id,
'{\"indiv_id\": \"'||p_likeme2.indiv_id||'\", \"fullname\": \"'||
COALESCE(date_part('year',mean_time(event.event_period)),(p_likeme2.byear + p_likeme2.byear)/2)||' - '||substring(event.label from 0 for 60)||'... '||p_likeme2.fullname
||'\", \"byear\": '||
COALESCE(date_part('year',mean_time(event.event_period)),(p_likeme2.byear + p_likeme2.byear)/2)||', \"dyear\": '||
@(COALESCE(date_part('year',mean_time(event.event_period)),(p_likeme2.byear + p_likeme2.byear)/2) - ".$year.")||'}' as content


from p_likeme2('".$indiv."','".$year."')
LEFT JOIN event ON event.indiv_id = p_likeme2.indiv_id 

WHERE 

COALESCE(date_part('year',mean_time(event.event_period)),(p_likeme2.byear + p_likeme2.byear)/2) < ".$year."

AND

p_likeme2.indiv_id NOT IN ('".$indiv."')


ORDER BY

sqdiffs,
 p_likeme2.indiv_id, @(COALESCE(date_part('year',mean_time(event.event_period)),(p_likeme2.byear + p_likeme2.byear)/2) - ".$year.") + @(COALESCE(date_part('year',mean_time(event.event_period)),(p_likeme2.byear + p_likeme2.byear)/2) - ".$year.") / 500 ASC

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
WITH w as
(SELECT

'{\"fullname\": \"'||
COALESCE(date_part('year',mean_time(event.event_period)),0)||' - '||substring(event.label from 0 for 60)||'... '
||'\", \"byear\": '||
COALESCE(date_part('year',mean_time(event.event_period)),9999)||'}' as content

FROM

event

WHERE indiv_id = '".$indiv."'

ORDER BY
date_part('year',mean_time(event.event_period)) ASC
)

SELECT
'['||string_agg(content,',')||']'

FROM
w"
;

echo '"events": ';
if (!$link) {
    echo "error, didn't make the pg_connect()";
} else {
  $result = pg_query($link,$sql);
	while ($row = pg_fetch_row($result)) {
	  	echo $row[0];
	}
}

$sql = "
SELECT
'{\"id\": \"'||indiv.indiv_id||'\",\"gender\": \"'||sex||'\", \"name\": \"'||surn||'\", \"firstname\": \"'||givn||'\", \"occu\": ['||
(SELECT string_agg('\"'||indiv_occu.occu||'\"',',') FROM indiv_occu WHERE indiv_occu.indiv_id IN ('".$indiv."'))||']}'

FROM

indiv

WHERE indiv.indiv_id = '".$indiv."'"
;

echo ',"indiv": ';
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