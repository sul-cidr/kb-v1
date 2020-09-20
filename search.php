<?php

$searchString = $_GET['s'];
$year = $_GET['y'];
$yearend = $_GET['ye'];
$occString = $_GET['o'];
$geoString = $_GET['g'];


$count = 0;
// display errors or not...

include("conn.php");
$link = pg_connect($connection_string);

$geoResults = '';

if (strlen($geoString) > 2) {
    $sqlGeoName = "
SELECT
admin_name as r

FROM s_uk4326,
to_tsquery(replace('".$geoString."',' ','|')) query

WHERE
query @@ s_uk4326.search

ORDER BY
ts_rank_cd(s_uk4326.search, query, 10) + (CASE when lower('".$geoString."') LIKE lower(s_uk4326.admin_name) then 1 else 0 END) DESC

LIMIT 1";

if (!$link) {
    echo "error, didn't make the pg_connect()";
}
else {
  $result = pg_query($link,$sqlGeoName);
	while ($row = pg_fetch_row($result)) {
      	$geoResults = '"placename": "' . $row[0] .'",';
	}
}

}

$sql = "

WITH list as (";

if (strlen($geoString) > 2) {
    $sql .= "
    with p as 
(
with o as
(
SELECT
COALESCE(gmi_admin2, admin_name) as r

FROM s_uk4326,
to_tsquery(replace('".$geoString."',' ','|')) query

WHERE
query @@ s_uk4326.search

ORDER BY
ts_rank_cd(s_uk4326.search, query, 10) + (CASE when lower('".$geoString."') LIKE lower(s_uk4326.admin_name) then 1 else 0 END) DESC

LIMIT 1
)

SELECT DISTINCT
event.indiv_id
FROM

o

LEFT JOIN place ON LOWER(o.r) = LOWER(COALESCE(place.admin2,place.ccode))
LEFT JOIN event on event.place_id = place.placeid
)";
}

$sql .= "SELECT 
'{\"id\": \"'||indiv.indiv_id||'\", \"name\": \"'||
givn||' '||COALESCE(' '||spfx||' ','')||
surn||'\", \"gender\": \"'||
sex||'\", \"birthyear\": '||
COALESCE(birthyear,birth_abt,best,0)||', \"end\": '||
COALESCE(deathyear,death_abt,dest,0)||', \"occupation\": \"'||
COALESCE(string_agg('<img src=\\\"r/icons/'||REPLACE(indiv_occu.occu,' ','_')||'.png\\\" title=\\\"'||indiv_occu.occu||'\\\" height=\\\"10\\\" width=\\\"10\\\">' ,' '),'<img src=\\\"r/icons/unknown.png\\\" height=\\\"10\\\" width=\\\"10\\\">')||'\", \"rank\": '||
ts_rank_cd(indiv.search_names, query, 32 /* rank/(rank+1) */ )::numeric(5,2) + 
(
CASE
when indiv.odnb = 0 then .04 + COALESCE((indiv_dist.odnb_wordcount / 37543), 0)
else 0
END
)+
COALESCE((count(indiv_occu.occu) * .0025),0)||'}' AS content
FROM to_tsquery(replace(unaccent('".$searchString."'),' ','|')) query,indiv
LEFT JOIN indiv_occu ON indiv_occu.indiv_id = indiv.indiv_id
LEFT JOIN indiv_dist ON indiv_dist.indiv_id = indiv.indiv_id
WHERE

COALESCE(birthyear,birth_abt,best,0) >= ".$year."

AND

COALESCE(birthyear,birth_abt,best,0) <= ".$yearend."

";

if (strlen($searchString) > 2) {

$sql .= "
AND

query @@ indiv.search_names
";
}


if (strlen($geoString) > 2) {
    $sql .= "
    AND

indiv.indiv_id in (SELECT indiv_id from p)

";
}

if (strlen($occString) > 2) {
    $sql .= "
    AND

indiv.indiv_id in (

SELECT DISTINCT

indiv_id

FROM

indiv_occu

LEFT JOIN
occu ON class = indiv_occu.occu

WHERE

occu.recno IN (".$occString.")
)";
}

$sql .=
"

GROUP BY
indiv.indiv_id,
givn,
surn,
sex,
query.query,
indiv_dist.odnb_wordcount

ORDER BY ts_rank_cd(indiv.search_names, query, 32 /* rank/(rank+1) */ ) + 
(
CASE
when indiv.odnb = 0 then .04 + COALESCE((indiv_dist.odnb_wordcount / 37543),0)
else 0
END
) +
COALESCE((count(indiv_occu.occu) * .0025),0) DESC
LIMIT 100

)
SELECT
'\"searchResults\": ['
||string_agg(content, ',')||']}' from list
";


if (!$link) {
    echo "error, didn't make the pg_connect()";
} else {
  $result = pg_query($link,$sql);
	while ($row = pg_fetch_row($result)) {
	    if(strlen($row[0]) > 5) {
	  	echo '{'.$geoResults.$row[0];
	    }
	    else {
		echo "[{\"id\": \"0\", \"name\": \"No results\", \"gender\": \"M\", \"birthyear\": 0, \"end\": 0, \"occupation\": \"<img src=\\\"r/icons/unknown.png\\\" title=\\\"Unknown Profession\\\" height=\\\"10\\\" width=\\\"10\\\">\", \"rank\": 0.0}]";
	    }
	}
}

pg_close($link);
?>