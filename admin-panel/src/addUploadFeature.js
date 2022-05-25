import jsonServerProvider from "ra-data-json-server";
import dataProvider from "./dataProvider";
const addUploadFeature = {
  ...dataProvider,
  update: (resource, params) => {
    if (resource !== "players") {
      // fallback to the default implementation
      return dataProvider.update(resource, params);
    }

    console.log(params.data.pictures);
    /**
     * For posts update only, convert uploaded image in base 64 and attach it to
     * the `picture` sent property, with `src` and `title` attributes.
     */

    // Freshly dropped pictures are File objects and must be converted to base64 strings
    const newPictures = params.data.pictures.filter(
      (p) => p.rawFile instanceof File
    );
    const formerPictures = params.data.pictures.filter(
      (p) => !(p.rawFile instanceof File)
    );
    return Promise.all(newPictures.map(convertFileToBase64))
      .then((base64Pictures) =>
        base64Pictures.map((picture64) => ({
          src: picture64,
          title: `${params.data.title}`,
        }))
      )
      .then((transformedNewPictures) =>
        dataProvider.update(resource, {
          data: {
            ...params.data,
            pictures: [...transformedNewPictures, ...formerPictures],
          },
        })
      );
  },
};

/**
 * Convert a `File` object returned by the upload input into a base 64 string.
 * That's not the most optimized way to store images in production, but it's
 * enough to illustrate the idea of data provider decoration.
 */
const convertFileToBase64 = (file) => {
  console.log(file.rawFile);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;

    reader.readAsDataURL(file.rawFile);
  });
};

export default addUploadFeature;
