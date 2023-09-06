import { spawn } from "child_process";
import { join } from "path";
import QRCode from "qrcode";

interface Event {
  id: string;
  hostId: string;
}

export const generateQRCodePromise = (event: Event) => {
  return new Promise<string>((resolve, reject) => {
    const pythonScriptPath = join(
      process.cwd(),
      "/src/server/api/generate_qr.py"
    );

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

export const generateQRCode = async (eventId: string): Promise<string> => {
  try {
    const qrCode = await QRCode.toDataURL(
      `https://gathersocial.com/event/feed/${eventId}`
    );
    return qrCode;
  } catch (error) {
    console.error(`Trouble generating QR code: `, error);
    throw error;
  }
};
