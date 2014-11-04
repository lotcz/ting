<?php

	function _get($name) {
		return isset($_GET[$name]) ? $_GET[$name] : (isset($_POST[$name]) ? $_POST[$name] : null);
	}
	
	header('Content-type: application/json');
	$id = _get('id');
	$op = _get('op');
	$json = _get('json');		
	$mysqli = new mysqli('p:localhost','root','','ting');
	$time = time();
	
	if ($op) {
		switch ($op) {
			case 'reset' :
				$mysqli->query("DROP TABLE IF EXISTS active_players");
				$mysqli->query("CREATE TABLE IF NOT EXISTS active_players (
					id INT NOT NULL AUTO_INCREMENT,
					json VARCHAR(200), 
					last_update int,
					PRIMARY KEY (id), 
					INDEX USING HASH (id))
					ENGINE = MEMORY;" );
					echo json_encode(array('game_init'=>"OK"));
				break;
			case 'clean' :
				$dead = $time - 10;
				$result = $mysqli->query("SELECT id FROM active_players WHERE last_update < $dead;");
				$players = array();
				if($result->num_rows > 0) {				
					while($p = $result->fetch_assoc()) {
						$players[] = $p;	
					}
					$mysqli->query("DELETE FROM active_players WHERE last_update < $dead;");
				}
				echo json_encode(array('players'=>$players));				
				break;
		}
	
	} else {
		if ($id) { 
			// update and send all other active players data
			$mysqli->query("UPDATE active_players SET json = '$json', last_update = $time WHERE id = $id;" );			
			$result = $mysqli->query("SELECT id, json FROM active_players WHERE id <> $id;");
			$players = array();
			if($result->num_rows > 0) {				
				while($p = $result->fetch_assoc()) {
					$players[] = $p;	
				}						
			}
			echo json_encode(array('players'=>$players));
		} else {		
			// new player			
			$mysqli->query("INSERT INTO active_players (json, last_update) VALUES ('$json', $time );" );
			$id = $mysqli->insert_id;
			echo json_encode(array('id'=>$id));			
		}
	}
	
?>
