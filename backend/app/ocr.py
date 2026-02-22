# backend/app/ocr.py
import easyocr
import numpy as np
import cv2
from PIL import Image

reader = easyocr.Reader(["en"], gpu=False)

def extract_text(pil_img: Image.Image) -> str:
    img = np.array(pil_img.convert("RGB"))
    img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)

    h, w = img.shape[:2]

    # Crop lower-middle region (where ingredients are)
    y1 = int(h * 0.35)
    y2 = int(h * 0.85)
    x1 = int(w * 0.05)
    x2 = int(w * 0.95)

    img = img[y1:y2, x1:x2]

    # Upscale (VERY important for small text)
    img = cv2.resize(img, None, fx=2.0, fy=2.0, interpolation=cv2.INTER_CUBIC)

    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Gentle contrast boost (better than threshold)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    gray = clahe.apply(gray)

    # Convert back to RGB for EasyOCR
    rgb = cv2.cvtColor(gray, cv2.COLOR_GRAY2RGB)

    results = reader.readtext(
        rgb,
        detail=0,
        paragraph=True,
        low_text=0.3,
        text_threshold=0.5,
        contrast_ths=0.05
    )

    return "\n".join(results)