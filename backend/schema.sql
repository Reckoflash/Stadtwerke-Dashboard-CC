USE stadtwerke;

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
  customer_since VARCHAR(20) NOT NULL
);

INSERT INTO customers
(id, display_name, annual_consumption_kwh, tariff, status, full_name, email, phone, address, customer_since)
VALUES
('K-1002','Familie Müller',3450,'Privat Standard','Aktiv','Thomas und Anna Müller','thomas.mueller@email.de','+49 221 98765432','Rosenweg 12, 50674 Köln','01.07.2020'),
('K-1001','Schmidt GmbH',45200,'Gewerbe Plus','Aktiv','Schmidt GmbH (Ansprechpartner: Lena Schmidt)','kontakt@schmidt-gmbh.de','+49 221 12345678','Industriestraße 5, 50667 Köln','15.03.2018'),
('K-1005','Autohaus Becker',78900,'Gewerbe Premium','Inaktiv','Autohaus Becker (Ansprechpartner: Paul Becker)','info@autohaus-becker.de','+49 221 55555555','Automeile 3, 51149 Köln','10.11.2019');
