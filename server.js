const express = require('express');
const { runQuery } = require('./bigqueryClient');
require('dotenv').config();
const cors = require('cors'); // ⬅️ Import CORS
const app = express();
const PORT = process.env.PORT || 3000;



app.use(cors({
    origin: 'http://localhost:5177'
  }));
  // Example endpoint
app.get('/api/data', async (req, res) => {
  try {
    const query = `
    SELECT * FROM \`resonant-tract-451705-j0.bcl_transformed_data.dashboard_data\`
    LIMIT 10
  `;
  

    const data = await runQuery(query);
    res.json({ success: true, data });
  } catch (error) {
    console.error('BigQuery Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
