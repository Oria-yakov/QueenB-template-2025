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
  password_hash   VARCHAR(255)    NOT NULL,                 -- לא לשמור סיסמה גולמית
  additional_info TEXT            NULL,
  years_exp       TINYINT UNSIGNED NULL,
  languages       JSON            NULL,                     -- דוגמה: ["JavaScript","Python"]
  phone           VARCHAR(30)     NULL,                     -- חדש
  linkedin        VARCHAR(255)    NULL,                     -- חדש (URL)
  image_url       VARCHAR(255)    NULL,                     -- חדש (URL לתמונה)
  created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

-- טבלת מנטיות (MENTEE)
CREATE TABLE IF NOT EXISTS mentees (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  full_name       VARCHAR(200)    NOT NULL,
  email           VARCHAR(255)    NOT NULL UNIQUE,
  password_hash   VARCHAR(255)    NOT NULL,
  additional_info TEXT            NULL,
  phone           VARCHAR(30)     NULL,                     -- חדש
  linkedin        VARCHAR(255)    NULL,                     -- חדש (URL)
  image_url       VARCHAR(255)    NULL,                     -- חדש (URL לתמונה)
  created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

-- אינדקסים שימושיים (בנוסף ל-UNIQUE על email)
CREATE INDEX idx_mentors_name ON mentors(full_name);
CREATE INDEX idx_mentees_name ON mentees(full_name);
