const express = require('express');
const router = express.Router();
const zlib = require('zlib');
const StatsModel = require('../models/statsModel');
const Customer = require('../models/customerModel');

router.get('/stats', async (req, res) => {
  try {
    const domain = req.query.domain;
    const start = new Date(req.query.start);
    const end = new Date(req.query.end);
    console.log('Domain:', domain, 'Start:', start, 'End:', end);

    const customer = await Customer.findOne({ Domain: domain });


    if (!customer) {
      return res.status(404).json({ message: 'Kunde nicht gefunden' });
    }

    const statsData = await StatsModel.find({
      domain: domain,
      datum: { $gte: start, $lte: end }
    });
    console.log(statsData);
    res.json({ customer, statsData });
  } catch (error) {
    console.error('Fehler:', error);
    res.status(500).json({ message: 'Server-Fehler' });
  }
});

router.get('/allStats', async (req, res) => {
  try {
    const start = new Date(req.query.start);
    const end = new Date(req.query.end);
    console.log('Start:', start, 'End:', end);

    const allStatsWithinRange = await StatsModel.aggregate([
      {
        $match: {
          datum: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$datum' } },
            customerNumber: '$kundenNr'
          },
          acceptAllChoiceCounts: { $sum: '$acceptAllChoiceCounts' },
          ccmPopupCounts: { $sum: '$ccmPopupCounts' },
          declineChoiceCounts: { $sum: '$declineChoiceCounts' },
          essentialCounts: { $sum: '$essentialCounts' },
          openReconsentMenuCounts: { $sum: '$openReconsentMenuCounts' },
          reconsentCounts: { $sum: '$reconsentCounts' },
        }
      },
      {
        $group: {
          _id: '$_id.date',
          acceptAllChoiceCounts: { $sum: '$acceptAllChoiceCounts' },
          ccmPopupCounts: { $sum: '$ccmPopupCounts' },
          declineChoiceCounts: { $sum: '$declineChoiceCounts' },
          essentialCounts: { $sum: '$essentialCounts' },
          openReconsentMenuCounts: { $sum: '$openReconsentMenuCounts' },
          reconsentCounts: { $sum: '$reconsentCounts' },
          numberOfCustomers: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          datum: '$_id',
          acceptAllChoiceCounts: 1,
          ccmPopupCounts: 1,
          declineChoiceCounts: 1,
          essentialCounts: 1,
          openReconsentMenuCounts: 1,
          reconsentCounts: 1,
          numberOfCustomers: 1,
        }
      },
      {
        $sort: {
          datum: 1 
        }
      }
    ]);
console.log(allStatsWithinRange);
    res.json({ allStatsWithinRange });
  } catch (error) {
    console.error('Fehler:', error);
    res.status(500).json({ message: 'Server-Fehler' });
  }
});


module.exports = router;
