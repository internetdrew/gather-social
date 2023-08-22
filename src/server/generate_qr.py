import sys
import qrcode
from base64 import b64encode
from io import BytesIO

event_id = sys.argv[1]

# Construct the URL using the event ID
event_url = f'https://gathersocial.com/event/{event_id}'

qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=10,
    border=4,
)
qr.add_data(event_url)
qr.make(fit=True)

qr_image = qr.make_image(fill_color="black", back_color="white")

memory = BytesIO()
qr_image.save(memory)
memory.seek(0)

# Convert the QR code image to base64 and print it
qr_image_base64 = b64encode(memory.getvalue()).decode('utf-8')
print(qr_image_base64)