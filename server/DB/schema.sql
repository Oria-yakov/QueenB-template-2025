-- יוצר DB עם קידוד נכון לעברית
DROP DATABASE IF EXISTS queens_match;
CREATE DATABASE IF NOT EXISTS `queens_match`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `queens_match`;

-- טבלת מנטורים (MENTOR)
CREATE TABLE IF NOT EXISTS mentors (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  full_name       VARCHAR(200)    NOT NULL,
  email           VARCHAR(255)    NOT NULL UNIQUE,
  password_hash   VARCHAR(255)    NOT NULL,        -- אל תשמור סיסמה גולמית; בקוד תבצע HASH
  additional_info TEXT            NULL,
  years_exp       TINYINT UNSIGNED NULL,           -- מהסליידר (0-50 למשל)
  languages       JSON            NULL,            -- מהמולטי-סלקט, לדוגמה: ["JavaScript","Python"]
  created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

-- טבלת מנטיז (MENTEE)
CREATE TABLE IF NOT EXISTS mentees (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  full_name       VARCHAR(200)    NOT NULL,
  email           VARCHAR(255)    NOT NULL UNIQUE,
  password_hash   VARCHAR(255)    NOT NULL,        -- גם כאן שומרים HASH
  additional_info TEXT            NULL,
  created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

-- אינדקסים שימושיים
CREATE INDEX idx_mentors_name ON mentors(full_name);
CREATE INDEX idx_mentees_name ON mentees(full_name);
