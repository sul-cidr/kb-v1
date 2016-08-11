<?php
$indiv = $_GET['i'];
$year = $_GET['y'] + 0;
$queryType = $_GET['g'];

$link = pg_connect("host=orbis-dev.stanford.edu dbname=kindred user=elijah password=pog55ger");

$sql = "
WITH q as
(

WITH o as
(SELECT indiv.*,
COALESCE(indiv.birthyear, indiv.birth_abt, indiv.best) as cbirthyear,
COALESCE(indiv.deathyear, indiv.death_abt, indiv.dest) as cdeathyear,
COALESCE(indiv_events.particip_array,'[]') as particip_array FROM indiv
LEFT JOIN indiv_events ON indiv_events.indiv_id = indiv.indiv_id

WHERE

indiv.indiv_id IN (
SELECT indiv_id FROM indiv_occu LEFT JOIN occu ON occu.class = indiv_occu.occu WHERE occu.recno = '".$indiv."'
)
ORDER BY
@(COALESCE(indiv.birthyear, indiv.birth_abt, indiv.best) - ".$year.")

LIMIT 100
)

SELECT
'{\"lane\": '||(row_number()
OVER
(ORDER BY cbirthyear)) - 1||', \"name\": \"'||
fullname||'\",
\"id\": \"'||
indiv_id||'\", 
\"birthyear\": '||
cbirthyear||', \"end\": '||
cdeathyear||', \"relation\": '||
(
CASE
when cbirthyear < ".$year." then '\"darkblue\"'
when cbirthyear > ".$year." then '\"lightblue\"'
else '\"gray\"'
END
)
||',\"aevents\": '||particip_array||'}' as content

FROM

o

ORDER BY
cbirthyear

LIMIT 100
)

SELECT
'['||string_agg(content,',')||']'
FROM
q
";

if ($queryType == "name") {
$sql = "
WITH q as
(

WITH o as
(SELECT indiv.*,
COALESCE(indiv.birthyear, indiv.birth_abt, indiv.best) as cbirthyear,
COALESCE(indiv.deathyear, indiv.death_abt, indiv.dest) as cdeathyear,
COALESCE(indiv_events.particip_array,'[]') as particip_array FROM indiv
LEFT JOIN indiv_events ON indiv_events.indiv_id = indiv.indiv_id

WHERE

LOWER(indiv.surn) = LOWER('".$indiv."')

ORDER BY
@(COALESCE(indiv.birthyear, indiv.birth_abt, indiv.best) - ".$year.")

LIMIT 100
)

SELECT
'{\"lane\": '||(row_number()
OVER
(ORDER BY cbirthyear)) - 1||', \"name\": \"'||
fullname||'\",
\"id\": \"'||
indiv_id||'\", 
\"birthyear\": '||cbirthyear||', \"end\": '||cdeathyear||', \"relation\": '||
(
CASE
when cbirthyear < ".$year." then '\"darkblue\"'
when cbirthyear > ".$year." then '\"lightblue\"'
else '\"gray\"'
END
)
||',\"aevents\": '||particip_array||'}' as content

FROM

o

ORDER BY
cbirthyear

LIMIT 100
)

SELECT
'['||string_agg(content,',')||']'
FROM
q
";
}

if ($queryType == "path") {
$sql = "
WITH q as
(

WITH o as
(SELECT indiv.*,
COALESCE(indiv.birthyear, indiv.birth_abt, indiv.best) as cbirthyear,
COALESCE(indiv.deathyear, indiv.death_abt, indiv.dest) as cdeathyear,
COALESCE(indiv_events.particip_array,'[]') as particip_array FROM indiv
LEFT JOIN indiv_events ON indiv_events.indiv_id = indiv.indiv_id

WHERE

indiv.indiv_id IN (".$indiv.")

ORDER BY
@(COALESCE(indiv.birthyear, indiv.birth_abt, indiv.best) - ".$year.")

LIMIT 100
)

SELECT
'{\"lane\": '||(row_number()
OVER
(ORDER BY cbirthyear)) - 1||', \"name\": \"'||
fullname||'\",
\"id\": \"'||
indiv_id||'\", 
\"birthyear\": '||cbirthyear||', \"end\": '||cdeathyear||', \"relation\": '||
(
CASE
when cbirthyear < ".$year." then '\"darkblue\"'
when cbirthyear > ".$year." then '\"lightblue\"'
else '\"gray\"'
END
)
||',\"aevents\": '||particip_array||'}' as content

FROM

o

ORDER BY
cbirthyear

LIMIT 100
)

SELECT
'['||string_agg(content,',')||']'
FROM
q
";
}

if ($queryType == "loc") {
$sql = "
WITH q as
(

WITH o as
(SELECT indiv.*,
COALESCE(indiv.birthyear, indiv.birth_abt, indiv.best) as cbirthyear,
COALESCE(indiv.deathyear, indiv.death_abt, indiv.dest) as cdeathyear,
COALESCE(indiv_events.particip_array,'[]') as particip_array FROM indiv
LEFT JOIN indiv_events ON indiv_events.indiv_id = indiv.indiv_id

WHERE

indiv.indiv_id IN (
SELECT
indiv.indiv_id FROM

indiv,event,place,s_uk4326 
WHERE 
s_uk4326.gid = ".$indiv." 
AND 
event.indiv_id = indiv.indiv_id 
AND 
place.placeid = event.place_id 
AND 
LOWER(COALESCE(s_uk4326.gmi_admin2,s_uk4326.admin_name)) = LOWER(COALESCE(place.admin2,ccode)) 
)
ORDER BY
@(COALESCE(indiv.birthyear, indiv.birth_abt, indiv.best) - ".$year.")

LIMIT 100
)

SELECT
'{\"lane\": '||(row_number()
OVER
(ORDER BY cbirthyear)) - 1||', \"id\": \"'||
indiv_id||'\",
\"name\": \"'||
fullname||'\", 
\"birthyear\": '||
cbirthyear||', \"end\": '||
cdeathyear||', \"relation\": '||
(
CASE
when cbirthyear < ".$year." then '\"darkblue\"'
when cbirthyear > ".$year." then '\"lightblue\"'
else '\"gray\"'
END
)
||',\"aevents\": '||particip_array||'}' as content

FROM

o

ORDER BY
cbirthyear

LIMIT 100
)

SELECT
'['||string_agg(content,',')||']'
FROM
q
";
}

if ($queryType == "gen") {
$sql = 
"WITH q as
(
SELECT DISTINCT ON (COALESCE(indiv.birthyear, indiv.birth_abt, indiv.best),indiv.indiv_id)
'{\"lane\": '||(row_number()
OVER
(ORDER BY COALESCE(indiv.birthyear, indiv.birth_abt, indiv.best))) - 1||', \"name\": \"'||
fullname||'\",
\"id\": \"'||
indiv.indiv_id||'\", 
\"birthyear\": '||
COALESCE(indiv.birthyear, indiv.birth_abt, indiv.best)||', \"end\": '||
COALESCE(indiv.deathyear, indiv.death_abt, indiv.dest)||', \"relation\": '||
(
CASE
when COALESCE(indiv.birthyear, indiv.birth_abt, indiv.best) < 1731 AND edges.relation = 'childOf' then '\"darkblue\"'
when COALESCE(indiv.birthyear, indiv.birth_abt, indiv.best) > 1731 AND edges.relation = 'childOf' then '\"lightblue\"'
when edges.relation = 'siblingOf' then '\"red\"'
when edges.relation = 'spouseOf' then '\"green\"'
else '\"gray\"'
END
)
||',\"aevents\": '||indiv_events.particip_array||'}' as content

FROM

indiv

LEFT JOIN indiv_events ON indiv_events.indiv_id = indiv.indiv_id
LEFT JOIN edges ON (edges.source = '".$indiv."' AND edges.target = indiv.indiv_id) OR (edges.source = indiv.indiv_id AND edges.target = '".$indiv."') 

WHERE

indiv.indiv_id IN (
SELECT p_twogens('".$indiv."')
)

ORDER BY
COALESCE(indiv.birthyear, indiv.birth_abt, indiv.best),
indiv.indiv_id

LIMIT 30
)

SELECT
'['||string_agg(content,',')||']'
FROM
q";
}

if (!$link) {
    echo "error, didn't make the pg_connect()";
} else {
  $result = pg_query($link,$sql);
	while ($row = pg_fetch_row($result)) {
	  	echo $row[0];
	}
}

pg_close($link);
?>