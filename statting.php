<?php
$count = 0;
// display errors or not...

include("conn.php");
$link = pg_connect($connection_string);

$sql = "
with P as (
WITH o AS (

SELECT

indiv_occu.occu as main,
target.occu as target,
(CASE
when relation = 'siblingOf' then 'Sibling'
when relation = 'spouseOf' then 'Spouse'
when indiv_occu.indiv_id = edges.source then 'Child'
else 'Parent'
END
) as reltype,
count(*)::integer as tartotal

FROM

indiv_occu,
edges,
indiv_occu as target

WHERE

indiv_occu.indiv_id IN (edges.source,edges.target)
AND
edges.relation <> 'selfLoop'

AND target.indiv_id IN (edges.source,edges.target)
AND
target.indiv_id <> indiv_occu.indiv_id

GROUP BY
indiv_occu.occu,
(CASE
when relation = 'siblingOf' then 'Sibling'
when relation = 'spouseOf' then 'Spouse'
when indiv_occu.indiv_id = edges.source then 'Child'
else 'Parent'
END
),
target.occu

ORDER BY
indiv_occu.occu,
(CASE
when relation = 'siblingOf' then 'Sibling'
when relation = 'spouseOf' then 'Spouse'
when indiv_occu.indiv_id = edges.source then 'Child'
else 'Parent'
END
),
count(*) DESC
)

SELECT
'\"'||o.main||
'\": {\"total\": '||
COUNT(DISTINCT indiv_occu.indiv_id)::integer||',\"stats\": ['||
string_agg(DISTINCT '{\"type\": \"'||o.target||
'\",\"amount\": '||
o.tartotal||',\"relation\": \"'||o.reltype||'\"}',',')
||']}' AS content
FROM
o,
indiv_occu

WHERE o.main = indiv_occu.occu

GROUP BY
o.main
)
select
'{'||string_agg(content,',')||'}'
FROM
p
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
	  	echo($row[0]);
	}

pg_close($link);
?>