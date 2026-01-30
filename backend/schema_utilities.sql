USE stadtwerke;

DROP TABLE IF EXISTS kpis;
CREATE TABLE kpis (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sort_order INT NOT NULL,
  label VARCHAR(80) NOT NULL,
  value_str VARCHAR(80) NOT NULL,
  meta VARCHAR(120) NOT NULL
);

INSERT INTO kpis (sort_order, label, value_str, meta) VALUES
(1,'Aktive Kunden','12.480','Stand: aktuell'),
(2,'Neukunden (30 Tage)','186','+4,2% ggü. Vormonat'),
(3,'Kündigungen (30 Tage)','94','Churn: 0,75%'),
(4,'Offene Forderungen','184.230 €','Überfällig gesamt'),
(5,'Monatsumsatz (Schätzung)','1,92 Mio. €','Abrechnung noch offen'),
(6,'Ø Verbrauch pro Kunde','3.120 kWh','Strom (Privat)');

DROP TABLE IF EXISTS cases;
CREATE TABLE cases (
  id VARCHAR(20) PRIMARY KEY,
  customer_ref VARCHAR(120) NOT NULL,
  amount_eur DECIMAL(10,2) NOT NULL,
  overdue_days INT NOT NULL,
  status ENUM('Offen','In Klärung') NOT NULL,
  next_step VARCHAR(200) NOT NULL
);

INSERT INTO cases (id, customer_ref, amount_eur, overdue_days, status, next_step) VALUES
('F-90012','K-1005 Autohaus Becker',1842.50,14,'Offen','Kundenkontakt zur Klärung / Zahlungsziel bestätigen'),
('F-90018','K-1001 Schmidt GmbH',6420.10,7,'In Klärung','Rechnungsprüfung / Klärung mit Fachabteilung'),
('F-90021','K-1002 Familie Müller',128.90,3,'Offen','Zahlungseingang prüfen, ggf. Erinnerung senden');
