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
  useRecordContext,
  useShowContext,
} from "react-admin";
import { httpClient, apiUrl } from "./dataProvider";
import { CustomImageField } from "./CustomImageField";
import { Box, Paper } from "@mui/material";
import { useEffect, useState } from "react";
// const styles = {
//   gameContainer: {
//     backgroundImage: `url(http://localhost:5000/logo192.png)`,
//   },
// };
export const Games = () => {
  const { data } = useListContext();
  //console.log(data);
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
          onClick={() =>
            redirect(`http://localhost:3000/#/games/${game.id}/show`)
          }
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
export const GameShow = () => {
  // let show = useShowContext();
  // console.log(show);
  const [data, setData] = useState(undefined);

  useEffect(() => {
    (async function () {
      try {

        let json = await httpClient(`${apiUrl}/games/getGamePlayers/?gameId=${1}`);
        setData(json.json);
      } catch (error) {
        console.log(error);
      }

    })();
  }, []);


  const sort = { field: "id", order: "DESC" };
  return (
    <Show>
      <SimpleShowLayout>
        <CustomImageField source="gameImage" />
        <TextField source="name" />
        {data !== undefined ? (
          <Datagrid data={data} total={1} isLoading={false} sort={sort}>
            <TextField source="id" />
            <TextField source="name" />
          </Datagrid>
        ) : null}
      </SimpleShowLayout>
    </Show>
  );
};
