const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();

app.use(express.json());

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:4200')
  .split(',')
  .map((s) => s.trim());

app.use(
  cors({
    origin: allowedOrigins,
  }),
);

app.use(express.json());

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

app.get('/api/customers/:id', async (req, res) => {
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
       FROM customers
       WHERE id = ?`,
      [req.params.id],
    );

    const customer = rows[0];
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    res.json(customer);
  } catch (err) {
    console.error('DB error /api/customers/:id:', err);
    res.status(500).json({ message: 'DB error' });
  }
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
