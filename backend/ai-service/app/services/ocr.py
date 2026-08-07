import re
from pathlib import Path

from app.schemas import OcrResult

AMOUNT = re.compile(r"(?:rs\.?|inr|₹)\s?([0-9][0-9,]*(?:\.[0-9]{2})?)", re.IGNORECASE)
GSTIN = re.compile(r"\b[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]\b")
INVOICE_NO = re.compile(r"(?:invoice|bill)\s*(?:no\.?|number|#)\s*[:\-]?\s*([A-Z0-9\-\/]{3,25})", re.IGNORECASE)
DATE = re.compile(r"\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}-\d{2}-\d{2})\b")
PAN = re.compile(r"\b[A-Z]{5}[0-9]{4}[A-Z]\b")
PHONE = re.compile(r"\b(?:\+91[\s\-]?)?[6-9]\d{9}\b")

SAMPLE_TEXT = """
HUBFLOW AUTOMATION PRIVATE LIMITED
GSTIN: 27AABCH1234M1ZP
Invoice No: HF-202608-000482
Invoice Date: 05/08/2026
Bill To: Nexora Retail Pvt Ltd
Contact: +919812345678
Platform subscription (Growth, yearly)   Rs 79,990.00
Conversation charges                     Rs 4,212.50
CGST 9%                                  Rs 7,578.23
SGST 9%                                  Rs 7,578.23
Total Payable                            Rs 99,358.96
"""


def _extract(text: str) -> dict[str, str]:
    fields: dict[str, str] = {}

    if match := INVOICE_NO.search(text):
        fields["invoice_number"] = match.group(1).strip()

    if match := GSTIN.search(text):
        fields["gstin"] = match.group(0)

    if match := PAN.search(text):
        fields["pan"] = match.group(0)

    if match := DATE.search(text):
        fields["invoice_date"] = match.group(1)

    if match := PHONE.search(text):
        fields["contact_phone"] = match.group(0)

    amounts = AMOUNT.findall(text)
    if amounts:
        normalised = [value.replace(",", "") for value in amounts]
        fields["line_item_count"] = str(len(normalised))
        fields["total_amount"] = max(normalised, key=lambda value: float(value))

    return fields


def extract(file_id: str, document_type: str, upload_dir: Path | None = None) -> OcrResult:
    text = SAMPLE_TEXT
    source = "bundled_sample"

    if upload_dir is not None:
        candidate = upload_dir / file_id
        if candidate.is_file() and candidate.suffix.lower() in {".txt", ".csv"}:
            text = candidate.read_text(encoding="utf-8", errors="replace")
            source = "uploaded_file"

    fields = _extract(text)
    confidence = round(min(0.98, 0.55 + 0.09 * len(fields)), 2)

    return OcrResult(
        file_id=file_id,
        document_type=document_type,
        confidence=confidence,
        fields=fields | {"_source": source},
        raw_text_preview=" ".join(text.split())[:280],
    )
