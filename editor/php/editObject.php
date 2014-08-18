<?php

	global $db;
	
	$errors = [];
	
	$object_id = ghobok_get('object_id');
	$object_name = "";
	$object_type = 0;
	$object_model = "";
	$default_scale = 1;
	$material_id = 0;
	$object_category_id = 1;
	$default_position_x = 0;
	$default_position_y = -150;
	$default_position_z = 0;
	$default_rotation_x = 0;
	$default_rotation_y = 0;
	$default_rotation_z = 0;
	
	if (isset($object_id)) {
	
		$query = "SELECT * FROM objects WHERE object_id = $object_id";				
		$result = mysql_query($query, $db) or die('Debile query:  '.$query);

		if(mysql_num_rows($result)) {
			$object = mysql_fetch_object($result);
			$object_name = $object->object_name;
			$object_type = $object->object_type;
			$object_model = $object->object_model;
			$default_scale = $object->default_scale;
			$material_id = $object->material_id;
			$object_category_id = $object->object_category_id;		
			$default_position_x = $object->default_position_x;
			$default_position_y = $object->default_position_y;
			$default_position_z = $object->default_position_z;
			$default_rotation_x = $object->default_rotation_x;
			$default_rotation_y = $object->default_rotation_y;
			$default_rotation_z = $object->default_rotation_z;			
		}		
	}
		
	// process form, if submitted
	if (isset($_POST['submitted'])) {

		$object_id = ghobok_get('object_id');
		$object_name = ghobok_get('object_name');
		$object_type = ghobok_get('object_type');
		$object_model = ghobok_get('object_model');
		$default_scale = ghobok_get('default_scale');
		$material_id = ghobok_get('material_id');
		$object_category_id = ghobok_get('object_category_id');
		$default_position_x = ghobok_get('default_position_x');
		$default_position_y = ghobok_get('default_position_y');
		$default_position_z = ghobok_get('default_position_z');
		$default_rotation_x = ghobok_get('default_rotation_x');
		$default_rotation_y = ghobok_get('default_rotation_y');
		$default_rotation_z = ghobok_get('default_rotation_z');
		
		if (!isset($object_name)) {
			$errors[] = "object must have name";
		}
		
		// if all is ok, run sql query and return to manager
		if (count($errors) == 0) {		
			if (isset($object)) {
				$query = "UPDATE objects set object_category_id=$object_category_id, 
							object_type=$object_type,
							object_model='$object_model',
							default_scale=$default_scale,
							material_id=$material_id,
							default_position_x=$default_position_x,
							default_position_y=$default_position_y,
							default_position_z=$default_position_z,
							default_rotation_x=$default_rotation_x,
							default_rotation_y=$default_rotation_y,
							default_rotation_z=$default_rotation_z,
							object_name='$object_name'
							WHERE object_id = $object_id";
				
				mysql_query($query,$db) or die('Debile query:  '.$query);
			} else {
				$query = "INSERT INTO objects (object_type, object_model, default_scale, material_id, default_position_x, default_position_y, default_position_z, default_rotation_x, default_rotation_y, default_rotation_z, object_name, object_category_id) 
							VALUES ($object_type, '$object_model', $default_scale, $material_id, $default_position_x, $default_position_y, $default_position_z, $default_rotation_x, $default_rotation_y, $default_rotation_z, '$object_name', $object_category_id);";
				mysql_query($query,$db) or die('Debile query:  '.$query);
				$object_id = mysql_insert_id();
			}
			ghobok_redirect("ghobok.php?method=object_manager&cat_id=$object_category_id#object$object_id");
		}
		
	}
	

?>
<!doctype html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>Ghobok object Manager</title>
		<link href="editor.css" rel="stylesheet"/>
		
	</head>
	
	<body>

		<?php 
			
			if (count($errors) > 0) {
				echo "<ul>";
				foreach ($errors as $error) {
					echo "<li>$error</li>";
				}
				echo "</ul>";
			}
		?>
		
		<form method="post" enctype="multipart/form-data">
		
			<input type="hidden" name="method" value="edit_object" />
			
			<?php 
				if (isset($object_id)) {
					echo "<input type=\"hidden\" name=\"object_id\" value=\"$object_id\" />";
				}
			?>
			
			<table>

				<tr>
				
					<td>Category:</td>
					
					<td>
						<select name="object_category_id">
							<?php
						
							global $db;
	
							$query = "SELECT c.object_category_id, c.category_name
										FROM object_categories c
										ORDER BY c.category_name";
							
							$result = mysql_query($query,$db) or die('Debile query:  '.$query);

							if(mysql_num_rows($result)) {
								while($cat = mysql_fetch_object($result)) {
									$selected = ($cat->object_category_id == $object_category_id) ? "selected" : "";						
									echo "<option value=\"" . $cat->object_category_id . "\" $selected >" . $cat->category_name . "</option>";
								}
							}
							
							?>
						</select>
					<td>
					
				</tr>
			
				<tr>
				
					<td>Object name:</td>
					
					<td><input type="text" name="object_name" value="<?php echo $object_name ?>"/></td>
					
				</tr>
				
				<tr>
				
					<td>Object type:</td>
					
					<td>
						<select name="object_type">
							<option value="0">static model</option>
							<option value="1">fire</option>
							<option value="2">animated model</option>
						</select>
					</td>
					
				</tr>
				
				<tr>
				
					<td>Object model:</td>
					
					<td><input type="text" name="object_model" value="<?php echo $object_model ?>"/></td>
					
				</tr>
				
				<tr>
				
					<td>Scale:</td>
					
					<td><input type="text" name="default_scale" value="<?php echo $default_scale ?>"/></td>
					
				</tr>
				
				<tr>
				
					<td>Material:</td>
					
					<td><input type="text" name="material_id" value="<?php echo $material_id ?>"/></td>
					
				</tr>
				
				<tr>
				
					<td>X:</td>
					
					<td><input type="text" name="default_position_x" value="<?php echo $default_position_x ?>"/></td>
					
				</tr>
							
	
				<tr>
				
					<td>Y:</td>
					
					<td><input type="text" name="default_position_y" value="<?php echo $default_position_y ?>"/></td>
					
				</tr>
				
				<tr>
				
					<td>Z:</td>
					
					<td><input type="text" name="default_position_z" value="<?php echo $default_position_z ?>"/></td>
					
				</tr>
				
				<tr>
				
					<td>rotation X:</td>
					
					<td><input type="text" name="default_rotation_x" value="<?php echo $default_rotation_x ?>"/></td>
					
				</tr>
							
	
				<tr>
				
					<td>rotation Y:</td>
					
					<td><input type="text" name="default_rotation_y" value="<?php echo $default_rotation_y ?>"/></td>
					
				</tr>
				
				<tr>
				
					<td>rotation Z:</td>
					
					<td><input type="text" name="default_rotation_z" value="<?php echo $default_rotation_z ?>"/></td>
					
				</tr>
		
				<tr>
				
					<td>
						<input type="submit" value="Save" name="submitted" />
					</td>
					
					<td>
						<a href="ghobok.php?method=object_manager">Back to object manager</a>
					</td>
					
				</tr>

			</table>
			
		</form>

	</body>
	
</html>