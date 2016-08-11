<?php
$indiv = $_GET['i'];
$year = $_GET['y'] + 0;
$yearBefore = $_GET['y'] - 50;
$count = 0;
$inputType = $_GET['q'];

$link = pg_connect("host=orbis-dev.stanford.edu dbname=kindred user=elijah password=pog55ger");

if ($inputType == "path") {
$sql = "
with listed AS
(
with orderedby AS 
(
 select
indiv.indiv_id,
'{\"indiv_id\": \"'||indiv.indiv_id||'\", \"fullname\": \"'||
COALESCE(date_part('year',first(event.event_period)),date_part('year',first(indiv.lifeperiod)))||' - '||substring(event.label from 0 for 60)||'... '||indiv.fullname
||'\", \"byear\": '||
COALESCE(date_part('year',first(event.event_period)),date_part('year',first(indiv.lifeperiod)))||', \"dyear\": '||
@(COALESCE(date_part('year',first(event.event_period)),date_part('year',first(indiv.lifeperiod))) - ".$year.")||'}' as content

from indiv,event
WHERE 
indiv.indiv_id IN (".$indiv.")
AND 
event.indiv_id = indiv.indiv_id

ORDER BY 
@(COALESCE(date_part('year',first(event.event_period)),
date_part('year',first(indiv.lifeperiod))) - '".$year."') ASC 

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
}

else if ($inputType == "name") {
$sql = "
with listed AS
(
with orderedby AS 
(
 select
indiv.indiv_id,
'{\"indiv_id\": \"'||indiv.indiv_id||'\", \"fullname\": \"'||
COALESCE(date_part('year',first(event.event_period)),date_part('year',first(indiv.lifeperiod)))||' - '||substring(event.label from 0 for 60)||'... '||indiv.fullname
||'\", \"byear\": '||
COALESCE(date_part('year',first(event.event_period)),date_part('year',first(indiv.lifeperiod)))||', \"dyear\": '||
@(COALESCE(date_part('year',first(event.event_period)),date_part('year',first(indiv.lifeperiod))) - ".$year.")||'}' as content

from indiv,event
WHERE 
indiv.surn = '".$indiv."'
AND 
event.indiv_id = indiv.indiv_id

ORDER BY 
@(COALESCE(date_part('year',first(event.event_period)),
date_part('year',first(indiv.lifeperiod))) - '".$year."') ASC 

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

}
else if ($inputType == "loc") {
$sql = "
with listed AS
(
with orderedby AS 
(
 select
indiv.indiv_id,
'{\"indiv_id\": \"'||indiv.indiv_id||'\", \"fullname\": \"'||
COALESCE(date_part('year',first(event.event_period)),date_part('year',first(indiv.lifeperiod)))||' - '||substring(event.label from 0 for 60)||'... '||indiv.fullname
||'\", \"byear\": '||
COALESCE(date_part('year',first(event.event_period)),date_part('year',first(indiv.lifeperiod)))||', \"dyear\": '||
@(COALESCE(date_part('year',first(event.event_period)),date_part('year',first(indiv.lifeperiod))) - ".$year.")||'}' as content

from indiv,event
WHERE 
event.indiv_id = indiv.indiv_id
AND 
COALESCE(date_part('year',first(event.event_period)),date_part('year',first(indiv.lifeperiod))) < ".$year." 
AND 
COALESCE(date_part('year',first(event.event_period)),date_part('year',first(indiv.lifeperiod))) > ".$yearBefore." 
AND
event.indiv_id in
(SELECT
indiv.indiv_id FROM
indiv,event,place,s_uk4326 
WHERE 
s_uk4326.gid = ".$indiv." 
AND 
event.indiv_id = indiv.indiv_id 
AND 
place.placeid = event.place_id 
AND 
LOWER(COALESCE(s_uk4326.gmi_admin2,s_uk4326.admin_name)) = LOWER(COALESCE(place.admin2,ccode)
)
)
ORDER BY 
@(COALESCE(date_part('year',first(event.event_period)),
date_part('year',first(indiv.lifeperiod))) - '".$year."') ASC 

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

}

else if ($inputType == "occ") {
$sql = "
with listed AS
(
with orderedby AS 
(
 select
indiv.indiv_id,
'{\"indiv_id\": \"'||indiv.indiv_id||'\", \"fullname\": \"'||
COALESCE(date_part('year',first(event.event_period)),date_part('year',first(indiv.lifeperiod)))||' - '||substring(event.label from 0 for 60)||'... '||indiv.fullname
||'\", \"byear\": '||
COALESCE(date_part('year',first(event.event_period)),date_part('year',first(indiv.lifeperiod)))||', \"dyear\": '||
@(COALESCE(date_part('year',first(event.event_period)),date_part('year',first(indiv.lifeperiod))) - ".$year.")||'}' as content

from indiv,event,indiv_occu,occu
WHERE 
occu.recno = ".$indiv." 
AND
occu.class = indiv_occu.occu
AND 
event.indiv_id = indiv.indiv_id
AND 
indiv.indiv_id = indiv_occu.indiv_id

ORDER BY 
@(COALESCE(date_part('year',first(event.event_period)),
date_part('year',first(indiv.lifeperiod))) - '".$year."') ASC 

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
}

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
if ($inputType == "name") {
$sql = "
SELECT
'{\"id\": \"'||9999||'\",\"gender\": \"Y\", \"firstname\": \"\", \"name\": \"".$indiv."\", \"occu\": []}'
"
;
}
else if ($inputType == "loc") {
$sql = "
SELECT

'{\"id\": \"'||9999||'\",\"gender\": \"Y\", \"firstname\": \"\", \"id\": \"".$indiv."\", \"name\": \"'||s_uk4326.admin_name||'\", \"occu\": []}'

FROM

s_uk4326

WHERE gid = ".$indiv
;
}
else if ($inputType == "path") {
$sql = "
SELECT
'{\"id\": \"'||9999||'\",\"gender\": \"Y\", \"firstname\": \"\", \"name\": \"Path\", \"occu\": []}'
";
}
else {
$sql = "
SELECT
'{\"id\": \"'||9999||'\",\"gender\": \"Y\", \"firstname\": \"\", \"name\": \"'||occu.class||'\", \"occu\": []}'

FROM

occu

WHERE
occu.recno = ".$indiv
;
}

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