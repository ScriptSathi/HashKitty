CREATE SCHEMA hashkitty;

CREATE  TABLE hashkitty.attack_mode ( 
	id                   INT  NOT NULL   AUTO_INCREMENT  PRIMARY KEY,
	name                 VARCHAR(10)       ,
	description          VARCHAR(255)       
 ) engine=InnoDB;

CREATE  TABLE hashkitty.hash_type ( 
	id                   INT  NOT NULL   AUTO_INCREMENT  PRIMARY KEY,
	name                 VARCHAR(100)       ,
	description          VARCHAR(255)       
 ) engine=InnoDB;

CREATE  TABLE hashkitty.hashlist ( 
	id                   INT  NOT NULL   AUTO_INCREMENT  PRIMARY KEY,
	name                 VARCHAR(30)       ,
	description          VARCHAR(255)       ,
	path                 VARCHAR(255)       ,
	created_at           DATE       ,
	lastest_modification DATE       ,
	number_of_cracked_passwords INT       
 ) engine=InnoDB;

CREATE  TABLE hashkitty.wordlist ( 
	id                   INT  NOT NULL   AUTO_INCREMENT  PRIMARY KEY,
	name                 VARCHAR(30)       ,
	description          VARCHAR(255)       ,
	path                 VARCHAR(255)       
 );

CREATE  TABLE hashkitty.workload_profile ( 
	id                   INT  NOT NULL   AUTO_INCREMENT  PRIMARY KEY,
	name                 VARCHAR(10)       ,
	description          VARCHAR(100)       
 ) engine=InnoDB;

CREATE  TABLE hashkitty.options ( 
	id                   INT  NOT NULL   AUTO_INCREMENT  PRIMARY KEY,
	kernel_opti          TINYINT   DEFAULT (false)    ,
	rule_name            VARCHAR(50)       ,
	mask_query           VARCHAR(100)       ,
	mask_filename        VARCHAR(100)       ,
	attack_mode_id       INT  NOT NULL     ,
	breakpoint_gpu_temperature INT   DEFAULT (90)    ,
	cpu_only             TINYINT   DEFAULT (false)    ,
	workload_profile_id  INT       ,
	wordlist_id          INT  NOT NULL     ,
	CONSTRAINT attack_mode_id FOREIGN KEY ( attack_mode_id ) REFERENCES hashkitty.attack_mode( id ) ON DELETE NO ACTION ON UPDATE NO ACTION,
	CONSTRAINT workload_profile_id FOREIGN KEY ( workload_profile_id ) REFERENCES hashkitty.workload_profile( id ) ON DELETE NO ACTION ON UPDATE NO ACTION,
	CONSTRAINT wordlist_id FOREIGN KEY ( wordlist_id ) REFERENCES hashkitty.wordlist( id ) ON DELETE NO ACTION ON UPDATE NO ACTION
 ) engine=InnoDB;

CREATE INDEX attack_mode_id ON hashkitty.options ( attack_mode_id );

CREATE INDEX workload_profile_id ON hashkitty.options ( workload_profile_id );

CREATE INDEX wordlist_id ON hashkitty.options ( wordlist_id );

CREATE  TABLE hashkitty.template_task ( 
	id                   INT  NOT NULL   AUTO_INCREMENT  PRIMARY KEY,
	name                 VARCHAR(30)       ,
	description          VARCHAR(255)   DEFAULT ('_utf8mb4''')    ,
	options_id           INT       ,
	created_at           DATE       ,
	lastest_modification DATE       ,
	CONSTRAINT options_id FOREIGN KEY ( options_id ) REFERENCES hashkitty.options( id ) ON DELETE NO ACTION ON UPDATE NO ACTION
 ) engine=InnoDB;

CREATE INDEX options_id ON hashkitty.template_task ( options_id );

CREATE  TABLE hashkitty.task ( 
	id                   INT  NOT NULL   AUTO_INCREMENT  PRIMARY KEY,
	name                 VARCHAR(30)  NOT NULL     ,
	description          VARCHAR(255)       ,
	hashlist_id          INT  NOT NULL     ,
	template_task_id     INT       ,
	options_id           INT  NOT NULL     ,
	hash_type_id         INT  NOT NULL     ,
	created_at           DATE       ,
	ended_at             DATE       ,
	lastest_modification DATE       ,
	`status`             TINYINT   DEFAULT (false)    ,
	CONSTRAINT hashlist_id_0 FOREIGN KEY ( hashlist_id ) REFERENCES hashkitty.hashlist( id ) ON DELETE NO ACTION ON UPDATE NO ACTION,
	CONSTRAINT template_task_id FOREIGN KEY ( template_task_id ) REFERENCES hashkitty.template_task( id ) ON DELETE NO ACTION ON UPDATE NO ACTION,
	CONSTRAINT task_options_id FOREIGN KEY ( options_id ) REFERENCES hashkitty.options( id ) ON DELETE NO ACTION ON UPDATE NO ACTION,
	CONSTRAINT hash_type_id FOREIGN KEY ( hash_type_id ) REFERENCES hashkitty.hash_type( id ) ON DELETE NO ACTION ON UPDATE NO ACTION
 ) engine=InnoDB;

CREATE INDEX hashlist_id ON hashkitty.task ( hashlist_id );

CREATE INDEX template_task_id ON hashkitty.task ( template_task_id );

CREATE INDEX task_options_id ON hashkitty.task ( options_id );

CREATE INDEX hash_type_id ON hashkitty.task ( hash_type_id );

ALTER TABLE hashkitty.attack_mode COMMENT 'The attack modes enable by hashcat';

ALTER TABLE hashkitty.hash_type COMMENT 'The hash types enable by hashcat';

ALTER TABLE hashkitty.workload_profile COMMENT 'Workload Profiles that are needed to increase or dicrease the speed of hashcat';

ALTER TABLE hashkitty.options COMMENT 'Contain the options needed for using task and template_task';

ALTER TABLE hashkitty.template_task MODIFY id INT  NOT NULL  AUTO_INCREMENT COMMENT 'PRIMARY KEY of the table template task';

ALTER TABLE hashkitty.task MODIFY `status` TINYINT   DEFAULT (false)  COMMENT 'True means the task has ended';
