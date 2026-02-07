USE stadtwerke;

-- =========================
-- Core Seeds (Customers/Products/KPIs/Cases)
-- =========================

-- CUSTOMERS
INSERT INTO customers
(id, display_name, annual_consumption_kwh, tariff, status, full_name, email, phone, address, customer_since)
VALUES
('K-1002','Familie Müller',3450,'Privat Standard','Aktiv','Thomas und Anna Müller','thomas.mueller@email.de','+49 221 98765432','Rosenweg 12, 50674 Köln','2020-07-01'),
('K-1001','Schmidt GmbH',45200,'Gewerbe Plus','Aktiv','Schmidt GmbH (Ansprechpartner: Lena Schmidt)','kontakt@schmidt-gmbh.de','+49 221 12345678','Industriestraße 5, 50667 Köln','2018-03-15'),
('K-1005','Autohaus Becker',78900,'Gewerbe Premium','Inaktiv','Autohaus Becker (Ansprechpartner: Paul Becker)','info@autohaus-becker.de','+49 221 55555555','Automeile 3, 51149 Köln','2019-11-10');

-- PRODUCTS
INSERT INTO products
(id, name, commodity, target_group, base_price_monthly_eur, work_price_ct_per_kwh, status, contract_term_months, notice_period_weeks, is_green, valid_from)
VALUES
('P-2001','Privat Standard Strom','Strom','Privat',12.90,33.40,'Aktiv',12,4,0,'2026-01-01'),
('P-2002','Privat Öko Strom','Strom','Privat',14.90,34.90,'Aktiv',12,4,1,'2026-01-01'),
('P-2101','Gewerbe Plus Strom','Strom','Gewerbe',29.00,28.90,'Aktiv',24,6,0,'2026-01-01'),
('P-3001','Privat Standard Gas','Gas','Privat',13.50,11.20,'Auslaufend',12,4,0,'2025-11-01');

-- KPIs
INSERT INTO kpis (sort_order, label, value_str, meta) VALUES
(1,'Aktive Kunden','12.480','Stand: aktuell'),
(2,'Neukunden (30 Tage)','186','+4,2% ggü. Vormonat'),
(3,'Kündigungen (30 Tage)','94','Churn: 0,75%'),
(4,'Offene Forderungen','184.230 €','Überfällig gesamt'),
(5,'Monatsumsatz (Schätzung)','1,92 Mio. €','Abrechnung noch offen'),
(6,'Ø Verbrauch pro Kunde','3.120 kWh','Strom (Privat)');

-- CASES
INSERT INTO cases (id, customer_ref, amount_eur, overdue_days, status, next_step) VALUES
('F-90012','K-1005 Autohaus Becker',1842.50,14,'Offen','Kundenkontakt zur Klärung / Zahlungsziel bestätigen'),
('F-90018','K-1001 Schmidt GmbH',6420.10,7,'In Klärung','Rechnungsprüfung / Klärung mit Fachabteilung'),
('F-90021','K-1002 Familie Müller',128.90,3,'Offen','Zahlungseingang prüfen, ggf. Erinnerung senden');
