# Consent Management Platform Management System

## Table of Contents
- [System Architecture](#system-architecture)
  - [Component Diagram](#component-diagram)
- [Backend](#backend)
- [Frontend](#frontend)
- [Database](#database)

## System Architecture
### Component Diagram

![komponentendiagramm_pages-to-jpg-0001](https://github.com/alexhobel/cmp_management_system/assets/64959874/8d7c04a0-b8a7-49d1-a0d8-00ac6aec71cb)

## Backend

The backend of the system serves as the backbone, providing an API for the frontend to facilitate data exchange between the UI and the database, and to implement the core logic of the application. System function descriptions define which domain data is involved in each workspace on the frontend, specifying the screens that implement the respective workspaces. Domain data such as CMP statistics and customer data from the domain data model are crucial for backend development as they are involved in the implemented workspaces.

Design decisions in this work adhere to Domain-Driven Design principles, shaping the architecture of the API to be understandable, maintainable, extensible, and comprehensive. This closely relates to database development, as the API primarily manages domain data from the database and aggregates it into formats required by the frontend.

The API is implemented as a RESTful API, adhering to the REST architectural style, with frontend requests considering the necessary HTTP methods, and data representation for exchange occurring in JavaScript Object Notation (JSON) format.

Interaction with the database utilizes Mongoose, an object-oriented interface for Node.js applications, implementing all required operations on the database and integrating as a JavaScript library into the Node.js application.

The backend implementation is done using Node.js with Express.js, a JavaScript framework for Node.js, providing operations for efficiency in development projects. The API is divided into two main parts, one focusing on customer data and the other on CMP statistics.

System functions such as displaying customers, creating new customers, adjusting customer data, scanning cookies on the customer side, and providing consent IDs per customer are all handled by the customer data part. The system function "Effectively visualize statistics" lies within the CMP statistics part.

The API offers two endpoints for CMP statistics, with one assigning a respective domain to a queried time period via a query parameter in the URI, and the backend sends the respective objects of the stats collection to the client, where each object represents a day of the period.

In the area of overall statistics, a time period is also queried via a query parameter, and a day represents an object, except that all data for the respective day is aggregated.

The part of the API responsible for customer data management provides endpoints for deleting, adding, and querying customer data, as well as managing customerConfiguration documents for each domain.

New customers are stored by querying the endpoint from the client side. The backend logic then creates a customerConfiguration document per approved domain with default values, which can then be edited immediately after the creation of customer master data.

When querying customer data and their configuration documents, the respective endpoint accepts a query parameter containing the domain for which the customerConfiguration document is requested from the client side.

## Frontend

Vue.js facilitates the development of the frontend by extending Hypertext Markup Language (HTML), Cascading Style Sheets (CSS), and JS standards. It builds upon these standards, offering a declarative and component-based approach to UI development, making development particularly efficient. As a progressive framework, Vue.js allows for layered integration and focuses on the view layer, easing adaptation to existing projects and seamless integration of third-party libraries. This flexibility reduces entry barriers and provides a plethora of benefits in designing interactive user interfaces.

The system follows the typical Vue.js project layout, which is divided into views and components. A view implements a screen of the low-fidelity prototype, while components are standalone units that can be integrated into various views. This structure promotes modularity and code reusability.

Vue.js also enables reactivity, automatically tracking JavaScript state changes and efficiently updating the DOM when changes occur, resulting in a performant UI. The router is responsible for application navigation, defining routes associated with different views, facilitating transitions between views based on user interactions.

Plotly.js 6 is a JavaScript library used for creating interactive data visualizations, employed in dashboard screens to effectively visualize data.

Files of views and components adhere to the Single File Component format typical for Vue.js. Each file consists of a <template> section containing the HTML structure, a <script> section containing JavaScript logic, and a <style> section defining the appearance and behavior of UI elements.

Before deployment, the Vue.js application is compiled to optimize the code and ensure it is production-ready. The compilation process includes various operations on the code aimed at improving loading times and execution efficiency. After compilation, the application is accessible via a directory that can be hosted on a web server and rendered by a web browser.

During the prototype development, this may not be relevant, but looking ahead, it is essential knowledge. Vue.js provides a test server accessible via localhost during the development process, facilitating productive development, and the compiled result can be directly accessed via the test server.


## Database

<img width="806" alt="DB" src="https://github.com/alexhobel/cmp_management_system/assets/64959874/31b2c867-07f6-445e-9775-83cbed5dd7cb">


