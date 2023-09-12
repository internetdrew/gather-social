import imageCompression from "browser-image-compression";

export const compressImages = async (files: FileList) => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
  };

  try {
    return await Promise.all(
      Array.from(files).map(async (file) => {
        try {
          const compressedFile = await imageCompression(file, options);
          return compressedFile;
        } catch (error) {
          console.error("Image compression error:", error);
          throw error;
        }
      })
    );
  } catch (error) {
    console.error(error);
  }
};
