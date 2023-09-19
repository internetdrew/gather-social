import QRCode from "qrcode";

export const generateQRCode = async (eventId: string): Promise<string> => {
  try {
    const qrCode = await QRCode.toDataURL(
      `https://gather-social.com/event/feed/${eventId}`
    );
    return qrCode;
  } catch (error) {
    console.error(`Trouble generating QR code: `, error);
    throw error;
  }
};
