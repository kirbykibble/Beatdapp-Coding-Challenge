# Beatdapp-Coding-Challenge
Completed by: Dylan Chew

## Installation
You will need [Node.js](https://nodejs.org/en/) to run this on your local machine. Alternatively, you can visit the app on a heroku server [here](https://beatdapp-coding-challenge.herokuapp.com/).

If you wish to run this locally, you will need to download and install the node modules relevant for this project. You can achieve this by entering `npm install` in the main project directory. After this completes, run the project by using `npm start`. You should be able to access the page on `localhost:10000`

## Technology Stack
- NodeJs
  - Body-parser
  - Express
  - Firebase
  - jQuery
  - Webpack
- Firestore
- Bootstrap

## Other Information
Data persistence was implemented through the use of Google's [Firestore](https://firebase.google.com/products/firestore) service. Due to this method of implementation, data persists through any session, regardless of user. Additionally, the app should be safe against SQL injection or HTML injection attempts. 

Also, I should mention that while I was not required to deploy this to a server, I ultimately decided to build this app with a server in mind. An app that makes use of a database is much more susceptible to malicious attacks if the client were to directly interact with the database. Hence, the use of a NodeJs server. 

Finally, the design and theming for this site was intentionally styled to be similar to [Beatdapp's](https://www.beatdapp.com/) website
