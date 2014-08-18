<?php

	global $db;
	
	$mapID = ghobok_get('map_id');
	
	$query = "SELECT * FROM maps WHERE map_id = $mapID";
	$result = mysql_query($query,$db) or die('Debile query:  '.$query);
	
	if(mysql_num_rows($result)) {
		$map = mysql_fetch_assoc($result);
	} else die("Map $mapID doesn't exist.");
	
	/* MATERIALS */
	$query = "SELECT DISTINCT m.material_id, m.texture_image
				FROM materials m; /*
				LEFT OUTER JOIN tiles t ON ( t.material_id = m.material_id ) 
				LEFT OUTER JOIN objects o ON ( o.material_id = m.material_id ) 
				LEFT OUTER JOIN map_objects mo ON ( mo.object_id = o.object_id ) 
				 WHERE t.map_id = $mapID OR mo.map_id = $mapID; */";
	$result = mysql_query($query,$db) or die('Debile query:  '.$query);
	
	$materials = array();
	if(mysql_num_rows($result)) {
		while($material = mysql_fetch_assoc($result)) {
			$materials[] = $material;
		}
	}
	
	/* OBJECTS */
	$query = "SELECT DISTINCT o.* FROM objects o	/*
				JOIN map_objects mo ON (o.object_id = mo.object_id)
				 WHERE mo.map_id = $mapID; */ ";
	$result = mysql_query($query,$db) or die('Debile query:  '.$query);
	
	$objects = array();
	if(mysql_num_rows($result)) {
		while($object = mysql_fetch_object($result)) {
			$object->model_json = file_get_contents("models/" . $object->object_model);
			$objects[] = $object;
		}
	}
	
	/* MAP OBJECTS */
	$query = "SELECT mo.* 
				FROM map_objects mo 
				WHERE mo.map_id = $mapID;";
	$result = mysql_query($query,$db) or die('Debile query:  '.$query);
	
	$map_objects = array();
	if(mysql_num_rows($result)) {
		while($map_object = mysql_fetch_assoc($result)) {
			$map_objects[] = $map_object;
		}
	}
	
	/* MONSTERS */
        /*
	$query = "SELECT DISTINCT m.* FROM monsters m ;";
	$result = mysql_query($query,$db) or die('Debile query:  '.$query);
	
	$monsters = array();
	if(mysql_num_rows($result)) {
		while($monster = mysql_fetch_object($result)) {
			$monster->model_json = file_get_contents("models/" . $monster->object_model);
			$monsters[] = $monster;
		}
	}
	*/
	/* MAP MONSTERS */
        /*
	$query = "SELECT mm.* 
				FROM map_monsters mm 
				WHERE mm.map_id = $mapID;";
	$result = mysql_query($query,$db) or die('Debile query:  '.$query);
	
	$map_monsters = array();
	if(mysql_num_rows($result)) {
		while($map_monster = mysql_fetch_assoc($result)) {
			$map_monsters[] = $map_monster;
		}
	}
	*/
	/* TILES */
	$query = "SELECT tile_id, steps_south, steps_east, steps_up, direction, tile_type, material_id 
				FROM tiles WHERE map_id = $mapID";
	$result = mysql_query($query,$db) or die('Debile query:  '.$query);
	
	$tiles = array();
	if(mysql_num_rows($result)) {
		while($tile = mysql_fetch_assoc($result)) {
			$tiles[] = $tile;
		}
	}
	
	/* WEATHER EFFECTS */
	$query = "SELECT * FROM weather_effects	WHERE map_id = $mapID ORDER BY weather_effect_id desc";
	$result = mysql_query($query,$db) or die('Debile query:  '.$query);
	
	$effects = array();
	if(mysql_num_rows($result)) {
		while($effect = mysql_fetch_assoc($result)) {
			$effects[] = $effect;
		}
	}
		
	header('Content-type: application/json');
	echo json_encode(array('map'=>$map, 'materials'=>$materials, 'objects'=>$objects, 'map_objects'=>$map_objects, /* 'monsters'=>$monsters, 'map_monsters'=>$map_monsters,*/ 'tiles'=>$tiles, 'weather_effects'=>$effects));

		
?>