<?php

	global $db;
	
	$mapObjectID = ghobok_get('map_object_id');
	$query = "DELETE FROM map_objects WHERE map_object_id = $mapObjectID;";
	$result = mysql_query($query,$db) or die('Debile query:  '.$query);
	echo ('DELETED');	

?>