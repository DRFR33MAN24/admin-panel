import {
  List,
  Edit,
  Datagrid,
  NumberField,
  TextField,
  EmailField,
  DateField,
  SimpleForm,
  TextInput,
  NumberInput,
  DateInput,
} from "react-admin";
export const PlayerList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <NumberField source="active" />
      <TextField source="name" />
      <EmailField source="email" />

      <DateField source="register_date" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
    </Datagrid>
  </List>
);

export const PlayerEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" />
      <NumberInput source="active" />
      <TextInput source="name" />
      <TextInput source="email" />
      <TextInput source="new_password" />
      <TextInput source="repeat_password" />

      <DateInput source="register_date" />
      <DateInput source="createdAt" />
      <DateInput source="updatedAt" />
    </SimpleForm>
  </Edit>
);
