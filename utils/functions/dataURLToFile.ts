function dataURLToFile(dataURL: string, imageName: string) {
  if (dataURL) {
    const imageType = dataURL.split(",")[0];
    const imageBase64data = dataURL.split(",")[1];

    const baseCharacters = atob(imageBase64data);
    const byteArray = new Uint8Array(imageBase64data.length);

    for (let i = 0; i < baseCharacters.length; i++){
      byteArray[i] = baseCharacters.charCodeAt(i);
    }

    const blob = new Blob([byteArray], { type: `${imageType.split(";")[0].split(":")[1]}` });
    
    return new File([blob],`${imageName}.${imageType.split(";")[0].split("/")[1]}`, { type: `${imageType.split(";")[0].split(":")[1]}` })
  }
}

export default dataURLToFile;