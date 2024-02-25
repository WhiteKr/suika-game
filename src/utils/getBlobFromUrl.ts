const getBlobFromUrl = (bUrl: string): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.responseType = "blob";
    xhr.addEventListener("load", (_: ProgressEvent) => {
      if (xhr.status === 200) {
        resolve(xhr.response);
      } else {
        reject(new Error("Cannot retrieve blob"));
      }
    });

    xhr.open("GET", bUrl, true);
    xhr.send();
  });
};

export default getBlobFromUrl;
