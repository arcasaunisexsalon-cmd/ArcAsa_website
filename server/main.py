"""ArcAsa appointment API.

Receives an appointment request from the website and appends one row to a Google Sheet.

Run from the server/ folder:
    uvicorn main:app --reload --port 8000
"""

import json
import logging
import os
import re
from datetime import datetime, timedelta, timezone
from functools import lru_cache
from pathlib import Path
from typing import Optional

import gspread
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from google.oauth2.service_account import Credentials
from pydantic import BaseModel, ConfigDict, EmailStr, Field, model_validator

load_dotenv()

logger = logging.getLogger("arcasa")

# ---------------- Settings (all come from server/.env) ---------------- #
BASE_DIR = Path(__file__).resolve().parent

SPREADSHEET_ID = os.getenv("SPREADSHEET_ID", "")
SHEET_TAB = os.getenv("SHEET_TAB", "")  # tab name; empty means the first tab

# Locally the key is a file. On a host, paste the file's content into this variable instead.
SERVICE_ACCOUNT_FILE = Path(os.getenv("SERVICE_ACCOUNT_FILE", BASE_DIR / "service_account.json"))
SERVICE_ACCOUNT_JSON = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON", "")

# Websites allowed to call this API, separated by commas
ALLOWED_ORIGINS = [
    o.strip()
    for o in os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
    if o.strip()
]

# Only the Sheets permission is needed (the Drive permission is not)
SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]

IST = timezone(timedelta(hours=5, minutes=30))

HEADERS = [
    "Timestamp",
    "Name",
    "Phone",
    "Email",
    "WhatsApp",
    "Instagram collab",
    "Instagram",
    "Services",
    "Estimated total (Rs)",
    "Status",
]

PHONE_PATTERN = r"^[6-9]\d{9}$"
HANDLE_PATTERN = r"^@?[A-Za-z0-9._]{1,30}$"

# ---------------- App ---------------- #
app = FastAPI(title="ArcAsa Appointment API")

# Ensure all your production and preview domains are listed
default_origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://www.arcasaunisexsalon.in",
    "https://arcasaunisexsalon.in",
]

env_origins = [
    o.strip()
    for o in os.getenv("ALLOWED_ORIGINS", "").split(",")
    if o.strip()
]

# Combine both so production custom domains work even if env var is missing
ALLOWED_ORIGINS = list(set(default_origins + env_origins))

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,  # no cookies are used
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------- Request schema (matches the Appointment page) ---------------- #
class ServiceItem(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    name: str = Field(min_length=1, max_length=120)
    scope: str = Field(default="", max_length=60)  # for example "Ladies-Hair"
    group: str = Field(default="", max_length=120)  # for example "Advance Hair Cut"
    priceLabel: str = Field(default="", max_length=40)  # text shown to the visitor
    price: Optional[int] = Field(default=None, ge=0, le=1_000_000)  # None = priced at billing


class AppointmentRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    name: str = Field(min_length=2, max_length=80)
    phone: str = Field(pattern=PHONE_PATTERN)
    email: EmailStr
    whatsapp: str = Field(pattern=PHONE_PATTERN)
    collab: bool = False
    instagram: str = Field(default="", max_length=31)
    services: list[ServiceItem] = Field(min_length=1, max_length=30)

    @model_validator(mode="after")
    def instagram_needed_for_collab(self):
        if self.collab and not re.fullmatch(HANDLE_PATTERN, self.instagram):
            raise ValueError("A valid Instagram username is needed for a collab")
        return self


# ---------------- Google Sheets ---------------- #
@lru_cache(maxsize=1)
def get_worksheet():
    """Connect once, then reuse the same sheet for every request."""
    if not SPREADSHEET_ID:
        raise RuntimeError("SPREADSHEET_ID is not set")

    if SERVICE_ACCOUNT_JSON:
        credentials = Credentials.from_service_account_info(
            json.loads(SERVICE_ACCOUNT_JSON), scopes=SCOPES
        )
    else:
        credentials = Credentials.from_service_account_file(
            str(SERVICE_ACCOUNT_FILE), scopes=SCOPES
        )

    book = gspread.authorize(credentials).open_by_key(SPREADSHEET_ID)
    sheet = book.worksheet(SHEET_TAB) if SHEET_TAB else book.sheet1

    if not sheet.row_values(1):  # empty sheet: write the column titles first
        sheet.append_row(HEADERS, value_input_option="RAW")
    return sheet


def build_row(data: AppointmentRequest) -> list:
    services_text = "\n".join(
        f"{i}. {s.name} ({' / '.join(p for p in (s.scope.replace('-', ' ').strip(), s.group) if p)})"
        f" - {s.priceLabel or 'at billing'}"
        for i, s in enumerate(data.services, start=1)
    )
    total = sum(s.price or 0 for s in data.services)  # worked out here, not trusted from the browser

    return [
        datetime.now(IST).strftime("%Y-%m-%d %H:%M:%S"),
        data.name,
        data.phone,
        data.email,
        data.whatsapp,
        "Yes" if data.collab else "No",
        "@" + data.instagram.lstrip("@") if data.collab else "",
        services_text,
        total,
        "New",
    ]


# ---------------- Endpoints ---------------- #
@app.post("/api/appointments", status_code=status.HTTP_201_CREATED)
def create_appointment(data: AppointmentRequest):
    try:
        # RAW stores text exactly as sent. With USER_ENTERED, a name such as
        # =IMPORTDATA(...) would run as a spreadsheet formula.
        get_worksheet().append_row(build_row(data), value_input_option="RAW")
    except Exception:
        # Details go to the server log only, never to the visitor
        logger.exception("Could not save the appointment")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="We could not save your request right now. Please try again or contact us on WhatsApp.",
        )
    return {"status": "success"}


@app.get("/api/health")
@app.get("/health")
def health_check():
    return {"status": "ok"}