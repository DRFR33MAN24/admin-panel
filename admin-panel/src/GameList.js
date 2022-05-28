import {
  List,
  Edit,
  Create,
  Datagrid,
  NumberField,
  TextField,
  EmailField,
  DateField,
  SimpleForm,
  TextInput,
  NumberInput,
  DateInput,
  Show,
  SimpleShowLayout,
  RichTextField,
  EditButton,
  ImageField,
  ImageInput,
} from "react-admin";
import { CustomImageField } from "./CustomImageField";
export const GameList = () => (
  <List>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <CustomImageField source="profileImg" />
      <NumberField source="active" />
      <TextField source="name" />
      <EmailField source="email" />

      <DateField source="register_date" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
      <EditButton />
    </Datagrid>
  </List>
);

export const GameEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" />
      <NumberInput source="active" />
      <TextInput source="name" />
      <TextInput source="email" />
      <ImageInput source="pictures" multiple={true} accept="image/png">
        <ImageField source="src" title="profile image" />
      </ImageInput>

      <TextInput source="new_password" />
      <TextInput source="repeat_password" />

      <DateInput source="register_date" />
      <DateInput source="createdAt" />
      <DateInput source="updatedAt" />
    </SimpleForm>
  </Edit>
);
export const GameCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="id" />
      <NumberInput source="active" />
      <TextInput source="name" />
      <TextInput source="email" />
      <ImageInput source="pictures" multiple={true} accept="image/png">
        <ImageField source="src" title="profile image" />
      </ImageInput>

      <TextInput source="password" />
      <TextInput source="repeat_password" />

      <DateInput source="register_date" />
      <DateInput source="createdAt" />
      <DateInput source="updatedAt" />
    </SimpleForm>
  </Create>
);
export const GameShow = () => (
  <Show>
    <SimpleShowLayout>
      <ImageField source="profileImg" />
      <TextField source="name" />
      <TextField source="email" />
    </SimpleShowLayout>
  </Show>
);
