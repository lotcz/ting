USE ting;

CREATE TABLE objects`scenes` (
  `scene_id` INT NOT NULL,
  `scene_name` VARCHAR(45) NOT NULL,
  `scene_json` TEXT NULL,
  PRIMARY KEY (`scene_id`)) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `objects` (
  `object_id` int(11) NOT NULL,
  `scene_id` int(11) NOT NULL,
  `object_json` text,
  PRIMARY KEY (`object_id`),
  KEY `idx_objects_scene_id` (`scene_id`),
  CONSTRAINT `objects_ibfk_1` FOREIGN KEY (`scene_id`) REFERENCES `scenes` (`scene_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE objects
ADD FOREIGN KEY (scene_id) 
REFERENCES scenes(scene_id);
