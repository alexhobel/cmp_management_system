<template>
  <div class="navbar" :class="{ sticky: isSticky }">
    <div class="navbar-content">
      <!-- Logo als router-link -->
      <router-link :to="{ name: 'Home' }" class="logo-link">
        <img class="logo-keyword-experte" alt="Logo keyword experte" src="/logo-keyword-experte.png" />
      </router-link>
      <div class="nav-links">
        <router-link :to="{ name: 'Home' }" class="nav-item" active-class="active">Customer Overview</router-link>
        <router-link :to="{ name: 'CMPDashboard' }" class="nav-item" active-class="active">CMP Dashboard</router-link>
        <router-link :to="{ name: 'CustomerDashboard', query: { domain: $route.query.domain  } }" class="nav-item" active-class="active">Customer Dashboard</router-link>
        <router-link :to="{ name: 'Configuration', query: { domain: $route.query.domain } }" class="nav-item" active-class="active">Configuration</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'headerComponent'
}
</script>

<style>
/* Grundlegender Stil für den Header */
.navbar {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  box-shadow: 0px 6px 4px rgba(0, 0, 0, 0.06);
  height: 90px;
  position: fixed; 
  top: 0; 
  z-index: 1000;
  width: 100%;
}


.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: calc(100% - 20px); /* Berücksichtigt den linken und rechten Abstand von jeweils 10px */
  max-width: 1400px; /* Maximale Breite, die der Container einnehmen kann */
  margin: 0 auto;
  padding: 0 10px; /* Linker und rechter Abstand von 10px */
  box-sizing: border-box; /* Berücksichtigt das padding in der Gesamtbreite */
  gap: 20px; /* Fügt einen Abstand zwischen dem Logo und den Menüpunkten hinzu */
}

.logo-keyword-experte {
  height: 55px;
  width: 165px;
}

.nav-links {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 20px; /* Fügt einen Abstand zwischen den Navigationslinks hinzu */
}

.logo-link {
  margin-right: 20px; /* Fügt einen Abstand zwischen dem Logo und den Navigationslinks hinzu */
}

.nav-item {
  color: black;
  font-size: 15.5px;
  font-family: Ubuntu, sans-serif;
  font-weight: 500;
  letter-spacing: 0.15px;
  text-decoration: none;
  margin-right: 55px;
}

.nav-item:last-child {
  margin-right: 0;
}

.nav-item.active {
  color: #662D8D;
}

/* Media Queries */

/* Tablet-Geräte (Bildschirme kleiner als 768px) */
@media (max-width: 768px) {
  .logo-link {
    display: none; /* Blendet das Logo aus */
  }

  .navbar-content {
    flex-direction: row; /* Behält die horizontale Ausrichtung bei */
    justify-content: space-between; /* Verteilt den Raum zwischen den Elementen */
  }

  .nav-links {
    flex-direction: row; /* Behält die horizontale Ausrichtung der Links bei */
    align-items: center;
    gap: 20px; /* Beibehalten des Abstands zwischen den Links */
  }

  .nav-item {
    margin-right: 20px; /* Beibehalten des rechten Abstands für die Links */
  }

  .nav-item:last-child {
    margin-right: 0;
  }
}

/* Mobilgeräte (Bildschirme kleiner als 480px) */
@media (max-width: 480px) {
  .navbar {
    height: auto;
    padding: 10px 0;
  }

  .logo-keyword-experte {
    margin-bottom: 10px;
  }
}
</style>
