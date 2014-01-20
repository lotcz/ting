<?php
	
		$id = $_GET['id'];
		$x = $_GET['x'];
		$y = $_GET['y'];
		
		$db = mysql_connect('localhost','root','') or die('Cannot connect to DB.');
		mysql_select_db('multi',$db) or die('Cannot select catalog \'multi\'.');
			
		mysql_query("CREATE TABLE IF NOT EXISTS players
					(id INT NOT NULL AUTO_INCREMENT, x INT, y INT, PRIMARY KEY (id), INDEX USING HASH (id))
					ENGINE = MEMORY;", $db );

		if ($id == 0) {
			mysql_query("INSERT INTO players (x, y) VALUES ($x, $y);", $db );
			$id = mysql_insert_id();
		} else {
			mysql_query("UPDATE players SET x = $x, y = $y WHERE id = $id;", $db );
		}
		
		$result = mysql_query( "SELECT * FROM players WHERE id <> $id;", $db);
		$players = array();
		if(mysql_num_rows($result)) {
			while($p = mysql_fetch_assoc($result)) {
				$players[] = $p;
			}
		}
			
		header('Content-type: application/json');
		echo json_encode(array('players'=>$players, 'id'=>$id));

?>
