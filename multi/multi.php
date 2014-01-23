<?php
	
		header('Content-type: application/json');
		$id = $_GET['id'];
		$json = $_GET['json'];		
		$mysqli = new mysqli('p:localhost','root','','ting');
		
		// reset game
		if ($id == -1) {
			 $mysqli->query("DROP TABLE active_players IF EXISTS;
					CREATE TABLE IF NOT EXISTS active_players
					(id INT NOT NULL AUTO_INCREMENT, json VARCHAR(200), PRIMARY KEY (id), INDEX USING HASH (id))
					ENGINE = MEMORY;" );
		} else if ($id == 0) { 
			// new player
			$mysqli->query("INSERT INTO active_players (json) VALUES ('$json');" );
			$id = $mysqli->insert_id;
			echo json_encode(array('id'=>$id));
		} else {		
			// update and send all other active players data
			$mysqli->query("UPDATE active_players SET json = '$json' WHERE id = $id;" );			
			$result = $mysqli->query("SELECT * FROM active_players WHERE id <> $id;");
			$players = array();
			if($result->num_rows > 0) {				
				while($p = $result->fetch_assoc()) {
					$players[] = $p;	
				}						
			}
			echo json_encode(array('players'=>$players));
		}
		
?>
