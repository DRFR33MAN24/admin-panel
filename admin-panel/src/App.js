// in src/App.js
import * as React from "react";
import { Admin, Resource, ListGuesser, EditGuesser } from "react-admin";
import jsonServerProvider from "ra-data-json-server";

const dataProvider = jsonServerProvider("https://jsonplaceholder.typicode.com");

const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource name="posts" list={ListGuesser} edit={EditGuesser} />
    <Resource name="users" list={ListGuesser} edit={EditGuesser} />
  </Admin>
);

export default App;
