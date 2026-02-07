USE stadtwerke;

-- =========================
-- Lokation & Messwesen
-- =========================
DROP TABLE IF EXISTS meter_readings;
DROP TABLE IF EXISTS meters;
DROP TABLE IF EXISTS meter_locations;
DROP TABLE IF EXISTS market_locations;

CREATE TABLE market_locations (
  id VARCHAR(20) PRIMARY KEY,          -- MaLo-ID
  address VARCHAR(160) NOT NULL,
  commodity ENUM('Strom','Gas','Wasser','Wärme') NOT NULL,
  status ENUM('Aktiv','Stillgelegt') NOT NULL,
  usage_type VARCHAR(40) NOT NULL,     -- Wohnung/Gewerbe/...
  grid_area VARCHAR(80) NOT NULL,      -- Netzgebiet
  customer_id VARCHAR(20) NOT NULL,    -- FK -> customers.id
  CONSTRAINT fk_malo_customer FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE meter_locations (
  id VARCHAR(20) PRIMARY KEY,          -- MeLo-ID
  malo_id VARCHAR(20) NOT NULL,
  measurement_type ENUM('SLP','RLM') NULL,
  status ENUM('Aktiv','Inaktiv') NOT NULL DEFAULT 'Aktiv',
  CONSTRAINT fk_melo_malo FOREIGN KEY (malo_id) REFERENCES market_locations(id)
);

CREATE TABLE meters (
  meter_number VARCHAR(30) PRIMARY KEY,
  melo_id VARCHAR(20) NOT NULL,
  device_type ENUM('mME','iMSys','Ferraris') NULL,
  install_date DATE NULL,
  register_code VARCHAR(30) NULL,      -- z.B. 1.8.0 (Bezug)
  status ENUM('In Betrieb','Ausgebaut') NOT NULL DEFAULT 'In Betrieb',
  manufacturer VARCHAR(40) NULL,
  verified_until DATE NULL,
  CONSTRAINT fk_meter_melo FOREIGN KEY (melo_id) REFERENCES meter_locations(id)
);

CREATE TABLE meter_readings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  meter_number VARCHAR(30) NOT NULL,
  reading_date DATE NOT NULL,
  reading_value DECIMAL(12,3) NOT NULL,
  reading_unit VARCHAR(10) NOT NULL,   -- kWh / m3 / ...
  reading_type ENUM('Ablesung','Kunde','Schätzung') NOT NULL,
  is_plausible TINYINT(1) NOT NULL DEFAULT 1,
  CONSTRAINT fk_reading_meter FOREIGN KEY (meter_number) REFERENCES meters(meter_number)
);

-- =========================
-- Verträge & Abrechnung
-- =========================
DROP TABLE IF EXISTS open_items;
DROP TABLE IF EXISTS contracts;

CREATE TABLE contracts (
  id VARCHAR(20) PRIMARY KEY,          -- VT-Nr.
  customer_id VARCHAR(20) NOT NULL,
  malo_id VARCHAR(20) NOT NULL,
  commodity ENUM('Strom','Gas','Wasser','Wärme') NOT NULL,
  product_id VARCHAR(20) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NULL,
  status ENUM('Aktiv','Gekündigt','Beendet') NOT NULL,

  term_months INT NOT NULL,
  notice_weeks INT NOT NULL,

  account_id VARCHAR(20) NULL,         -- VK (optional)

  installment_eur_monthly DECIMAL(10,2) NOT NULL,
  installment_valid_from DATE NOT NULL,
  installment_reason VARCHAR(80) NOT NULL,

  last_payment_date DATE NOT NULL,
  last_payment_amount_eur DECIMAL(10,2) NOT NULL,
  last_payment_method ENUM('SEPA','Überweisung') NOT NULL,
  last_payment_status ENUM('Verbucht','Unklar') NOT NULL,

  CONSTRAINT fk_contract_customer FOREIGN KEY (customer_id) REFERENCES customers(id),
  CONSTRAINT fk_contract_malo FOREIGN KEY (malo_id) REFERENCES market_locations(id),
  CONSTRAINT fk_contract_product FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE open_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  contract_id VARCHAR(20) NOT NULL,
  op_no VARCHAR(20) NOT NULL,
  amount_eur DECIMAL(10,2) NOT NULL,
  overdue_days INT NOT NULL,
  dunning_level ENUM('MS0','MS1','MS2','MS3') NOT NULL,
  status ENUM('Offen','In Klärung','In Raten') NOT NULL,
  CONSTRAINT fk_op_contract FOREIGN KEY (contract_id) REFERENCES contracts(id)
);
