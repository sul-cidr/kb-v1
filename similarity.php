<?php
$indiv = $_GET['i'];
$year = $_GET['y'];
$count = 0;
// display errors or not...

$link = pg_connect("host=orbis-prod.stanford.edu dbname=kindred user=webapp password=sl1ppy");

$sql = "
with listed AS
(
with orderedby AS 
(
select
indiv.indiv_id,
'{\"indiv_id\": \"'||indiv.indiv_id||'\",\"indiv_name\": \"'||indiv.fullname||'\", \"fullname\": \"'||REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE((COALESCE(''||period_text,year_est::character varying||' (estimated)','')),'BEF','Before'),'AFT','After'),'BET','between'),'FROM','From'),'ABT','About'),'AND','and')||' &mdash; '||REPLACE(event.label,'\"','\\\"')||' '||COALESCE('('||event.place||')','')||' '||'\",\"notes\": \"'||REPLACE(COALESCE(event.notes,''),'\"','\\\"')||' '
||'\", \"unixsort\": '||
COALESCE(
extract(epoch FROM event_date),
extract(epoch FROM to_timestamp(COALESCE(year,year_abt,year_est)::character varying, 'YYYY')),
1388563200
)||',\"byear\": '||
COALESCE(year,year_abt,year_est,indiv.birthyear, indiv.birth_abt, indiv.best)||', \"dyear\": '||
@(COALESCE(year,year_abt,year_est,indiv.birthyear,indiv.birth_abt,indiv.best) - 1700)||'}' as content

from sims

LEFT JOIN indiv ON indiv.indiv_id = ANY(sims.sim_id)
LEFT JOIN particip ON particip.actor_id = indiv.indiv_id
LEFT JOIN event ON event.recno = particip.event_id 

WHERE 

sims.indiv_id = '".$indiv."'
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
REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE((COALESCE(''||period_text,year_est::character varying||' (estimated)','')),'BEF','Before'),'AFT','After'),'BET','Between'),'FROM','From'),'ABT','About'),'AND','and')||' &mdash; '||REPLACE(event.label,'\"','\\\"')||' '||COALESCE('('||event.place||')','')||' '
||'\",\"notes\": \"'||REPLACE(COALESCE(event.notes,''),'\"','\\\"')||' '
||'\", \"unixsort\": '||
COALESCE(
extract(epoch FROM event_date),
extract(epoch FROM to_timestamp(COALESCE(year,year_abt,year_est)::character varying, 'YYYY')),
1388563200
)||',\"byear\": '||
COALESCE(year,year_abt,year_est,9999)||'}' as content

FROM

particip,
event

WHERE particip.actor_id = '".$indiv."'

AND

event.recno = particip.event_id

AND

event.type <> 'RESI'

AND

event.type <> 'EDUC'

AND
(
    event.period_text IS NOT NULL
    
    OR
    
    event.type = 'OCCU'
)

ORDER BY
COALESCE(year,year_abt,year_est) ASC
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
'{\"id\": \"'||indiv.indiv_id||'\",\"gender\": \"'||indiv.sex||'\",\"birthyear\": '||COALESCE(indiv.birthyear, indiv.birth_abt, indiv.best)||',\"deathyear\": '||COALESCE(indiv.deathyear, indiv.death_abt, indiv.dest)||',\"name\": \"'||COALESCE(indiv.surn,'')||'\",\"fullname\": \"'||COALESCE(indiv.fullname,'')||'\", '||COALESCE('\"suffix\": \"'||indiv.nsfx||'\",','')||COALESCE('\"prefix\": \"'||indiv.npfx||'\",','')||'\"inbred\": '||indiv_dist.inbred||', \"tragedy\": '||indiv_dist.tragedy||', \"trarray\": '||indiv_dist.trarray||', \"centrality\": '||indiv_dist.centrality||', \"odnb\": '||indiv_dist.odnb||', \"marriage\": '||indiv_dist.marriage||', \"children\": '||indiv_dist.children||', \"depth\": '||indiv_dist.parentless||',\"firstname\": \"'||indiv.givn||'\", \"occu\": ['||
COALESCE((SELECT string_agg('\"'||indiv_occu.occu||'\"',',') FROM indiv_occu WHERE indiv_occu.indiv_id IN ('".$indiv."')),'\"unknown occupation\"')||']}'

FROM

indiv
LEFT JOIN indiv_dist ON indiv_dist.indiv_id = indiv.indiv_id

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
echo ",";

$sql = "
SELECT

COALESCE('\"imagepath\": \"'||path||'\",','')

FROM

indiv_image

LEFT JOIN imagepath ON imagepath.image_id = indiv_image.image_id

WHERE indiv_id = '".$indiv."'

LIMIT 1
"
;

if (!$link) {
    echo "error, didn't make the pg_connect()";
} else {
  $result = pg_query($link,$sql);
	while ($row = pg_fetch_row($result)) {
	  	echo $row[0];
	}
}


$sql = "
WITH o as 
(
SELECT fullname, indiv_id, cost FROM KDijkstra_dist_sp
     ('
     SELECT
recno as id,
(substr(source, 2, length(source) - 1))::integer as source,
(substr(target, 2, length(target) - 1))::integer as target,
1::double precision as cost

         FROM edges',
         (substr('".$indiv."', 2, length('".$indiv."') - 1))::integer, '{
2491,
2481,
1284,
1298,
1269,
2248,
2278,
26969,
3601,
1807,
2774,
18250,
2777,
2367,
3757,
1797,
27325,
26992,
17762,
5558,
17652,
3587,
28327,
2967,
27278,
4399,
4424,
28149,
1787,
3012,
15189,
8803,
4918,
6679,
4437,
1339,
3884,
9982,
6719,
7901,
1735,
10477,
6842,
1668,
14576,
5382,
26116,
27495,
5457,
23668,
26113,
7999,
5804,
9190,
26218,
10762,
1511,
18743,
17628,
8838,
6877,
27821,
17777,
23697,
1889,
18667,
1952,
9417,
6163,
25664,
19233,
5805,
7619,
2007,
28778,
24214,
9287,
21391,
75,
27735,
8310,
25056,
12438,
4334,
4852,
16880,
4369,
4994,
17347,
8346,
26731,
957,
10834,
17428,
24963,
7462,
9997,
12922,
12220,
7733,
12144,
25819,
7677,
14707,
3920,
14698,
3509,
8284,
7570,
28856,
16725,
9524,
20490,
22141,
15627,
6072,
10986,
10536,
22851,
2053,
10034,
29012,
6525,
26810,
13890,
6782,
29464,
28590,
19924,
10864,
12718,
10769,
19857,
25981,
9152,
10054,
7651,
10306,
2135,
9669,
20562,
9394,
30264,
7674,
6740,
29036,
30169,
23160,
29977,
5821,
28692,
10701,
8068,
6331,
6142,
27715,
16289,
662,
21063,
23880,
15645,
22760,
22758,
5,
23175,
15361,
6431,
10088,
2105,
13636,
23111,
29102,
6268,
9110,
27868,
9048
}',
         false,false
     )

     LEFT JOIN indiv ON indiv.indiv_id = 'I'||vertex_id_target

	WHERE cost > 0

     ORDER BY
     cost

     LIMIT 5
     )

     SELECT string_agg('{\"name\": \"'||fullname||'\", \"id\": \"'||indiv_id||'\",\"distance\": '||cost||'}',',') FROM o

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

echo "]";
  
echo "}";

pg_close($link);
?>