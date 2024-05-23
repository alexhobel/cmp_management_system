<template>
  <div class="popup-background" v-if="visible" @click="closePopupOnClickOutside">
    <div class="popup">
      <span class="close-icon" @click="closePopup">×</span>
      <form @submit.prevent="submitForm">
        <label>Kundenname:</label>
        <div class="form-group">
          <input type="text" v-model="customer.Kundenname" placeholder="Type here">
        </div>
        <label>Kundennummer:</label>
        <div class="form-group">
          <input type="text" v-model="customer.Kundennummer" placeholder="Type here">
        </div>
        <label>Domain:</label>
        <div class="form-group">
          <input type="text" v-model="customer.Domain" placeholder="Geben Sie eine Domain ein">
        </div>
        <label>Datenschutzseite:</label>
        <div class="form-group">
          <input type="text" v-model="customer.Datenschutzseite" placeholder="URL">
        </div>
        <label>Impressum:</label>
        <div class="form-group">
          <input type="text" v-model="customer.Impressum" placeholder="URL">
        </div>
        <label>API-Key:</label>
        <div class="form-group">
          <div class="copy-icon" @click="copyApiKeyToClipboard">
            <input type="text" v-model="customer.APIKey" placeholder="API-Key" readonly>
            <span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Hier sind die SVG-Paths für das Kopier-Icon -->
                <path fill-rule="evenodd" clip-rule="evenodd" d="M20 4H15.82C15.4 2.84 14.3 2 13 2C11.7 2 10.6 2.84 10.18 4H4C2.9 4 2 4.9 2 6V20C2 21.1 2.9 22 4 22H20C21.1 22 22 21.1 22 20V6C22 4.9 21.1 4 20 4ZM13 4C13.55 4 14 4.45 14 5C14 5.55 13.55 6 13 6C12.45 6 12 5.55 12 5C12 4.45 12.45 4 13 4ZM20 20H4V6H6V8H18V6H20V20Z" fill="#666666"/>
                <path d="M9 11H15V13H9V11Z" fill="#666666"/>
              </svg>
            </span>
          </div>
        </div>
        <button type="submit" class="submit-button">Speichern</button>
      </form>
    </div>
  </div>
</template>

<script>
import sha256 from 'crypto-js/sha256';
export default {
  data() {
    return {
      visible: false,
      customer: {
        Kundenname: '',
        Kundennummer: '',
        Domain: '',
        Datenschutzseite: '',
        Impressum: '',
        APIKey: this.generateUUID()
      }
    };
  },
  methods: {
    generateUUID() {
      return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      );
    },

    isValidUrl(url) {
      const domainWithPathRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;
      return domainWithPathRegex.test(url);
    },

    isNumber(value) {
      return !isNaN(value);
    },

    isValidDomain(domain) {
        const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return domainRegex.test(domain);
      },

    // Methode zum Absenden des Formulars
    submitForm() {

      if (!this.isNumber(this.customer.Kundennummer)) {
        alert("Kundennummer muss eine Zahl sein.");
        return;
      }

      if (!this.isValidUrl(this.customer.Datenschutzseite) || !this.isValidUrl(this.customer.Impressum)) {
        alert("Bitte geben Sie gültige URLs ein.");
        return;
      }

      if (!this.isValidDomain(this.customer.Domain)) {
        alert("Bitte geben Sie eine gültige Domain ein.");
        return;
      }

      fetch('http://localhost:3500/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.customer),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Server Response:', data);
        this.closePopup(); 
        console.log("DOmain: " , this.customer.Domain );
        //const configId = this.generateConfigId(this.customer.Kundennummer, this.customer.Domain);
        this.$router.push({ name: 'Configuration', query: { domain: this.customer.Domain } });
      })
      .catch(error => {
        console.error('Fehler beim Senden der Daten:', error);
      });
    },
    generateConfigId(customerNumber, domain) {
      console.log(customerNumber, domain);
      const hash = sha256(customerNumber + '-' + domain).toString();
      return hash; 
    },
    openPopup() {
      this.visible = true;
      document.addEventListener('click', this.closePopupOnClickOutside);
    },

    closePopup() {
      this.visible = false;
      document.removeEventListener('click', this.closePopupOnClickOutside);
    },

    copyApiKeyToClipboard() {
      navigator.clipboard.writeText(this.customer.APIKey).then(() => {
        console.log('API-Key kopiert');
      }).catch(err => {
        console.error('Fehler beim Kopieren: ', err);
      });
    },

    closePopupOnClickOutside(event) {
      const popup = this.$refs.popup; 

      if (popup && event.target.closest('.popup-background') !== popup) {
        this.closePopup(); // Schließe das Popup
      }
    }
  }
};
</script>


<style>
.accept-btn{
  position: none;
}
  .popup-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
  }

  .popup {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 501px;
    height: 600px;
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }

  .form-group {
    width: calc(100% - 132px);
    margin: 0 66px;
    padding: 16px;
    background: white;
    border-radius: 8px;
    border: 1px solid #CCCCCC;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .form-group label {
    color: #666666;
    font-size: 14px;
    font-family: Ubuntu, sans-serif;
    font-weight: 400;
    margin-bottom: 5px;
  }

  .form-group input {
    width: 100%;
    padding: 8px;
    border: 0px;
    border-radius: 4px;
    outline: none;
  }

  .form-group input:focus {
    border-color: #662d8d;
  }

  .submit-button {
    background-color: #662d8d;
    border-radius: 4px;
    box-shadow: 0px 4px 10px #662d8d3d;
    color: white;
    font-family: "Ubuntu-Medium", Helvetica;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 0.16px;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    display: block;
    margin: 0 auto; /* Zentriert den Button */
    margin-top: 27px;
  }
  .popup label {
    font-size: 12px;
    color: #555;
    margin-bottom: 3px;
  }
  .copy-icon {
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
  }

  /* Zusätzlicher Stil für den Text neben dem Icon */
  .icon-text {
    font-size: 14px;
    color: #666666;
  }
  .close-icon {
  cursor: pointer;
  top: 10px;
  right: 10px;
  width: 20px;
  height: 20px;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 50%;
}
.close-icon:hover {
  color: #000;
  background-color: #ddd;
}
</style>
