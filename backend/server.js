require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();

// -------------------------
// Dev/Prod Mode
// -------------------------
const NODE_ENV = (process.env.NODE_ENV || 'development').toLowerCase();
const IS_PROD = NODE_ENV === 'production';

// -------------------------
// Helpers
// -------------------------
function fmtDate(d) {
  if (!d) return null;
  const dt = new Date(d);
  const dd = String(dt.getDate()).padStart(2, '0');
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const yyyy = dt.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

function fmtNumberDE(n, digits = 0) {
  if (n === null || n === undefined) return null;
  return Number(n).toLocaleString('de-DE', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

// -------------------------
// Middleware
// -------------------------
app.use(express.json());

// CORS: mehrere Origins als CSV
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:4200')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

// robust: lässt requests ohne Origin zu (z.B. curl/postman)
app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true);

      // exakt erlaubte Origins
      if (allowedOrigins.includes(origin)) return cb(null, true);

      // optional: Vercel Preview Deployments erlauben
      if (origin.endsWith('.vercel.app')) return cb(null, true);

      return cb(new Error(`CORS blocked: ${origin}`));
    },
    credentials: false,
  }),
);

// -------------------------
// DB Runtime Debug (NUR DEV)
// -------------------------
if (!IS_PROD) {
  pool
    .query('SELECT DATABASE() AS db, @@hostname AS host, @@port AS port')
    .then(([rows]) => console.log('DB RUNTIME:', rows[0]))
    .catch((e) => console.error('DB RUNTIME error:', e));
}

// -------------------------
// Health + Root
// -------------------------
app.get('/', (req, res) => {
  res.type('text/plain').send('API is running. Try /api/health');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', env: NODE_ENV });
});

// =========================
// Customers
// =========================
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

    res.json(
      rows.map((r) => ({
        ...r,
        customerSince: fmtDate(r.customerSince),
      })),
    );
  } catch (err) {
    console.error('DB error /api/customers:', err);
    res.status(500).json({ message: 'DB error' });
  }
});

app.get('/api/customers/:id', async (req, res) => {
  try {
    const id = decodeURIComponent(String(req.params.id || '')).trim();

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
      [id],
    );

    const customer = rows[0];
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    res.json({
      ...customer,
      customerSince: fmtDate(customer.customerSince),
    });
  } catch (err) {
    console.error('DB error /api/customers/:id:', err);
    res.status(500).json({ message: 'DB error' });
  }
});

// =========================
// Products
// =========================
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

    res.json(
      rows.map((r) => ({
        ...r,
        validFrom: fmtDate(r.validFrom),
      })),
    );
  } catch (err) {
    console.error('DB error /api/products:', err);
    res.status(500).json({ message: 'DB error' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const id = decodeURIComponent(String(req.params.id || '')).trim();

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
      [id],
    );

    const product = rows[0];
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.json({
      ...product,
      validFrom: fmtDate(product.validFrom),
    });
  } catch (err) {
    console.error('DB error /api/products/:id:', err);
    res.status(500).json({ message: 'DB error' });
  }
});

// =========================
// Utilities (KPIs + Cases)
// =========================
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
    const id = decodeURIComponent(String(req.params.id || '')).trim();

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
      [id],
    );

    const caseItem = rows[0];
    if (!caseItem) return res.status(404).json({ message: 'Case not found' });

    res.json(caseItem);
  } catch (err) {
    console.error('DB error /api/cases/:id:', err);
    res.status(500).json({ message: 'DB error' });
  }
});

// =========================
// Lokation & Messwesen
// =========================
app.get('/api/market-locations', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT
         ml.id,
         ml.address,
         ml.commodity,
         ml.status,
         ml.usage_type AS usageType,
         ml.grid_area AS gridArea,

         cu.id AS partnerId,
         cu.display_name AS partnerName,

         ct.id AS contractId,
         ct.start_date AS contractStartDate,
         p.id AS productId,
         p.name AS productName
       FROM market_locations ml
       JOIN customers cu ON cu.id = ml.customer_id
       LEFT JOIN contracts ct
         ON ct.malo_id = ml.id AND ct.status = 'Aktiv'
       LEFT JOIN products p
         ON p.id = ct.product_id
       ORDER BY ml.id`,
    );

    res.json(
      rows.map((r) => ({
        id: r.id,
        address: r.address,
        commodity: r.commodity,
        status: r.status,
        usageType: r.usageType,
        gridArea: r.gridArea,
        partner: { id: r.partnerId, name: r.partnerName },
        activeContract: r.contractId
          ? {
              id: r.contractId,
              product: `${r.productId} · ${r.productName}`,
              startDate: fmtDate(r.contractStartDate),
            }
          : null,
      })),
    );
  } catch (err) {
    console.error('DB error /api/market-locations:', err);
    res.status(500).json({ message: 'DB error' });
  }
});

app.get('/api/market-locations/:id', async (req, res) => {
  try {
    const maloId = decodeURIComponent(String(req.params.id || '')).trim();

    const [maloRows] = await pool.query(
      `SELECT
         ml.id,
         ml.address,
         ml.commodity,
         ml.status,
         ml.usage_type AS usageType,
         ml.grid_area AS gridArea,

         c.id AS customerId,
         c.display_name AS customerName,

         ct.id AS contractId,
         ct.start_date AS contractStartDate,
         p.id AS productId,
         p.name AS productName
       FROM market_locations ml
       JOIN customers c ON c.id = ml.customer_id
       LEFT JOIN contracts ct
         ON ct.malo_id = ml.id AND ct.status = 'Aktiv'
       LEFT JOIN products p
         ON p.id = ct.product_id
       WHERE ml.id = ?
       LIMIT 1`,
      [maloId],
    );

    const malo = maloRows[0];
    if (!malo) return res.status(404).json({ message: 'Market location not found' });

    const [meloRows] = await pool.query(
      `SELECT
         id AS meloId,
         measurement_type AS measurementType
       FROM meter_locations
       WHERE malo_id = ? AND status = 'Aktiv'
       ORDER BY id
       LIMIT 1`,
      [maloId],
    );
    const melo = meloRows[0] || null;

    let meter = null;
    if (melo?.meloId) {
      const [meterRows] = await pool.query(
        `SELECT
           meter_number AS meterNumber,
           device_type AS meterType,
           install_date AS installDate,
           register_code AS registerCode
         FROM meters
         WHERE melo_id = ?
         ORDER BY meter_number
         LIMIT 1`,
        [melo.meloId],
      );
      meter = meterRows[0] || null;
    }

    let lastReading = null;
    if (meter?.meterNumber) {
      const [readRows] = await pool.query(
        `SELECT
           reading_date AS readingDate,
           reading_value AS readingValue,
           reading_unit AS readingUnit,
           reading_type AS readingType
         FROM meter_readings
         WHERE meter_number = ?
         ORDER BY reading_date DESC
         LIMIT 1`,
        [meter.meterNumber],
      );
      lastReading = readRows[0] || null;
    }

    res.json({
      id: malo.id,
      address: malo.address,
      commodity: malo.commodity,
      status: malo.status,

      usageType: malo.usageType,
      gridArea: malo.gridArea,

      partner: { id: malo.customerId, name: malo.customerName },

      activeContract: malo.contractId
        ? {
            id: malo.contractId,
            product: `${malo.productId} · ${malo.productName}`.trim(),
            startDate: fmtDate(malo.contractStartDate),
          }
        : null,

      meter: {
        meloId: melo?.meloId || '—',
        measurementType: melo?.measurementType || null,

        meterNumber: meter?.meterNumber || '—',
        meterType: meter?.meterType || null,
        installDate: meter?.installDate ? fmtDate(meter.installDate) : null,
        register: meter?.registerCode || null,

        readingDate: lastReading?.readingDate ? fmtDate(lastReading.readingDate) : '—',
        readingValue: lastReading
          ? `${fmtNumberDE(lastReading.readingValue, 0)} ${lastReading.readingUnit}`
          : '—',
        readingType: lastReading?.readingType || '—',
      },
    });
  } catch (err) {
    console.error('DB error /api/market-locations/:id:', err);
    res.status(500).json({ message: 'DB error' });
  }
});

// =========================
// Verträge & Abrechnung
// =========================
app.get('/api/contracts', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT
         c.id,
         c.status,
         c.commodity,
         c.malo_id AS maloId,
         c.start_date AS startDate,
         c.end_date AS endDate,

         cu.id AS partnerId,
         cu.display_name AS partnerName,

         p.id AS productId,
         p.name AS productName,
         p.valid_from AS productValidFrom
       FROM contracts c
       JOIN customers cu ON cu.id = c.customer_id
       JOIN products p ON p.id = c.product_id
       ORDER BY (c.status='Aktiv') DESC, c.start_date DESC`,
    );

    res.json(
      rows.map((r) => ({
        id: r.id,
        status: r.status,
        commodity: r.commodity,
        maloId: r.maloId,
        startDate: fmtDate(r.startDate),
        endDate: r.endDate ? fmtDate(r.endDate) : null,
        partner: { id: r.partnerId, name: r.partnerName },
        product: { id: r.productId, name: r.productName, validFrom: fmtDate(r.productValidFrom) },
      })),
    );
  } catch (err) {
    console.error('DB error /api/contracts:', err);
    res.status(500).json({ message: 'DB error' });
  }
});

// Detail Vertrag (Frontend-Shape für ContractsPage)
app.get('/api/contracts/:id', async (req, res) => {
  try {
    const contractId = decodeURIComponent(String(req.params.id || '')).trim();

    const [rows] = await pool.query(
      `SELECT
         c.id,
         c.status,
         c.commodity,
         c.malo_id AS maloId,
         c.start_date AS startDate,
         c.end_date AS endDate,

         c.term_months AS termMonths,
         c.notice_weeks AS noticeWeeks,
         c.account_id AS accountId,

         c.installment_eur_monthly AS installmentEurMonthly,
         c.installment_valid_from AS installmentValidFrom,
         c.installment_reason AS installmentReason,

         c.last_payment_date AS lastPaymentDate,
         c.last_payment_amount_eur AS lastPaymentAmountEur,
         c.last_payment_method AS lastPaymentMethod,
         c.last_payment_status AS lastPaymentStatus,

         cu.id AS partnerId,
         cu.display_name AS partnerName,

         p.id AS productId,
         p.name AS productName,
         p.valid_from AS productValidFrom
       FROM contracts c
       JOIN customers cu ON cu.id = c.customer_id
       JOIN products p ON p.id = c.product_id
       WHERE c.id = ?
       LIMIT 1`,
      [contractId],
    );

    const r = rows[0];
    if (!r) return res.status(404).json({ message: 'Contract not found', id: contractId });

    const [opRows] = await pool.query(
      `SELECT
         op_no AS opNo,
         amount_eur AS amountEur,
         overdue_days AS overdueDays,
         dunning_level AS dunningLevel,
         status
       FROM open_items
       WHERE contract_id = ?
       ORDER BY overdue_days DESC`,
      [contractId],
    );

    res.json({
      id: r.id,
      status: r.status,
      commodity: r.commodity,
      maloId: r.maloId,

      startDate: fmtDate(r.startDate),
      endDate: r.endDate ? fmtDate(r.endDate) : null,

      termMonths: r.termMonths,
      noticeWeeks: r.noticeWeeks,
      accountId: r.accountId,

      partner: { id: r.partnerId, name: r.partnerName },
      product: { id: r.productId, name: r.productName, validFrom: fmtDate(r.productValidFrom) },

      installmentEurMonthly: Number(r.installmentEurMonthly),
      installmentValidFrom: fmtDate(r.installmentValidFrom),
      installmentReason: r.installmentReason,

      openItems: opRows.map((op) => ({
        opNo: op.opNo,
        amountEur: Number(op.amountEur),
        overdueSince: `${op.overdueDays} Tage`,
        dunningLevel: op.dunningLevel,
        status: op.status,
      })),

      lastPayment: {
        date: fmtDate(r.lastPaymentDate),
        amountEur: Number(r.lastPaymentAmountEur),
        method: r.lastPaymentMethod,
        status: r.lastPaymentStatus,
      },
    });
  } catch (err) {
    console.error('DB error /api/contracts/:id:', err);
    res.status(500).json({ message: 'DB error' });
  }
});

// -------------------------
// API 404 (hilft beim Debuggen)
// -------------------------
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'Unknown API route', path: req.originalUrl });
});

// -------------------------
// Start
// -------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT} (env=${NODE_ENV})`);
});
