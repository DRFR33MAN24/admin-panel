// in src/App.js
import * as React from "react";
import {
  Admin,
  Resource,
  ListGuesser,
  EditGuesser,
  ShowGuesser,
} from "react-admin";
import authProvider from "./authProvider";
import dataProvider from "./dataProvider";
import LoginPage from "./LoginPage";
//import jsonServerProvider from "ra-data-json-server";

//const dataProvider = jsonServerProvider("https://jsonplaceholder.typicode.com");

const App = () => (
  <Admin
    loginPage={LoginPage}
    dataProvider={dataProvider}
    authProvider={authProvider}
  >
    <Resource name="users" list={ListGuesser} />
  </Admin>
);

export default App;
