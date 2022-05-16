// in src/App.js
import * as React from "react";
import {
  Admin,
  Resource,
  ListGuesser,
  EditGuesser,
  ShowGuesser,
} from "react-admin";
import { UserList } from "./UserList";
import { PlayerList } from "./PlayerList";
import authProvider from "./authProvider";
import dataProvider from "./dataProvider";
import LoginPage from "./LoginPage";
import { Dashboard } from "./Dashboard";
//import jsonServerProvider from "ra-data-json-server";

//const dataProvider = jsonServerProvider("https://jsonplaceholder.typicode.com");

const App = () => (
  <Admin
    dashboard={Dashboard}
    loginPage={LoginPage}
    dataProvider={dataProvider}
    authProvider={authProvider}
  >
    <Resource name="users" list={UserList} />
    <Resource name="players" list={PlayerList} edit={EditGuesser} />
  </Admin>
);

export default App;
