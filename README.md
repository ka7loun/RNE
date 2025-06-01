# RNE – Multilingual Company Name Validation & Reservation

## Overview
RNE is a professional web application for validating and reserving company names in Tunisia. It supports French, Arabic, and English, and provides real-time validation, transliteration, blacklist filtering, and AI-powered assistance. The platform is designed for entrepreneurs, legal professionals, and business owners to ensure their company names comply with Tunisian regulations and are available for registration.

---

## Features
- **Multilingual Support:** French, Arabic, and English input and validation
- **Real-Time Validation:** Checks for allowed characters, script, and blacklist terms
- **Transliteration:** Auto-fills other language fields using smart transliteration
- **Commercial Name Support:** Validate and transliterate commercial names
- **AI Chatbot:** Get instant help and name checks via an AI assistant
- **Name Reservation:** Direct link to the official RNE name reservation portal
- **Modern UI:** Responsive, accessible, and user-friendly interface

---

## Technology Stack
- **Frontend:** React, Vite, TypeScript, Tailwind CSS, Lucide Icons
- **Backend:** Flask (for local validation), FastAPI (for AI chat), CORS enabled
- **Other:** Python, Node.js, Git, GitHub

---

## Setup Instructions

### 1. Clone the Repository
```sh
git clone https://github.com/ka7loun/RNE.git
cd RNE
```

### 2. Install Frontend Dependencies
```sh
cd project
npm install
```

### 3. Start the Frontend
```sh
npm run dev
```

### 4. Install Backend Dependencies
```sh
cd backend
pip install -r requirements.txt
```

### 5. Start the Flask Backend
```sh
python app.py
```

### 6. (Optional) Start the AI Chatbot Backend
- Make sure FastAPI is running on the correct IP and port (see documentation in `backend` or ask the maintainer).

---

## Usage
- Enter your company name in Arabic, French, or English.
- Click **Valider** to validate the name in all languages.
- If all names are valid, click **Réserver** to go to the official reservation portal.
- Use the AI chat assistant for help, name checks, or FAQs.

---

## API Endpoints

### Flask Backend (Validation)
- `POST /api/filter` – Validate a company or commercial name

### FastAPI Backend (AI Chat)
- `POST /api/name_check` – AI-powered name validation
- `POST /api/faq` – AI-powered FAQ
- `GET /api/health` – Health check

---



## License
This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## Maintainer
- [ka7loun](https://github.com/ka7loun)

For questions or support, please open an issue on GitHub.
