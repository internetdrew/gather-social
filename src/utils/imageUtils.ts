export function convertBlobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();

      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to read blob as Base64."));
        }
      };

      reader.onerror = () => {
        reject(new Error("Failed to read blob as Base64."));
      };

      reader.readAsDataURL(blob);
    } catch (error) {
      console.error(error);
    }
  });
}

export function base64ToBinary(base64String: string) {
  const binaryString = atob(base64String);
  const bytes = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes;
}
