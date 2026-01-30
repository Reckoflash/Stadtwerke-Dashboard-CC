USE stadtwerke;

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
  valid_from VARCHAR(20) NOT NULL
);

INSERT INTO products
(id, name, commodity, target_group, base_price_monthly_eur, work_price_ct_per_kwh, status, contract_term_months, notice_period_weeks, is_green, valid_from)
VALUES
('P-2001','Privat Standard Strom','Strom','Privat',12.90,33.40,'Aktiv',12,4,0,'01.01.2026'),
('P-2002','Privat Öko Strom','Strom','Privat',14.90,34.90,'Aktiv',12,4,1,'01.01.2026'),
('P-2101','Gewerbe Plus Strom','Strom','Gewerbe',29.00,28.90,'Aktiv',24,6,0,'01.01.2026'),
('P-3001','Privat Standard Gas','Gas','Privat',13.50,11.20,'Auslaufend',12,4,0,'01.11.2025');
