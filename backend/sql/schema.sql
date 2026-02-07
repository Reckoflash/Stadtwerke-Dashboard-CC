CREATE DATABASE IF NOT EXISTS stadtwerke
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE stadtwerke;

-- -------------------------
-- CUSTOMERS
-- -------------------------
DROP TABLE IF EXISTS customers;

CREATE TABLE customers (
  id VARCHAR(20) PRIMARY KEY,
  display_name VARCHAR(100) NOT NULL,
  annual_consumption_kwh INT NOT NULL,
  tariff VARCHAR(60) NOT NULL,
  status ENUM('Aktiv','Inaktiv') NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL,
  phone VARCHAR(40) NOT NULL,
  address VARCHAR(160) NOT NULL,
  customer_since DATE NOT NULL
);

-- -------------------------
-- PRODUCTS
-- -------------------------
DROP TABLE IF EXISTS products;

CREATE TABLE products (
  id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  commodity ENUM('Strom','Gas') NOT NULL,
  target_group ENUM('Privat','Gewerbe') NOT NULL,
  base_price_monthly_eur DECIMAL(10,2) NOT NULL,
  work_price_ct_per_kwh DECIMAL(10,2) NOT NULL,
  status ENUM('Aktiv','Auslaufend') NOT NULL,
  contract_term_months INT NOT NULL,
  notice_period_weeks INT NOT NULL,
  is_green TINYINT(1) NOT NULL,
  valid_from DATE NOT NULL
);

-- -------------------------
-- KPIs
-- -------------------------
DROP TABLE IF EXISTS kpis;

CREATE TABLE kpis (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sort_order INT NOT NULL,
  label VARCHAR(80) NOT NULL,
  value_str VARCHAR(80) NOT NULL,
  meta VARCHAR(120) NOT NULL
);

-- -------------------------
-- CASES
-- -------------------------
DROP TABLE IF EXISTS cases;

CREATE TABLE cases (
  id VARCHAR(20) PRIMARY KEY,
  customer_ref VARCHAR(120) NOT NULL,
  amount_eur DECIMAL(10,2) NOT NULL,
  overdue_days INT NOT NULL,
  status ENUM('Offen','In Klärung') NOT NULL,
  next_step VARCHAR(200) NOT NULL
);
