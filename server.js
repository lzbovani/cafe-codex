const fs = require('fs');
const path = require('path');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;

const defaultDbPath = process.env.RENDER
  ? path.join('/tmp', 'cafe-codex', 'clicks.db')
  : path.join(__dirname, 'data', 'clicks.db');
const dbPath = process.env.DB_PATH || defaultDbPath;
const dbDir = path.dirname(dbPath);

fs.mkdirSync(dbDir, { recursive: true });

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS purchase_clicks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_name TEXT NOT NULL,
      price_label TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/click', (req, res) => {
  const { productName, priceLabel } = req.body || {};

  if (!productName || !priceLabel) {
    return res.status(400).json({ error: 'Campos obrigatorios ausentes.' });
  }

  db.run(
    'INSERT INTO purchase_clicks (product_name, price_label) VALUES (?, ?)',
    [productName, priceLabel],
    function onInsert(err) {
      if (err) {
        return res.status(500).json({ error: 'Falha ao salvar clique.' });
      }

      return res.status(201).json({ ok: true, id: this.lastID });
    }
  );
});

app.get('/api/ranking', (_req, res) => {
  db.all(
    `
      SELECT
        product_name AS productName,
        price_label AS priceLabel,
        COUNT(*) AS totalClicks
      FROM purchase_clicks
      GROUP BY product_name, price_label
      ORDER BY totalClicks DESC
    `,
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Falha ao obter ranking.' });
      }

      return res.json({ ranking: rows });
    }
  );
});

app.get('/health', (_req, res) => {
  res.json({ ok: true, dbPath });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Banco SQLite em: ${dbPath}`);
});
