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
  useListContext,
  useRedirect,
} from "react-admin";
import { CustomImageField } from "./CustomImageField";
import { Box, Paper } from "@mui/material";
const styles = {
  gameContainer: {
    backgroundImage: `url(http://localhost:5000/logo192.png)`,
  },
};
export const Games = () => {
  const { data } = useListContext();
  console.log(data);
  const redirect = useRedirect();

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        "& > :not(style)": {
          m: 1,
          width: 128,
          height: 128,
        },
      }}
    >
      {data.map((game) => (
        <Paper
          sx={{
            padding: 1,
            "&:hover": {
              boxShadow: 8,
            },
            backgroundImage: `url(http://localhost:5000/${game.gameImage})`,
          }}
          onClick={() => redirect(`http://localhost:3000/#/games/${game.id}`)}
        >
          {game.id}
          {game.name}
        </Paper>
      ))}
    </Box>
  );
};

export const GameList = () => (
  <List emptyWhileLoading>
    <Games />
  </List>
);

export const GameEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" />

      <TextInput source="name" />

      <ImageInput source="pictures" multiple={true} accept="image/png">
        <ImageField source="src" title="profile image" />
      </ImageInput>
    </SimpleForm>
  </Edit>
);
export const GameCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="id" />

      <TextInput source="name" />

      <ImageInput source="pictures" multiple={true} accept="image/png">
        <ImageField source="src" title="Game Image" />
      </ImageInput>
    </SimpleForm>
  </Create>
);
export const GameShow = () => (
  <Show>
    <SimpleShowLayout>
      <CustomImageField source="gameImage" />
      <TextField source="name" />
    </SimpleShowLayout>
  </Show>
);
