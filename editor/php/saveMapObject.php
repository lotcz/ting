<?php

	global $db;
	
	$map_id = ghobok_get('map_id');
	$map_object_json = ghobok_get('map_object_json');
	
	$map_object = json_decode($map_object_json);
	
	$mapObjectID = $map_object->map_object_id;
		
	if ($mapObjectID == 0) {
		
			$query = "INSERT INTO map_objects(map_id, object_id, steps_up, steps_east, steps_south, position_x, position_y, position_z, rotation_x, rotation_y, rotation_z, scale) 
			VALUES (" . $map_id . "," . $map_object->object_id . "," .$map_object->steps_up . "," . $map_object->steps_east . "," . $map_object->steps_south . "," . $map_object->position_x . "," . $map_object->position_y . "," . $map_object->position_z . "," . $map_object->rotation_x . "," . $map_object->rotation_y . "," . $map_object->rotation_z . "," . $map_object->scale . ");";
			$result = mysql_query($query,$db) or die('Debile query:  '.$query);
			echo (mysql_insert_id());
		
	} else {
		$query = "UPDATE map_objects SET steps_up = " .$map_object->steps_up . ",
		steps_east = " . $map_object->steps_east . ",
		steps_south = " . $map_object->steps_south . ",
		position_x = " . $map_object->position_x . ",
		position_y = " . $map_object->position_y . ",
		position_z = " . $map_object->position_z . ",
		rotation_x = " . $map_object->rotation_x . ",
		rotation_y = " . $map_object->rotation_y . ",
		rotation_z = " . $map_object->rotation_z . ",
		scale = " . $map_object->scale . "
		WHERE map_object_id = " . $mapObjectID;
		$result = mysql_query($query,$db) or die('Debile query:  '.$query);
		echo('Updated object:' . $mapObjectID );
	}

?>