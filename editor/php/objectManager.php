<?php 
	global $db;
	
	$cat_id = ghobok_get('cat_id');
	$category_name = "";
	
	if (isset($cat_id)) {
		echo "<input type=\"hidden\" name=\"cat_id\" value=\"$cat_id\" />";
		$query = "SELECT c.object_category_id, c.category_name
					FROM object_categories c
					WHERE c.object_category_id = $cat_id";				
		$result = mysql_query($query, $db) or die('Debile query:  '.$query);

		if(mysql_num_rows($result)) {
			$category = mysql_fetch_object($result);
			$category_name =$category->category_name;
		}		
	} else {
		$cat_id = 0;
	}
	
	// process form, if submitted
	if (isset($_POST['add'])) {
		$query = "INSERT INTO object_categories (category_name) VALUES ('" . $_POST['category_name'] . "');";				
		mysql_query($query, $db) or die('Debile query:  '.$query);
	} else if (isset($_POST['update'])) {
		$query = "UPDATE object_categories SET category_name = '" . $_POST['category_name'] . "' WHERE object_category_id = $cat_id;";				
		mysql_query($query, $db) or die('Debile query:  '.$query);
	}


	function get_type_name($object_type) {
		switch ($object_type) {
			case 0:
				return "static model";
				break;
			case 1:
				return "fire";
				break;			
			case 2:
				return "animated model";
				break;		
		}
	}
			
?>
<!doctype html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>Ghobok Object Manager</title>
		<link href="editor.css" rel="stylesheet"/>
		
		<script src="../lib/jquery.min.js"></script>
		<script language="javascript">
		
			function onCategoryChange(catSel) {
				var cat_id = catSel.options[catSel.selectedIndex].value;
				window.location.href = 'ghobok.php?method=object_manager&cat_id=' + cat_id;
			}
			
		</script>
		
	</head>
	
	<body>

		<form method="post">
		
			<input type="hidden" name="method" value="object_manager" />
		
			<div id="material-manager-menu">

				<select onChange="javascript:onCategoryChange(this);">
					<?php
								
					$query = "SELECT c.object_category_id, c.category_name
							FROM object_categories c
							ORDER BY c.category_name";
					
					$result = mysql_query($query,$db) or die('Debile query:  '.$query);

					if(mysql_num_rows($result)) {
						while($cat = mysql_fetch_object($result)) {
							$selected = ($cat->object_category_id == $cat_id) ? "selected" : "";						
							echo "<option value=\"" . $cat->object_category_id . "\" $selected >" . $cat->category_name . "</option>";
						}
					}
					
					?>
				</select>
				<input type="text" name="category_name"/>
				&nbsp;
				<input type="submit" name="update" value="Update" />
				&nbsp;
				<input type="submit" name="add" value="Add" />
				<br/>
				<a href="ghobok.php?method=edit_object" >+ Add new object</a>
				<br/>
			</div>

			<div id="material-manager-materials">
				
				<table>
					<tr>
						<th></th>
						<th>object name</th>
						<th>object type</th>
						<th>object model</th>
						<th></th>					
					</tr>
					
					<?php
						
					$query = "SELECT * FROM objects";
					
					if (isset($cat_id)) {
						$query .= " WHERE object_category_id = ". $cat_id;
					}
					
					$result = mysql_query($query,$db) or die('Debile query:  '.$query);

					
					if(mysql_num_rows($result)) {
					
						while($object = mysql_fetch_object($result)) {
							$object_json = json_encode($object);
							echo "<tr><td><a href=\"ghobok.php?method=edit_object&object_id=" . $object->object_id . "\">Edit</a></td>";
							echo "<td><a id=\"object" . $object->object_id ."\"></a>" . $object->object_name . "</td>";
							
							echo "<td>" . get_type_name($object->object_type) . "</td>";
							echo "<td>" . $object->object_model . "</td>";
							
							echo "<td><input class=\"select-button\" type=\"button\" value=\"Select\" objectID=\"" . $object->object_id . "\" /><span class=\"collapsed object_json\">$object_json</span></td>";
							echo "</tr>";		
						}
						

					}
							
					?>
			
					
				</table>
				
			</div>

		</form>
		
	</body>
	
</html>