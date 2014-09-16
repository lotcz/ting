DROP DATABASE ting;

CREATE DATABASE ting;

USE ting;

CREATE TABLE `scenes` (
  `scene_id` INT NOT NULL AUTO_INCREMENT,
  `scene_name` VARCHAR(45) NOT NULL,
  `scene_json` TEXT NULL,
  PRIMARY KEY (`scene_id`) ) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `resources` (
  `resource_id` INT NOT NULL AUTO_INCREMENT,
  `resource_json` TEXT NULL,
  PRIMARY KEY (`resource_id`)) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `scene_resources` (
  `scene_id` int(11) NOT NULL,
  `resource_id` int(11) NOT NULL,
  PRIMARY KEY (`scene_id`,`resource_id`),
  CONSTRAINT `res_ibfk_1` FOREIGN KEY (`resource_id`) REFERENCES `resources` (`resource_id`),
  CONSTRAINT `objects_ibfk2_2` FOREIGN KEY (`scene_id`) REFERENCES `scenes` (`scene_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
