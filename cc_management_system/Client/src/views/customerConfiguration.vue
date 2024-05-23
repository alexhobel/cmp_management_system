<template>
  <div class="home-container">
    <AppHeader />
    <div class="customer-info">
      <a :href="configData.domain" class="customer-link" target="_blank" @click="redirectToExternalDomain">
        <h2>{{ customerData.Kundenname }}</h2>
      </a>
      <p>Kundennummer: {{ configData.kundennummer }}</p>
      <p>API-Key : {{ customerData.apiKey }}</p>
      <div class="domain-selector" @click="toggleDropdown">
        <p>
          Konfiguration für Domain: {{ configData.domain }}
          <span v-if="availableDomains.length > 0"> ({{ availableDomains.length }} weitere)</span>
        </p>
        <ul v-show="showDropdown" class="domain-list">
          <li v-for="domain in availableDomains" :key="domain" @click.stop="selectDomain(domain)">{{ domain }}</li>
        </ul>
      </div>
    </div>

    <div class="config-form">
      <div class="input-field">
        <label for="farbschema" class="form-label">Farbschema</label>
        <input type="text" id="logoUrl" v-model="configData.farbschema" class="form-input styled-input">
      </div>
      <div class="input-field">
        <label for="logoUrl" class="form-label">Logo URL:</label>
        <input type="text" id="logoUrl" v-model="configData.logoUrl" class="form-input styled-input">
      </div>
      <div class="input-field">
        <label for="impressumUrl" class="form-label">Impressum URL:</label>
        <input type="text" id="impressumUrl" v-model="configData.impressumUrl" class="form-input styled-input" />
      </div>
      <div class="input-field">
        <label for="datenschutzUrl" class="form-label">Datenschutz URL:</label>
        <input type="text" id="datenschutzUrl" v-model="configData.datenschutzUrl" class="form-input styled-input" />
      </div>


      <!-- Container für die gruppierten Felder -->
      <div>
       <!-- Checkboxen für Cookie-Informationen -->
        <div class="input-field grouped-field">
          <h3 class="input-field grouped-field form-label">Cookie Infos:</h3>
          <div class="checkbox-container">
            <label v-for="(value, key) in configData.cookieInformation" :key="key" class="checkbox-label">
              <input type="checkbox" v-model="configData.cookieInformation[key]" />
              <span class="checkbox-custom"></span>
              {{ key }}
            </label>
          </div>
        </div>
        <div>
        <div class="radio-button-group">
        <!-- OptOut Position -->
        <div class="input-field grouped-field">
          <label class="form-label">Opt-out Position:</label>
          <div class="radio-buttons">
            <label v-for="option in optoutPositions" :key="option.value" class="radio-button">
              <input type="radio" :value="option.value" v-model="configData.optoutPosition" />
              <span class="radio-circle"></span>
              <span class="radio-label">{{ option.label }}</span>
            </label>
          </div>
        </div>

        <!-- Frontend Style -->
        <div class="input-field grouped-field">
          <label class="form-label">Frontend Style:</label>
          <div class="radio-buttons">
            <label v-for="option in frontendStyles" :key="option.value" class="radio-button">
              <input type="radio" :value="option.value" v-model="configData.frontendStyle" />
              <span class="radio-circle"></span>
              <span class="radio-label">{{ option.label }}</span>
            </label>
          </div>
        </div>

        <!-- Font Color Buttons -->
        <div class="input-field grouped-field">
          <label class="form-label">Font Color Buttons:</label>
          <div class="radio-buttons">
            <label v-for="option in fontColorButtons" :key="option.value" class="radio-button">
              <input type="radio" :value="option.value" v-model="configData.fontColorButtons" />
              <span class="radio-circle"></span>
              <span class="radio-label">{{ option.label }}</span>
            </label>
          </div>
        </div>
      </div>

    </div>
  </div>
      <div class="buttons-container">
      <button class="accent-btn customer-config" @click="saveChanges">Änderungen speichern</button>
      <button class="accent-btn customer-config" @click="redirectToCustomerDashboard">Statistiken anzeigen</button>
      <button class="accent-btn delete-btn customer-config" @click="deleteCustomer">Kunde löschen</button>
    </div>
  </div>
</div>

<CustomerListPopup />
</template>


<script>
import sha256 from 'crypto-js/sha256';
import CustomerListPopup from '../components/customerListPopup.vue';


export default {
  components: {
    CustomerListPopup
  },
  data() {
    return {
      customerData: {
        Kundenname: '',
        Domain: [],
        apiKey: '',
      },
      configData: {
        logoUrl: '',
        impressumUrl: '',
        datenschutzUrl: '',
        optoutPosition: 'left',
        frontendStyle: 'V1',
        fontColorButtons: 'black',
        domain: '',
        kundennummer: '',
        cookieInformation: [],
        farbschema: '',
      },
      optoutPositions: [
        { value: 'left', label: 'Left' },
        { value: 'right', label: 'Right' }
      ],
      frontendStyles: [
        { value: 'v1', label: 'v1' },
        { value: 'v2', label: 'v2' }
      ],
      fontColorButtons: [
        { value: 'black', label: 'Black' },
        { value: 'white', label: 'White' }
      ],
      confirmationNeeded: false,
      changesMade: false,
      showDropdown: false
    };
  },
  created() {
    window.onbeforeunload = this.confirmLeave;
  },
  mounted() {
    const domain = this.$route.query.domain;
    if (domain) {
      this.fetchConfigData(domain);
    }
  },

  computed: {
    availableDomains() {
      // Filtere die aktuell bearbeitete Domain aus der Liste
      return this.customerData.Domain.filter(domain => domain !== this.configData.domain);
    }
  },
  methods: {
    async fetchConfigData(domain) {
      try {
        const response = await fetch(`http://localhost:3500/api/customers/config?domain=${domain}`);
        if (!response.ok) {
          throw new Error('Failed to fetch config data');
        }
        const responseData = await response.json();
        console.log(responseData);
        this.configData.farbschema = responseData.configuration.farbschema || '#662d8d'; 
        this.configData.logoUrl = responseData.configuration.logoUrl || '';
        this.configData.impressumUrl = responseData.configuration.impressumUrl || '';
        this.configData.datenschutzUrl = responseData.configuration.datenschutzUrl || '';
        this.configData.optoutPosition = responseData.configuration.optoutPosition || 'left';
        this.configData.frontendStyle = responseData.configuration.frontendStyle || 'V1';
        this.configData.fontColorButtons = responseData.configuration.fontColorButtons || 'black';
        this.configData.domain = responseData.configuration.Domain || '';
        this.configData.cookieInformation = responseData.configuration.CookieInformation || [];
        this.configData.kundennummer = responseData.configuration.Kundennummer;
        this.customerData.Kundenname = responseData.customer.Kundenname;
        this.customerData.Domain = responseData.customer.Domain || [];
        this.customerData.apiKey = responseData.customer.UserID;
        this.originalConfigData = { ...this.configData }; 

      } catch (error) {
        console.error('Error fetching config data:', error);
      }
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    selectDomain(domain) {
      this.selectedDomain = domain;
      this.fetchConfigDataForDomain();
      this.showDropdown = false;
    },
    async saveChanges() {
      const domain = this.$route.query.domain;
      const sendData = JSON.stringify(this.configData);
      console.log(sendData);
      try {
        const response = await fetch(`http://localhost:3500/api/customers/config?domain=${domain}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: sendData 
        });
        console.log(this.configData);
        if (!response.ok) {
          throw new Error('Fehler beim Speichern der Änderungen');
        }

        const data = await response.json();
        console.log('Änderungen erfolgreich gespeichert:', data);
        confirm('Änderungen erfolgreich gespeichert');
      } catch (error) {
        console.error('Fehler beim Speichern der Änderungen:', error);
        // Hier können Sie eine Fehlermeldung anzeigen oder andere Aktionen ausführen
      }
      this.confirmationNeeded = false;
    },
    async deleteCustomer() {
      const domain = this.$route.query.domain;

      const confirmation = confirm('Sind Sie sicher, dass Sie diesen Kunden löschen möchten?');

      if (confirmation) {
        try {
          const response = await fetch(`http://localhost:3500/api/customers?domain=${domain}`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            throw new Error('Fehler beim Löschen des Kunden');
          }
          const data = await response.json();
          console.log('Kunde erfolgreich gelöscht:', data);
          this.$router.push({ name: 'Home' });
        } catch (error) {
          console.error('Fehler beim Löschen des Kunden:', error);
        }
      }
    },
    confirmLeave(event) {
      const changesMade = JSON.stringify(this.configData) !== JSON.stringify(this.originalConfigData);

      if (changesMade) {
        // Hier kannst du die Meldung anpassen, die im Popup-Fenster angezeigt wird
        event.returnValue = 'Es gibt ungespeicherte Änderungen. Möchten Sie die Seite wirklich verlassen?';
        return event.returnValue; // Für ältere Browser
      }
    },
    activateButton() {
      console.log("acticateButton");
      this.changesMade = true;
    },
    redirectToExternalDomain() {
      const externalDomain = this.configData.domain;
      window.open(`http://${externalDomain}`, '_blank');
    },
    async fetchConfigDataForDomain() {
      //const newConfigId = this.generateConfigId(this.configData.kundennummer, this.selectedDomain);
      await this.fetchConfigData(this.selectedDomain);
      this.$router.replace({ query: { domain:  this.selectedDomain} });
    },
    generateConfigId(customerNumber, domain) {
      const hash = sha256(`${customerNumber}-${domain}`).toString();
      return hash;
    },
    redirectToCustomerDashboard() {
      this.$router.push({
        name: 'CustomerDashboard',
        query: { domain: this.configData.domain }
      });
    },
  },
};
</script>


<style>

.home-container{
  background: none;
}

.disabled-btn {
  opacity: 0.5;
  cursor: not-allowed;
}
.form-input.styled-input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 15.5px;
  font-family: Ubuntu, sans-serif;
  font-weight: 500;
  letter-spacing: 0.15px;
  color: black;
  width: 100%;
  transition: border-color 0.3s ease-in-out;
}

.form-label {
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
}

.radio-buttons {
  display: flex;
  flex-direction: column;
}

.radio-button {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;
}
.domain-selector {
  position: relative;
  cursor: pointer;
}

.domain-selector select {
  display: none; 
  position: absolute; 
  top: 100%;
  left: 0;
} 

.radio-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #666;
  margin-right: 10px;
}

.radio-button input[type="radio"] {
  display: none;
}

.radio-button input[type="radio"]:checked + .radio-circle {
  background-color: #662d8d;
  border-color: #662d8d;
}

.radio-label {
  font-size: 14px;
  color: #666;
}

.grouped-fields-container {
  display: flex;
}

.grouped-field {
  margin-right: 10px; /* Adjust the margin as needed */
}

.radio-button-group{
  display: flex;
}


.grouped-field:last-child {
  margin-right: 0; /* Entferne den rechten Rand für das letzte Feld */
}

.customer-info {
  max-width: 500px;
  margin: 0 auto;
  margin-top: 20px;
  margin-bottom: 20px;
  background: #f8f8f8;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-family: 'Ubuntu', sans-serif;
  text-align: center;
}

.customer-info h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 15px;
}

.customer-info p {
  font-size: 16px;
  color: #666;
  margin: 5px 0;
}

.domain-selector {
  margin-top: 20px;
  position: relative;
  display: inline-block;
}

.domain-selector p {
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
  cursor: pointer;
}

.domain-selector span {
  font-size: 14px;
  color: #666;
  margin-left: 5px;
}

.domain-selector .domain-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border: 1px solid #ccc;
  list-style: none;
  padding: 5px 0;
  margin: 5px 0 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.domain-selector .domain-list li {
  padding: 10px 15px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
}

.domain-selector .domain-list li:hover {
  background-color: #eee;
}
.config-form {
  max-width: 600px; /* Begrenze die Breite der Form */
  margin: 20px auto; /* Zentriere die Form und gib ihr einen oberen und unteren Rand */
  background: #ffffff; 
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.input-field {
  margin-bottom: 20px; 
}

.form-input.styled-input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box; 
  transition: border-color 0.3s ease-in-out;
}

.form-input.styled-input:focus {
  border-color: #662d8d; /* Farbe bei Fokus */
  outline: none; /* Entferne den Standardfokus-Rahmen */
}

.form-label {
  display: block;
  margin-bottom: 8px; 
  font-size: 16px;
  color: #333;
}

.customer-config{
  margin-left: 10px;
}

.delete-btn {
  background-color: #F44336; 
}

.delete-btn:hover {
  background-color: #D32F2F;
}
.buttons-container {
  text-align: center;  
  padding: 20px 0; 
}

.checkbox-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #666;
  margin-right: 10px;
  border-radius: 4px;
  position: relative;
}

.checkbox-label input[type="checkbox"] {
  display: none;
}

.checkbox-label input[type="checkbox"]:checked + .checkbox-custom {
  background-color: #662d8d;
  border-color: #662d8d;
}

.checkbox-label input[type="checkbox"]:checked + .checkbox-custom::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 1px;
  width: 8px;
  height: 14px;
  border: solid white;
  border-width: 0 3px 3px 0;
  transform: rotate(45deg);
}

.customer-link {
  text-decoration: none;
  color: #333; /* Farbe für den Linktext */
  cursor: pointer; /* Ändert den Cursor-Stil auf Zeiger, um anzuzeigen, dass es klickbar ist */
}

.customer-link:hover {
  text-decoration: underline; /* Fügt beim Hover eine Unterstreichung hinzu */
}

</style>