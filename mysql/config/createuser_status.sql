CREATE TABLE IF NOT EXISTS `redis_demo`.`user_status` (
  `user_id` INT(11) NOT NULL COMMENT '',
  `user_status` TEXT NOT NULL COMMENT '',
  `created_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '',
  INDEX `user_id` (`user_id` ASC)  COMMENT '',
  CONSTRAINT `user_status_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `redis_demo`.`user_login` (`user_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;