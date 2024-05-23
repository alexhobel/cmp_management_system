const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3500;
const customerRoutes = require('./routes/customer');
const statsRoutes = require('./routes/stats');


app.use(cors({
  origin: '*',
}));

// Body-Parser für JSON-Anfragen
app.use(express.json());

// Definieren der Endpunkte für Kunden und Kundenkonfiguration
app.use('/api', customerRoutes);
app.use('/api', statsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
