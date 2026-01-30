const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// --- Mock-Daten (später ersetzen wir das durch MySQL) ---
const customers = [
  {
    id: 'K-1002',
    displayName: 'Familie Müller',
    annualConsumptionKwh: 3450,
    tariff: 'Privat Standard',
    status: 'Aktiv',
    fullName: 'Thomas und Anna Müller',
    email: 'thomas.mueller@email.de',
    phone: '+49 221 98765432',
    address: 'Rosenweg 12, 50674 Köln',
    customerSince: '01.07.2020',
  },
  {
    id: 'K-1001',
    displayName: 'Schmidt GmbH',
    annualConsumptionKwh: 45200,
    tariff: 'Gewerbe Plus',
    status: 'Aktiv',
    fullName: 'Schmidt GmbH (Ansprechpartner: Lena Schmidt)',
    email: 'kontakt@schmidt-gmbh.de',
    phone: '+49 221 12345678',
    address: 'Industriestraße 5, 50667 Köln',
    customerSince: '15.03.2018',
  },
  {
    id: 'K-1005',
    displayName: 'Autohaus Becker',
    annualConsumptionKwh: 78900,
    tariff: 'Gewerbe Premium',
    status: 'Inaktiv',
    fullName: 'Autohaus Becker (Ansprechpartner: Paul Becker)',
    email: 'info@autohaus-becker.de',
    phone: '+49 221 55555555',
    address: 'Automeile 3, 51149 Köln',
    customerSince: '10.11.2019',
  },
];

const products = [
  {
    id: 'P-2001',
    name: 'Privat Standard Strom',
    commodity: 'Strom',
    targetGroup: 'Privat',
    basePriceMonthlyEur: 12.9,
    workPriceCtPerKwh: 33.4,
    status: 'Aktiv',
    contractTermMonths: 12,
    noticePeriodWeeks: 4,
    isGreen: false,
    validFrom: '01.01.2026',
  },
  {
    id: 'P-2002',
    name: 'Privat Öko Strom',
    commodity: 'Strom',
    targetGroup: 'Privat',
    basePriceMonthlyEur: 14.9,
    workPriceCtPerKwh: 34.9,
    status: 'Aktiv',
    contractTermMonths: 12,
    noticePeriodWeeks: 4,
    isGreen: true,
    validFrom: '01.01.2026',
  },
  {
    id: 'P-2101',
    name: 'Gewerbe Plus Strom',
    commodity: 'Strom',
    targetGroup: 'Gewerbe',
    basePriceMonthlyEur: 29.0,
    workPriceCtPerKwh: 28.9,
    status: 'Aktiv',
    contractTermMonths: 24,
    noticePeriodWeeks: 6,
    isGreen: false,
    validFrom: '01.01.2026',
  },
  {
    id: 'P-3001',
    name: 'Privat Standard Gas',
    commodity: 'Gas',
    targetGroup: 'Privat',
    basePriceMonthlyEur: 13.5,
    workPriceCtPerKwh: 11.2,
    status: 'Auslaufend',
    contractTermMonths: 12,
    noticePeriodWeeks: 4,
    isGreen: false,
    validFrom: '01.11.2025',
  },
];

const kpis = [
  { label: 'Aktive Kunden', value: '12.480', meta: 'Stand: aktuell' },
  { label: 'Neukunden (30 Tage)', value: '186', meta: '+4,2% ggü. Vormonat' },
  { label: 'Kündigungen (30 Tage)', value: '94', meta: 'Churn: 0,75%' },
  { label: 'Offene Forderungen', value: '184.230 €', meta: 'Überfällig gesamt' },
  { label: 'Monatsumsatz (Schätzung)', value: '1,92 Mio. €', meta: 'Abrechnung noch offen' },
  { label: 'Ø Verbrauch pro Kunde', value: '3.120 kWh', meta: 'Strom (Privat)' },
];

const cases = [
  {
    id: 'F-90012',
    customerRef: 'K-1005 Autohaus Becker',
    amountEur: 1842.5,
    overdueDays: 14,
    status: 'Offen',
    nextStep: 'Kundenkontakt zur Klärung / Zahlungsziel bestätigen',
  },
  {
    id: 'F-90018',
    customerRef: 'K-1001 Schmidt GmbH',
    amountEur: 6420.1,
    overdueDays: 7,
    status: 'In Klärung',
    nextStep: 'Rechnungsprüfung / Klärung mit Fachabteilung',
  },
  {
    id: 'F-90021',
    customerRef: 'K-1002 Familie Müller',
    amountEur: 128.9,
    overdueDays: 3,
    status: 'Offen',
    nextStep: 'Zahlungseingang prüfen, ggf. Erinnerung senden',
  },
];

// --- API Endpoints ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/customers', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT
         id,
         display_name AS displayName,
         annual_consumption_kwh AS annualConsumptionKwh,
         tariff,
         status,
         full_name AS fullName,
         email,
         phone,
         address,
         customer_since AS customerSince
       FROM customers`,
    );

    res.json(rows);
  } catch (err) {
    console.error('DB error /api/customers:', err);
    res.status(500).json({ message: 'DB error' });
  }
});

app.get('/api/customers/:id', (req, res) => {
  const found = customers.find((c) => c.id === req.params.id);
  if (!found) return res.status(404).json({ message: 'Customer not found' });
  res.json(found);
});

app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT
         id,
         name,
         commodity,
         target_group AS targetGroup,
         base_price_monthly_eur AS basePriceMonthlyEur,
         work_price_ct_per_kwh AS workPriceCtPerKwh,
         status,
         contract_term_months AS contractTermMonths,
         notice_period_weeks AS noticePeriodWeeks,
         is_green AS isGreen,
         valid_from AS validFrom
       FROM products`,
    );

    res.json(rows);
  } catch (err) {
    console.error('DB error /api/products:', err);
    res.status(500).json({ message: 'DB error' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT
         id,
         name,
         commodity,
         target_group AS targetGroup,
         base_price_monthly_eur AS basePriceMonthlyEur,
         work_price_ct_per_kwh AS workPriceCtPerKwh,
         status,
         contract_term_months AS contractTermMonths,
         notice_period_weeks AS noticePeriodWeeks,
         is_green AS isGreen,
         valid_from AS validFrom
       FROM products
       WHERE id = ?`,
      [req.params.id],
    );

    const product = rows[0];
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.json(product);
  } catch (err) {
    console.error('DB error /api/products/:id:', err);
    res.status(500).json({ message: 'DB error' });
  }
});

app.get('/api/kpis', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT
         label,
         value_str AS value,
         meta
       FROM kpis
       ORDER BY sort_order`,
    );
    res.json(rows);
  } catch (err) {
    console.error('DB error /api/kpis:', err);
    res.status(500).json({ message: 'DB error' });
  }
});

app.get('/api/cases', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT
         id,
         customer_ref AS customerRef,
         amount_eur AS amountEur,
         overdue_days AS overdueDays,
         status,
         next_step AS nextStep
       FROM cases`,
    );
    res.json(rows);
  } catch (err) {
    console.error('DB error /api/cases:', err);
    res.status(500).json({ message: 'DB error' });
  }
});

app.get('/api/cases/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT
         id,
         customer_ref AS customerRef,
         amount_eur AS amountEur,
         overdue_days AS overdueDays,
         status,
         next_step AS nextStep
       FROM cases
       WHERE id = ?`,
      [req.params.id],
    );

    const caseItem = rows[0];
    if (!caseItem) return res.status(404).json({ message: 'Case not found' });

    res.json(caseItem);
  } catch (err) {
    console.error('DB error /api/cases/:id:', err);
    res.status(500).json({ message: 'DB error' });
  }
});

// Server starten
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API läuft auf http://localhost:${PORT}`);
});
