CREATE TABLE IF NOT EXISTS `redis_demo`.`user_login` (
  `user_id` INT(11) NOT NULL AUTO_INCREMENT COMMENT '',
  `user_email` VARCHAR(50) NOT NULL COMMENT '',
  `user_password` VARCHAR(50) NOT NULL COMMENT '',
  `user_name` VARCHAR(50) NOT NULL COMMENT '',
  PRIMARY KEY (`user_id`)  COMMENT '',
  UNIQUE INDEX `user_email` (`user_email` ASC)  COMMENT '')
ENGINE = InnoDB
AUTO_INCREMENT = 7
DEFAULT CHARACTER SET = utf8;