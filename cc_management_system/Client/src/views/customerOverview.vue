<template>
  <div class="kundenbersicht-start">
    <headerComponent />
    <customer-popup ref="CustomerPopup"></customer-popup>
    <div class="filter-container">
      <div class="body">
        <div class="filter">
          <div class="filter-elements">
            <div class="input-wrapper">
              <input type="text" v-model="searchQuery" class="search-input" placeholder="Domain, Kundenname, Kundennummer..." @keyup.enter="filterCustomers" />
            </div>
            <button class="accent-btn search-btn" @click="filterCustomers">Suche</button>
          </div>
        </div>
    </div>
    </div>
    <div class="customer-list-container">
      <div class="additional-elements">
            <div class="total-customers">Total: {{ filteredCustomers.length }} Kunden</div>
            <button class="accent-btn create-customer-btn" @click="openCustomerPopup">Kunde anlegen</button>
          </div>
      <div class="customer-list-header">
        <div class="customer-column">Name</div>
        <div class="customer-column">Kundennummer</div>
        <div class="customer-column">API-Key</div>
        <div class="customer-column">Domains</div>
      </div>
      <div class="customer-list customer-list-overview ">
    <div v-for="customer in filteredCustomers" :key="customer._id" class="customer-row">
      <div class="customer-column">
        <span @click="redirectToCustomerConfig(customer)">
          {{ customer.Kundenname }}
        </span>
      </div>
      <div class="customer-column">{{ customer.Kundennummer }}</div>
      <div class="customer-column">{{ customer.UserID }}</div>
      <div class="customer-column">{{ customer.Domain.join(', ') }}</div>
    </div>
  </div>
    </div>
  </div>
  <CustomerListPopup />
  
</template>

<script>
import CustomerPopup from '../components/customerPopup.vue';
//import sha256 from 'crypto-js/sha256';

export default {
  components: {
    // Ihre anderen Komponenten
    CustomerPopup
  },
  name: "customerOverview",
  data() {
    return {
      customers: [],
      filteredCustomers: [],
      searchQuery: '',
    };
  },
  created() {
    fetch('http://localhost:3500/api/customers')
      .then(response => response.json())
      .then(data => {
        this.customers = data;
        this.filteredCustomers = data;
      })
      .catch(error => console.error('Fehler beim Abrufen der Kunden:', error));
  },
  methods: {
    filterCustomers() {
      if (this.searchQuery) {
        const normalizedQuery = this.normalizeDomain(this.searchQuery);
        this.filteredCustomers = this.customers.filter(customer =>
          (customer.Kundenname && customer.Kundenname.toLowerCase().includes(normalizedQuery.toLowerCase())) ||
          (customer.Kundennummer && customer.Kundennummer.toString().includes(normalizedQuery)) ||
          (customer.UserID && customer.UserID.toLowerCase().includes(normalizedQuery.toLowerCase())) ||
          (customer.Domain && customer.Domain.some(domain => domain.toLowerCase().includes(normalizedQuery.toLowerCase())))
        );
      } else {
        this.filteredCustomers = this.customers;
      }
    },
    redirectToCustomerConfig(customer) {
      const domain = customer.Domain.length > 0 ? customer.Domain[0] : '';
      //const configId = this.generateConfigId(customer.Kundennummer, domain);
      this.$router.push({ name: 'Configuration', query: { domain: domain } });
    },
    normalizeDomain(searchQuery) {
      // Entfernen des Protokolls (z.B. https://www.) und des Pfades nach der Domain
      const domainPattern = /^(?:https?:\/\/)?(?:www\.)?([^/]+)/;
      const match = searchQuery.match(domainPattern);
      return match ? match[1] : searchQuery;
    },
    openCustomerPopup() {
      this.$refs.CustomerPopup.openPopup();
    },
    /*
    generateConfigId(customerNumber, domain) {
      console.log(customerNumber, domain);
      const hash = sha256(customerNumber + '-' + domain).toString();
      // Benutze den ganzen Hash oder einen Teil davon als ID
      return hash; // oder hash.substr(0, 32) für einen kürzeren Hash
    }*/

  }
};
</script>


<style>
  .body {
    background-color: #F4F4F4;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0px;
    margin-top: 33px; /* Abstand zum Header */
  }

  .box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 800px;
  }

  .filter {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #ffffff;
    border-radius: 5px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    width: calc(100% - 40px); /* Abstand von 40px vom rechten Rand */
    padding: 10px 20px;
    box-sizing: border-box;
    margin-bottom: 33px;
    position: relative; /* Position relativ für die absolute Positionierung */
  }

  .accept-btn {
    position: absolute;
    right: 20px; /* Abstand vom rechten Rand */
  }

  .filter-elements {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: 100%;
  }

  .input-wrapper {
  position: relative;
  flex-grow: 1;
  margin-right: 10px; /* Abstand zwischen Suchfeld und Button */
}

.additional-elements {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  background-color: white;
  border-bottom: 1px solid #EBEFF2; /* Trennlinie unter den zusätzlichen Elementen */
}

.total-customers {
  font-size: 14px;
  color: black;
}


  .filter .text-wrapper {
    color: #b6b6b6;
    font-family: "Ubuntu-Light", Helvetica;
    font-size: 16px;
    font-weight: 300;
  }


  .search-input {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-family: "Ubuntu-Light", Helvetica;
  color: #b6b6b6;
  }

  .search-input:focus {
    outline: none;
  }

  .search-btn {
  position: absolute;
  right: 14px; /* Abstand vom rechten Rand */
}

  .accent-btn {
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
  }

  .accent-btn:hover{
    background-color: #522470;
  }

  .create-customer-btn {
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
}


  .customer-list-container {
    box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.06);
    border-radius: 5px;
    overflow: hidden;
    background-color: white;
    margin: 0 23px;
    position: relative;
    width: calc(100% - 46px);
    margin-bottom: 20px;
  }

  .customer-list-header {
    background-color: white;
    font-weight: bold;
  }

  .customer-list-header,
  .customer-row {
    display: flex;
    justify-content: space-between;
    padding: 10px;
  }

  .customer-list {
    overflow-y: auto;
    width: 100%;
    }

  .customer-list-overview{
    max-height: calc(100vh - 340px);
  }
    .customer-column span {
      cursor: pointer;
    }



  .customer-column {
    flex: 1; /* Gleichmäßige Aufteilung */
    padding: 5px;
    text-align: left;
  }


  .customer-column:nth-child(2) {
    flex: 0.5; /* Kleinere Spalte für Kundennummer */
  }

  .customer-row:not(:last-child) {
    border-bottom: 1px solid #EBEFF2;
  }
</style>
 