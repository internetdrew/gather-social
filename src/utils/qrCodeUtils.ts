import { spawn } from "child_process";
import { join } from "path";

interface Event {
  id: string;
  hostId: string;
}

export const generateQRCodePromise = (event: Event) => {
  return new Promise<string>((resolve, reject) => {
    const pythonScriptPath = join(process.cwd(), "/src/server/generate_qr.py");

    const pythonProcess = spawn("python3", [pythonScriptPath, event.id]);

    let qrCodeImageData = "";

    pythonProcess.stdout.on("data", (data: Buffer) => {
      qrCodeImageData += data.toString();
    });

    pythonProcess.on("error", (error) => {
      reject(error);
    });

    pythonProcess.on("close", (code) => {
      if (code === 0) {
        resolve(qrCodeImageData);
      } else {
        reject(new Error("QR code generation failed"));
      }
    });
  });
};
