# Earthquake Risk Prediction System

Production-style full-stack AI dashboard using:
- `FastAPI` backend for model inference
- `React + Tailwind` frontend for UI
- Pre-trained `.pkl` ML model for risk prediction

## Folder Structure

```text
final4/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── services/
│   │   ├── __init__.py
│   │   └── model_service.py
│   └── utils/
│       ├── __init__.py
│       ├── logging_config.py
│       └── schemas.py
├── frontend/
│   ├── package.json
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env.example
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── api/
│       │   └── client.js
│       ├── services/
│       │   └── predictionService.js
│       └── components/
│           ├── Sidebar.jsx
│           ├── MapView.jsx
│           ├── PredictionCard.jsx
│           ├── FeatureImportanceChart.jsx
│           └── ui/
│               ├── AlertMessage.jsx
│               └── LoadingSpinner.jsx
└── README.md
```

## Backend Setup (FastAPI)

1. Go to backend:
```bash
cd backend
```

2. Create and activate virtual environment:
```bash
python -m venv .venv
.venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure model path:
- Copy `.env.example` to `.env`
- Set `MODEL_PATH` to your model location:
```env
MODEL_PATH=d:/Collage/Project/Experiment/final2/earthquake_model_full.pkl
```

5. Run backend:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Frontend Setup (React)

1. Go to frontend:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure API URL:
- Copy `.env.example` to `.env`
```env
VITE_API_URL=http://127.0.0.1:8000
```

4. Start frontend:
```bash
npm run dev
```

Open: `http://127.0.0.1:5173`

## API

### `POST /predict`
Input:
```json
{
  "magnitude": 6.3,
  "depth": 120,
  "lat": 19.076,
  "lon": 72.8777
}
```

Output:
```json
{
  "prediction": "Low"
}
```

### `GET /feature-importance`
Output:
```json
{
  "features": [
    { "name": "magnitude", "value": 0.34 },
    { "name": "depth", "value": 0.22 }
  ]
}
```

## Notes

- Backend auto-adds current UTC `year`, `month`, `day` before inference.
- Risk mapping supports model outputs as either labels (`Low/Medium/High`) or encoded classes (`0/1/2`).
- UI includes loading states, error alerts, clickable map coordinates, and responsive SaaS-style layout.
