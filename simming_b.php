<?php
$count = 0;
// display errors or not...

$link = pg_connect("host=orbis-prod.stanford.edu dbname=kindred user=elijah password=pog55ger");

for($i=1; $i<=1000; $i++){
$sql = "
WITH o AS
(

WITH n AS
(SELECT indiv_id FROM indiv WHERE indiv.indiv_id NOT IN (SELECT indiv_id FROM new_sims) ORDER BY indiv_id asc LIMIT 1)

SELECT
indiv_dist.indiv_id,
t.indiv_id as target

FROM

indiv_dist
LEFT JOIN indiv on indiv.indiv_id = indiv_dist.indiv_id,
indiv_dist as t
LEFT JOIN indiv as t_bio ON t_bio.indiv_id = t.indiv_id

WHERE
indiv_dist.indiv_id IN (SELECT indiv_id FROM n)

AND

(
indiv_dist.indiv_id = t.indiv_id
OR

(
COALESCE(t_bio.deathyear,t_bio.death_abt,t_bio.dest) > (COALESCE(indiv.birthyear,indiv.birth_abt,indiv.best) + 18)

AND

(COALESCE(t_bio.birthyear,t_bio.birth_abt,t_bio.best) + 18) < (COALESCE(indiv.deathyear,indiv.death_abt,indiv.dest))
)
)
ORDER BY

ABS((indiv_dist.parentless - t.parentless)::numeric) / 13 +
(CASE
WHEN indiv_dist.indiv_id = t.indiv_id then 100
else 0
END
) +
(
CASE
WHEN (indiv_dist.odnb + t.odnb) = 0 then (-.5)
else LEAST(2,ABS(((indiv_dist.odnb - t.odnb)::numeric) / 10))
END
) +
LEAST(2,(ABS((indiv_dist.inbred - t.inbred)::numeric) / 2.5)) +
LEAST(3,(ABS(indiv_dist.tragedy - t.tragedy)::numeric)) +
LEAST(3,(ABS(indiv_dist.centrality - t.centrality)::numeric)) +
LEAST(2,(ABS(indiv_dist.children - t.children)::numeric / 3)) +
LEAST(2,(ABS(indiv_dist.marriage - t.marriage)::numeric))
-((SELECT COUNT(*) FROM p_shared_occu(indiv_dist.indiv_id,t.indiv_id))::numeric * 2)
-((SELECT COUNT(*) FROM p_shared_place(indiv_dist.indiv_id,t.indiv_id))::numeric * .5)

LIMIT 15
)

INSERT INTO new_sims
SELECT
indiv_id,
array_agg(target) as sim_id

FROM
o
GROUP BY indiv_id
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
		echo("I".$iid.";");
	  	echo($row[0]);
	  	echo(";");
	  	echo($row[1]);
	  	echo(";");
	  	echo($row[2]);
	  	echo(";");
		echo("<br>");
	}
}
pg_close($link);
?>