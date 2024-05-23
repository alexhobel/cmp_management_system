const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const customer = require('../models/customerModel');
const crypto = require('crypto');
const customerConfiguration = require('../models/customerConfigurationModel');
const consentId = require('../models/consentId');

router.delete('/customers', async (req, res) => {
  const domain = req.query.domain;

  try {
    const customerConfig = await customerConfiguration.findOne({ Domain : domain });
    if (!customerConfig) {
      return res.status(404).json({ message: 'Konfiguration nicht gefunden.' });
    }

    const foundCustomer = await customer.findOne({ _id: customerConfig.customer });
    if (!foundCustomer) {
      return res.status(404).json({ message: 'Kunde nicht gefunden.' });
    }

    await customer.deleteOne({ _id: foundCustomer._id });
    await customerConfiguration.deleteOne({ Domain: domain });

    res.status(200).json({ message: 'Kunde und Konfiguration erfolgreich gelöscht.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});


router.put('/customers/config/', async (req, res) => {
  const domain = req.query.domain;
  const {
    farbschema,
    logoUrl,
    buttonColor,
    optoutPosition,
    frontendStyle,
    fontColorButtons,
    impressumUrl,
    datenschutzUrl,
  } = req.body;

  const CookieInformation = req.body.cookieInformation;
  try {
    const customerConfig = await customerConfiguration.findOne({ Domain: domain });
    if (!customerConfig) {
      
      return res.status(404).json({ message: 'Konfiguration nicht gefunden.' });
    } 

    // Aktualisiere die Konfiguration mit den erhaltenen Werten
    customerConfig.logoUrl = logoUrl || customerConfig.logoUrl;
    customerConfig.buttonColor = buttonColor || customerConfig.buttonColor;
    customerConfig.optoutPosition = optoutPosition || customerConfig.optoutPosition;
    customerConfig.frontendStyle = frontendStyle || customerConfig.frontendStyle;
    customerConfig.fontColorButtons = fontColorButtons || customerConfig.fontColorButtons;
    customerConfig.impressumUrl = impressumUrl || customerConfig.impressumUrl;
    customerConfig.datenschutzUrl = datenschutzUrl || customerConfig.datenschutzUrl;
    customerConfig.farbschema = farbschema;
    if (CookieInformation) {
      customerConfig.CookieInformation = CookieInformation;
    }

    const updatedConfig = await customerConfiguration.findByIdAndUpdate(
      customerConfig._id,
      customerConfig,
      { new: true }
    );

    res.status(200).json(updatedConfig);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});


router.get('/customers/config', async (req, res) => {
  const domain = req.query.domain;

  try {
    const customerConfig = await customerConfiguration.findOne({ Domain: domain });
    if (!customerConfig) {
      return res.status(404).json({ message: 'Konfiguration nicht gefunden.' });
    }
    const foundCustomer = await customer.findOne({ _id: customerConfig.customer });
    if (!foundCustomer) {
      return res.status(404).json({ message: 'Kunde nicht gefunden.' });
    }
     const responseData = {
      customer: foundCustomer,
      configuration: customerConfig
    };
    res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/customers', async (req, res) => {
    try {
      const customers = await customer.find();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

router.post('/customers', async (req, res) => {
  try {
      const {
          APIKey,
          Whitelabel,
          Kundenname,
          Kundennummer,
          PrivacySettingsButton,
          UC_Conv_DatumUebersicht,
          url_rating,
          UC_System,
          CustomFrontendVersion_Mipe,
          B2B_partner,
          Domain,
          Datenschutzseite,
          Impressum
      } = req.body;

      const newCustomer = new customer({
          UserID: APIKey,
          Whitelabel,
          Kundenname,
          Kundennummer,
          PrivacySettingsButton,
          UC_Conv_DatumUebersicht,
          url_rating,
          UC_System,
          CustomFrontendVersion_Mipe,
          B2B_partner,
          Domain
      });
      const createdCustomer = await newCustomer.save();
      console.log(typeof(Domain));
      const domainArray = Domain.split(",");
      const customerConfigurations = await Promise.all(domainArray.map(async (domain) => {
          const configId = crypto.createHash('sha256').update(`${Kundennummer}-${domain}`).digest('hex');
          return customerConfiguration.create({
              configId,
              Kundennummer,
              Domain: domain,
              logoUrl: 'https://tracking.ke-webdev.de/customer_logos/keyword-experte.png',
              buttonColor: '#FFFFFF', 
              optoutPosition: 'left', 
              frontendStyle: 'V1', 
              fontColorButtons: 'black',
              impressumUrl: Impressum,
              datenschutzUrl: Datenschutzseite,
              customer: createdCustomer._id
          });
      }));

      res.status(201).json({ customer: createdCustomer, configurations: customerConfigurations });
  } catch (error) {
    console.log(error);
      res.status(500).json({ message: error.message });
  }
});

router.get('/consentIds', async (req, res) => {
  const domain = req.query.domain;
  try {
    const foundConsentIds = await consentId.find({ Domain: domain });
    console.log(consentId);
    if (foundConsentIds.length === 0) {
      return res.status(404).json({ message: 'Keine consentIds für die angegebene Domain gefunden.' });
    }

    res.status(200).json({ foundConsentIds });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server-Fehler' });
  }
});

module.exports = router;
