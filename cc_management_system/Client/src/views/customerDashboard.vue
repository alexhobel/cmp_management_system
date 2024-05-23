<template>
  <div class="dashboard-container">


    <div class="customer-info">
      <a :href="getExternalDomainURL()" class="customer-link" target="_blank">
        <div class="customer-header">
          <h2 class="customer-name">{{ customerData.Kundenname }}</h2>
        </div>
        <p class="customer-number">Kundennummer: {{ customerData.Kundennummer }}</p>
      </a>
      <div class="domain-selector" @click="toggleDropdown">
        <p>
          Statistiken für Domain: {{ queryData.domain }}
          <span v-if="availableDomains.length > 0"> ({{ availableDomains.length }} weitere)</span>
        </p>
        <ul v-show="showDropdown" class="domain-list">
          <li v-for="domain in availableDomains" :key="domain" @click.stop="selectDomain(domain)">{{ domain }}</li>
        </ul>
      </div>
      
    </div>

    <!-- Date Range Selector with Calendar -->
    <div class="date-input-container">
      <label for="dateRange">Zeitraum:</label>
      <flat-pickr v-model="selectedDates" :config="datePickerConfig"></flat-pickr>
      <button class="accent-btn" @click="fetchDataByDateRange">Aktualisieren</button>
      <button class="accent-btn" @click="fetchLast30DaysData" style="margin-left: 10px;">Letzte 30 Tage</button>
    </div>
    <div ref="plot" class="plot-container"></div>
    <div class="plot-container pie-charts-container">
      <div ref="pieChart1" class="pie-chart"></div>
      <div ref="pieChart2" class="pie-chart"></div>
      <div ref="pieChart3" class="pie-chart"></div>
    </div>
    <div ref="totalInteractionsPlot" class="plot-container"></div>

    <!-- Customer List Popup Component -->
    <CustomerListPopup />

  </div>
</template>


<script>
import Plotly from 'plotly.js-dist';
import CustomerListPopup from '../components/customerListPopup.vue';
import FlatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
 

export default {
  components: {
    CustomerListPopup,
    flatPickr: FlatPickr,
  },
  data() {
    return {
      queryData: {
        domain: this.$route.query.domain,
        startDate: '2023-09-18',
        endDate: '2023-12-22'
      },
      customerData: {
        Kundenname: '',
        Kundennummer: '',
        Domain: []
      },
      showDropdown: false,
      statsData: [],
      selectedDates: [], 
      datePickerConfig: {
        mode: 'range',
        dateFormat: 'Y-m-d', 
        defaultDate: ['2023-09-18', '2023-12-22'],
        altInput: true, // Erlaubt Flatpickr, einen alternativen Eingabebereich anzuzeigen
        altFormat: 'Y-m-d', // Format für den alternativen Eingabebereich
        altInputClass: 'flatpickr-custom', // Klasse für den alternativen Eingabebereich 
      },
      showCustomerListPopup: false
    };
  },
  computed: {
    availableDomains() {
      return this.customerData.Domain.filter(domain => domain !== this.queryData.domain);
    }
  },
  mounted() {
      this.setDefaultDateRange();
      const domain = this.$route.query.domain;
      if (domain) {
        this.fetchStatsData(domain);
      }
  },
  methods: {
    setDefaultDateRange() {
      this.selectedDates = [this.queryData.startDate, this.queryData.endDate];
    },
    fetchDataByDateRange() {
      const datesArray = this.selectedDates.split('to').map(date => date.trim());
      if (datesArray.length === 2) {
        this.queryData.startDate = datesArray[0];
        this.queryData.endDate = datesArray[1];
        this.fetchStatsData();
      } else {
        alert('Bitte wählen Sie den Zeitraum aus.');
      }
    },
    async fetchStatsData() {
      try {
        const { domain, startDate, endDate } = this.queryData;
        const response = await fetch(`http://localhost:3500/api/stats?domain=${domain}&start=${startDate}&end=${endDate}`);
        const responseData = await response.json();

        if (responseData.length > 0) {
          this.customerData.customerNumber = responseData[0].kundenNr;
        }

        const plotData = responseData.statsData.map(day => ({
          datum: day.datum.split('T')[0],
          approvalRate: (day.acceptAllChoiceCounts / day.essentialCounts) * 100,
          optIn: day.acceptAllChoiceCounts,
          optOut: day.declineChoiceCounts,
          total: day.essentialCounts,
          ccmPopupCounts: day.ccmPopupCounts,
          openReconsentMenuCounts: day.openReconsentMenuCounts,
          reconsentCounts: day.reconsentCounts
        }));

        this.customerData.Kundenname = responseData.customer.Kundenname;
        this.customerData.Kundennummer = responseData.customer.Kundennummer;
        this.customerData.Domain = responseData.customer.Domain || [];
        this.statsData = plotData;
        this.createOptinRatePlot(plotData);
        this.createInteractionPieCharts(plotData);
        this.createBounceRatePieChart(plotData);
        this.createReconsentPieChart(plotData);
        this.createTotalInteractionsPlot(plotData);
      } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
      }
    },
    fetchLast30DaysData() {
      const today = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);

      const formattedStartDate = thirtyDaysAgo.toISOString().split('T')[0];
      const formattedEndDate = today.toISOString().split('T')[0];

      this.queryData.startDate = formattedStartDate;
      this.queryData.endDate = formattedEndDate;

      this.selectedDates = [formattedStartDate, formattedEndDate];
      this.fetchStatsData(); // Lade Daten für die letzten 30 Tage
    },
    openCustomerListPopup() {
      this.$data.showCustomerListPopup = true;  
    },
    createOptinRatePlot(data) {
      const dates = data.map(day => day.datum);
      const approvalRates = data.map(day => day.approvalRate);

      const plotData = [{
        x: dates,
        y: approvalRates,
        type: 'scatter',
        mode: 'lines+markers',
        name: '',
        hovertemplate: '<b>%{x}</b><br>' +
                      'Zustimmungsrate: %{customdata[3]}%<br>' +
                      'OptIn: %{customdata[0]}<br>' +
                      'OptOut: %{customdata[1]}<br>' +
                      'Total: %{customdata[2]}',
        customdata: data.map(day => [day.optIn, day.optOut, day.total, Math.round(day.approvalRate)]),
        line: { color: '#662D8D' }, 
      }];

      const layout = {
        title: 'Zustimmungsrate über den Zeitraum',
        xaxis: {
          title: 'Datum',
        },
        yaxis: {
          title: 'Zustimmungsrate (%)',
        },
        plot_bgcolor: 'white', 
        paper_bgcolor: 'white', 
        font: {
          color: 'black', 
        },
      };

      const config = { responsive: true }; 
      Plotly.newPlot(this.$refs.plot, plotData, layout, config); 
    },
    createInteractionPieCharts(statsData) {
      const sumOptIn = statsData.reduce((acc, day) => acc + day.optIn, 0);
      const sumOptOut = statsData.reduce((acc, day) => acc + day.optOut, 0);
      const sumCustom = Math.max((sumOptIn + sumOptOut) * 0.9 - sumOptIn - sumOptOut, 0); // z.B. 90% der Summe von OptIn und OptOut


      const pieChart1Data = [{
        values: [sumOptIn, sumOptOut, sumCustom],
        labels: ['OptIn', 'OptOut', 'Custom'],
        type: 'pie',
        marker: {
          colors: ['#662d8d', '#fca500', '#ababab']
        },
        name: '',
        hoverinfo: 'label+percent+value', 
        hovertemplate: `<b>OptIn:</b> ${sumOptIn}<br><b>OptOut:</b> ${sumOptOut}<br><b>Custom:</b> ${sumCustom}<br><b>Total:</b> ${sumOptIn + sumOptOut + sumCustom}`,
      }];


      const layout = {
        title: 'Entscheidungen',
        plot_bgcolor: 'white',
        paper_bgcolor: 'white',
        font: { color: 'black' }
      };

      const config = { responsive: true };

      Plotly.newPlot(this.$refs.pieChart1, pieChart1Data, layout, config);
    },

    createBounceRatePieChart(statsData) {
      const totalSum = statsData.reduce((acc, day) => acc + (day.total || 0), 0);
      const popupCountsSum = statsData.reduce((acc, day) => acc + (day.ccmPopupCounts || 0), 0);
      const totalSumWithPopupCounts = totalSum + popupCountsSum;
      const totalPercentage = ((totalSum / totalSumWithPopupCounts) * 100).toFixed(2);
      const popupCountsPercentage = ((popupCountsSum / totalSumWithPopupCounts) * 100).toFixed(2);
      const pieChart2Data = [{
        values: [totalPercentage, popupCountsPercentage],
        labels: ['Interaktionen', 'Ignoranz'],
        type: 'pie',
        marker: {
          colors: ['#fca500', '#662d8d']
        },
        name: '',
        hoverinfo: 'label+percent',
        hovertemplate: '<b>Interaktionen:</b> ' + totalSum + '<br><b>Absprünge:</b> ' + popupCountsSum 
      }];

      const layout = {
        title: 'Ignoranz',
        plot_bgcolor: 'white',
        paper_bgcolor: 'white',
        font: { color: 'black' }
      };

      const config = { responsive: true };

      Plotly.newPlot(this.$refs.pieChart2, pieChart2Data, layout, config);
    },
    
    createReconsentPieChart(statsData) {
      const reconsentSum = statsData.reduce((acc, day) => acc + (day.reconsentCounts || 0), 0);
      const openReconsentSum = statsData.reduce((acc, day) => acc + (day.openReconsentMenuCounts || 0), 0);

      const pieChart3Data = [{
        values: [openReconsentSum, reconsentSum],
        labels: ['Interaktion Menü', 'Neuauswahl'],
        type: 'pie',
        marker: {
          colors: ['#662d8d', '#fca500']
        },
        textposition: 'inside',
        hoverinfo: 'label+value',
        hovertemplate: 'Neuauswahl: ' + reconsentSum + '<br>Interaktionen Menü: ' + openReconsentSum + '<extra></extra>'
      }];

      const layout = {
        title: 'Neuauswahl vs. Reconsent Menü öffnen',
        plot_bgcolor: 'white',
        paper_bgcolor: 'white',
        font: { color: 'black' }
      };

      const config = { responsive: true };

      Plotly.newPlot(this.$refs.pieChart3, pieChart3Data, layout, config);
    },


    createTotalInteractionsPlot(statsData) {
      console.log(statsData);
      const dates = statsData.map(day => day.datum);
      const optIn = statsData.map(day => day.optIn);
      const optOut = statsData.map(day => day.optOut);
      const total = statsData.map(day => day.total);

      const plotData = [];

      for (let i = 0; i < dates.length; i++) {
        const dayData = [
          { x: [dates[i]], y: [optIn[i]], type: 'bar', name:'', marker: { color: '#662d8d' }, hovertemplate: '<b>Zustimmungen, %{x}</b><br>OptIn: %{y}<br>Total: ' + total[i] },
          { x: [dates[i]], y: [optOut[i]], type: 'bar', name: '', marker: { color: '#fca500' }, hovertemplate: '<b>Ablehnungen, %{x}</b><br>OptOut: %{y}<br>Total: ' + total[i] }
        ];
        plotData.push(dayData);
      } 

      const flattenedData = plotData.flat();

      const layout = {
        title: 'Interaktionen über den Zeitraum',
        xaxis: {
          title: 'Datum',
        },
        yaxis: {
          title: 'Interaktionen',
        },
        barmode: 'stack',
        plot_bgcolor: 'white',
        paper_bgcolor: 'white',
        font: {
          color: 'black',
        },
        showlegend: false,
      };

      const config = { responsive: true };
      Plotly.newPlot(this.$refs.totalInteractionsPlot, flattenedData, layout, config);


      const chartContainer = this.$refs.totalInteractionsPlot;
      chartContainer.parentNode.insertBefore( chartContainer.nextSibling);
    },
    

    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    getExternalDomainURL() {
    return `http://${this.queryData.domain}`;
    },
    selectDomain(domain) {
      this.selectedDomain = domain;
      this.queryData.domain = domain; // Aktualisiere die queryData mit der ausgewählten Domain
      const { domain: selectedDomain, startDate, endDate } = this.queryData;

      this.$router.push({ 
        path: this.$route.path,
        query: { domain: selectedDomain, start: startDate, end: endDate }
      });

      this.fetchStatsData(); // Lade Statistiken für die ausgewählte Domain
      this.showDropdown = false;
    }
  }
};
</script>


<style>
.dashboard-container {
  background: #f8f8f8;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-family: 'Ubuntu', sans-serif;
  width: 100%; /* Setzt die Breite auf 100% des Bildschirms */
  box-sizing: border-box; /* Stellt sicher, dass Padding und Border in der Breite enthalten sind */
}
.date-input-container {
  margin-top: 20px;
  margin-bottom: 20px;
}

.date-input-container label {
  margin-right: 10px;
}

.timerange {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box; 
  transition: border-color 0.3s ease-in-out;
  margin-right: 10px;
}

.js-plotly-plot{
  margin-bottom: 20px;
}

.pie-charts-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.pie-chart {
  width: 30%; 
  margin: 0 auto;
}

.flatpickr-custom {
  height: 20px; 
  width: 190px;
  margin-right: 15px;
}

.flatpickr-day.selected {
  background-color: #662d8d; /* Hintergrundfarbe der ausgewählten Tage */
  color: white; /* Textfarbe der ausgewählten Tage */
}

/* Hintergrundfarbe der Tage während Hover (für die Zeitrange) im Flatpickr */
.flatpickr-day:not(.prevMonthDay):not(.nextMonthDay):hover {
  background-color: #4a1f5d; /* Dunklere Hintergrundfarbe bei Hover */
  color: white; /* Textfarbe bei Hover */
}


</style>

