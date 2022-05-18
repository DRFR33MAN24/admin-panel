import {
  List,
  Datagrid,
  NumberField,
  TextField,
  EmailField,
  DateField,
  ImageField
} from "react-admin";
export const UserList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <ImageField source="profileImg" />
      <NumberField source="active" />
      <TextField source="name" />
      <EmailField source="email" />

      <DateField source="register_date" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
    </Datagrid>
  </List>
);
