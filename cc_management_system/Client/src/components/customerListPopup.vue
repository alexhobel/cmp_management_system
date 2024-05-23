<template>
  <div v-if="showPopup" class="popup-background">
    <div class="popup">
      <div class="customer-list-container">
        <div class="search-filter">
          <input type="text" v-model="searchQuery" class="search-input" placeholder="Domain, Kundenname, Kundennummer..." @keyup.enter="filterCustomers" />
          <button class="accent-btn search-btn" @click="filterCustomers">Suche</button>
        </div>
        <div class="customer-list customer-list-popup">
          <div class="customer-list-header">
            <div class="customer-column">Kundenname</div>
            <div class="customer-column">Kundennummer</div>
          </div>
          <div v-for="customer in filteredCustomers" :key="customer.Kundennummer" class="customer-row" @click="selectCustomer(customer)">
            <div class="customer-column">{{ customer.Kundenname }}</div>
            <div class="customer-column">{{ customer.Kundennummer }}</div>
          </div>
        </div>
     </div>
     <button @click="goToCustomerOverview" class="accent-btn customerListPopupButton">Zurück zur Kundenübersicht</button>
    </div>
  </div>
</template>
  
<script>
export default {
  name: 'CustomerListPopup',
  data() {
    return {
      showPopup: false,
      customers: [],
      filteredCustomers: [],
      searchQuery: '',
    };
  },
  mounted() {
    // Überprüfen, ob keine Query-Parameter in der URL vorhanden sind
    if (!this.$route.query || Object.keys(this.$route.query).length === 0) {
      this.showPopup = true; // Zeige das Popup, wenn keine Query-Parameter vorhanden sind
      this.loadCustomerList(); // Lade die Kundenliste
    }
  },
  methods: {
    async loadCustomerList() {
      try {
        const response = await fetch('http://localhost:3500/api/customers');
        if (!response.ok) {
          throw new Error('Failed to fetch customer list');
        }
        const data = await response.json();
        this.customers = data;
        this.filteredCustomers = data;
      } catch (error) {
        console.error('Error loading customer list:', error);
      }
    },
    filterCustomers() {
      if (this.searchQuery) {
        const normalizedQuery = this.searchQuery.toLowerCase().trim();
        this.filteredCustomers = this.customers.filter(customer =>
          (customer.Kundenname && customer.Kundenname.toLowerCase().includes(normalizedQuery)) ||
          (customer.Kundennummer && customer.Kundennummer.toString().includes(normalizedQuery))
        );
      } else {
        this.filteredCustomers = this.customers;
      }
    },
    goToCustomerOverview() {
      // Hier wird die Route zur Kundenübersicht aufgerufen
      this.$router.push({ name: 'Home' });
    },
    selectCustomer(customer) {
      const currentQuery = { ...this.$route.query }; // Kopiere die aktuellen Query-Parameter
      const newDomain = customer.Domain[0];

      // Überprüfe, ob der Parameter bereits vorhanden ist, um ihn nicht zu überschreiben
      if (!currentQuery.domain) {
        currentQuery.domain = newDomain; // Füge den neuen Parameter hinzu

        // Überprüfe, ob sich der Benutzer auf der Konfigurationsseite befindet
        if (this.$route.name === 'Configuration') {
          console.log("Config")
          const queryParams = new URLSearchParams(currentQuery).toString();
          const newUrl = `${window.location.origin}${window.location.pathname}?${queryParams}`;

          // Lade die Seite neu mit der aktualisierten URL
          window.location.href = newUrl;
        } else {
          console.log("Nicht config");
          const queryParams = new URLSearchParams(currentQuery).toString();
          const newUrl = `${window.location.origin}${window.location.pathname}?${queryParams}`;

          // Lade die Seite neu mit der aktualisierten URL
          window.location.href = newUrl;
        }
      }

      this.showPopup = false;
    }
  }
};
</script>

<style>
  .customer-list-popup {
    height: 450px;
    overflow-y: auto;
    margin-top: 20px;
  }

  .search-filter {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .search-input {
    flex: 1;
    margin-right: 10px;
    padding: 12px;
    border-radius: 4px;
    transition: border-color 0.3s ease; 
  }

  .search-input:focus {
    border-color: #662d8d; 
    outline: none; 
  }


  .customer-list-header {
    display: flex;
    position: sticky;
    top: 0;
    background-color: #fff; 
    z-index: 1; 
  }

  .customer-column {
    flex: 1;
    padding: 8px;

  }

  .customer-list-header .customer-column:first-child {
    position: sticky;
    left: 0;
    z-index: 2; 
    background-color: #fff; 
  }
</style>
