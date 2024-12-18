# PnP Promotions Scraper and Viewer

A web application that displays Pick n Pay promotions in a user-friendly interface.

## Project Structure
```
PnPscraper/
├── backend/           # Flask backend API
├── frontend/         # React frontend application
├── pnp_data/        # Data files
└── converter.py     # Data conversion utility
```

## Setup Instructions

### Backend Setup
1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the Flask backend:
   ```bash
   python backend/app.py
   ```

### Frontend Setup
1. Install Node.js dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

## Features
- View all current PnP promotions
- Search products by name
- Filter by price range and promotion type
- Responsive design for all devices
- Automatic data updates
