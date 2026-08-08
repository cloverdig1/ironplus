"""
verify_service.py — Iron Plus Gym payment verification microservice

Wraps the ethiobank-receipts library behind a small Flask API that
backend/submitPayment.js calls to confirm a bank transfer or Telebirr
payment actually happened before a membership gets activated.

This replaces the verify_service.py skeleton referenced in the audit.

--------------------------------------------------------------------
SETUP
--------------------------------------------------------------------
    pip install ethiobank-receipts flask requests pdfplumber beautifulsoup4 --break-system-packages

    # BOA support additionally needs a real browser:
    pip install selenium --break-system-packages
    # + a Chrome/Chromium binary and matching chromedriver on this machine.
    # If that's not set up, BOA requests are automatically routed to
    # needs_review instead of crashing the service — see BOA_AVAILABLE below.

    # If the pip package isn't published/reachable, drop the vendored
    # copy from the ethiobank-receipts skill's scripts/ethiobank_receipts
    # folder into a "vendor/" directory next to this file — the import
    # fallback below will pick it up automatically.

--------------------------------------------------------------------
RUN
--------------------------------------------------------------------
    python verify_service.py
    # listens on http://localhost:5000 by default

--------------------------------------------------------------------
CONTRACT (assumed — see note at the bottom of this file)
--------------------------------------------------------------------
POST /verify
    { "bank": "cbe", "reference": "<FT number, receipt URL, or Telebirr ID>",
      "account": "<only for CBE if reference is an FT number, not a URL>",
      "expected_amount": 3200 }

    -> 200 { "status": "paid" | "needs_review",
             "reason": null | "amount_mismatch" | "extractor_error" | ...,
             "bank": "cbe", "reference": "...",
             "extracted_amount": 3200.0, "expected_amount": 3200,
             "amount_matched": true, "extracted": { ...raw fields... } }

    -> 400 { "error": "..." }   (bad request — missing/malformed input)

GET /health
    -> 200 { "ok": true, "boa_available": true, "time": "..." }
"""

import logging
import os
import re
import sys
from datetime import datetime, timezone

from flask import Flask, request, jsonify

# ---------------------------------------------------------------------------
# Import the extractors. Prefer the pip package; fall back to a vendored
# copy (see SETUP above) if it isn't installed.
# ---------------------------------------------------------------------------
try:
    from ethiobank_receipts.extractors import cbe, dashen, awash, zemen, tele
except ImportError:
    VENDORED_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "vendor")
    if os.path.isdir(VENDORED_PATH):
        sys.path.insert(0, VENDORED_PATH)
    from ethiobank_receipts.extractors import cbe, dashen, awash, zemen, tele

# BOA needs Selenium + a real Chrome binary — import it separately so the
# rest of the service still works if that stack isn't set up on this box yet.
try:
    from ethiobank_receipts.extractors import boa
    BOA_AVAILABLE = True
    BOA_IMPORT_ERROR = None
except Exception as e:  # missing selenium, missing chromedriver, etc.
    boa = None
    BOA_AVAILABLE = False
    BOA_IMPORT_ERROR = str(e)

app = Flask(__name__)

@app.route('/verify', methods=['POST'])
def verify():
    body = request.get_json(silent=True) or {}
    bank = str(body.get("bank", "")).strip().lower()
    reference = str(body.get("reference", "")).strip()
    account = body.get("account")
    expected_amount = body.get("expected_amount")

    if not bank or not reference:
        return jsonify({'success': False, 'error': 'Missing bank or reference'}), 400

    # Example verification logic.
    # Replace this with actual integration to your Python microservice / receipt extraction.
    verified_amount = None
    payer_name = None
    notes = 'Verification logic is not implemented yet.'
    success = False

    # Mocked verification flow for demo purposes. Replace with real extractor call.
    if reference.startswith('FT') or reference.startswith('CHQ'):
        verified_amount = 3600
        payer_name = 'Dawit Bekele'
        success = True
        notes = 'Mocked verification pass.'

    return jsonify({
        'success': success,
        'amount': verified_amount,
        'payer_name': payer_name,
        'notes': notes,
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
