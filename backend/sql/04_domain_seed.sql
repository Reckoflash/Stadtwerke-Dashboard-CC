USE stadtwerke;

-- ===== MaLo
INSERT INTO market_locations
(id, address, commodity, status, usage_type, grid_area, customer_id)
VALUES
('1234567890123','Rosenweg 12, 50674 Köln','Strom','Aktiv','Wohnung','Stadtwerke Köln Netz','K-1002'),
('9876543210001','Industriestraße 5, 50667 Köln','Gas','Aktiv','Gewerbe','Stadtwerke Köln Netz','K-1001'),
('5555555555555','Automeile 3, 51149 Köln','Strom','Stillgelegt','Gewerbe','Stadtwerke Köln Netz','K-1005');

-- ===== MeLo
INSERT INTO meter_locations (id, malo_id, measurement_type, status) VALUES
('MeLo-445566','1234567890123','SLP','Aktiv'),
('MeLo-778899','9876543210001','RLM','Aktiv'),
('MeLo-112233','5555555555555','SLP','Aktiv');

-- ===== Zähler
INSERT INTO meters
(meter_number, melo_id, device_type, install_date, register_code, status, manufacturer, verified_until)
VALUES
('1ESY1234567','MeLo-445566','mME','2022-03-12','1.8.0 (Bezug)','In Betrieb','EasyMeter','2030-12-31'),
('GAS99887766','MeLo-778899','iMSys','2023-07-20','1.8.0 (Bezug)','In Betrieb','Sagemcom','2031-12-31'),
('SWT11223344','MeLo-112233','Ferraris','2018-05-05','1.8.0 (Bezug)','Ausgebaut','Siemens','2026-12-31');

-- ===== Zählerstände (letzte bekannte + Historie minimal)
INSERT INTO meter_readings
(meter_number, reading_date, reading_value, reading_unit, reading_type, is_plausible)
VALUES
('1ESY1234567','2026-01-15',3450.000,'kWh','Kunde',1),
('GAS99887766','2026-01-02',12840.000,'m3','Ablesung',1),
('SWT11223344','2025-12-01',78900.000,'kWh','Schätzung',1);

-- ===== Verträge
INSERT INTO contracts
(id, customer_id, malo_id, commodity, product_id, start_date, end_date, status,
 term_months, notice_weeks, account_id,
 installment_eur_monthly, installment_valid_from, installment_reason,
 last_payment_date, last_payment_amount_eur, last_payment_method, last_payment_status)
VALUES
('VT-80091','K-1002','1234567890123','Strom','P-2001','2026-01-01',NULL,'Aktiv',
 12,4,'VK-30012',
 95.00,'2026-01-01','Jahresverbrauch',
 '2026-01-20',95.00,'SEPA','Verbucht'),

('VT-80110','K-1001','9876543210001','Gas','P-3001','2025-11-01',NULL,'Aktiv',
 24,6,'VK-30018',
 420.00,'2025-11-01','Rechnungsergebnis',
 '2026-01-05',420.00,'Überweisung','Unklar');

-- ===== Offene Posten
INSERT INTO open_items
(contract_id, op_no, amount_eur, overdue_days, dunning_level, status)
VALUES
('VT-80091','OP-50012',128.90,3,'MS0','Offen'),
('VT-80091','OP-50018',42.50,12,'MS1','In Klärung'),
('VT-80110','OP-60001',6420.10,7,'MS1','In Klärung');
