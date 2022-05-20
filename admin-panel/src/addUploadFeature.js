// in addUploadFeature.js
/**
 * Convert a `File` object returned by the upload input into a base 64 string.
 * That's not the most optimized way to store images in production, but it's
 * enough to illustrate the idea of data provider decoration.
 */
export const convertFileToBase64 = (file) => {
  console.log("HI");
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file.rawFile);
    console.log(file.rawFile);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });
};

/**
 * For posts update only, convert uploaded image in base 64 and attach it to
 * the `picture` sent property, with `src` and `title` attributes.
 */
const addUploadFeature = (requestHandler) => (resource, params) => {
  console.log(resource, params);
  if (resource === "players") {
    // notice that following condition can be true only when `<ImageInput source="pictures" />` component has parameter `multiple={true}`
    // if parameter `multiple` is false, then data.pictures is not an array, but single object
    if (params.data.profileImg && params.data.profileImg.length) {
      // only freshly dropped pictures are instance of File

      const formerPictures = params.data.profileImg.filter(
        (p) => !(p.rawFile instanceof File)
      );
      const newPictures = params.data.profileImg.filter(
        (p) => p.rawFile instanceof File
      );
      console.log(newPictures, formerPictures);
      return Promise.all(newPictures.map(convertFileToBase64))
        .then((base64Pictures) => {
          console.log(base64Pictures);
          return base64Pictures.map((picture64, index) => ({
            src: picture64,
            title: `${newPictures[index].title}`,
          }));
        })
        .then((transformedNewPictures) =>
          requestHandler(resource, {
            ...params,
            data: {
              ...params.data,
              profileImg: [...transformedNewPictures, ...formerPictures],
            },
          })
        );
    }
  }
  // for other request types and resources, fall back to the default request handler
  //return requestHandler(type, resource, params);
};

export default addUploadFeature;
