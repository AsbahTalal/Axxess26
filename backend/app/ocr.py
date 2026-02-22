# app/ocr.py
import easyocr
import numpy as np
import cv2
from PIL import Image

reader = easyocr.Reader(['en'], gpu=False)

def preprocess(pil_img: Image.Image):
    img = np.array(pil_img.convert("RGB"))
    img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.bilateralFilter(gray, 9, 75, 75)
    thr = cv2.adaptiveThreshold(
        gray, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        31, 5
    )
    return thr

def extract_text(pil_img: Image.Image) -> str:
    processed = preprocess(pil_img)
    results = reader.readtext(processed, detail=0, paragraph=True)
    return "\n".join(results)