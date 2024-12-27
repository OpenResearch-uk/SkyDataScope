# SkyDataScope
🔴 SkyDataScope: Open Source Cellestial Object Research 


```console
skydatascope/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── SkyDataScope.js
│   │   ├── utils/
│   │   │   ├── constants.js
│   │   │   └── api.js
│   │   └── App.js
│   └── package.json
└── backend/
    ├── sky_calculator.py
    ├── requirements.txt
    └── app.py
```

* **To Do:** 🟢* **In Progress:** 🟡* **Done:** ✅* **WIP:** 🔴
  
# SkyDataScope Installation

## Backend Setup
```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install flask flask-cors ephem

# Start backend
python app.py
```

## Frontend Setup
```bash
npx create-react-app skydatascope
cd skydatascope

# Install dependencies
npm install lucide-react @radix-ui/react-alert-dialog

# Add Tailwind CSS
npm install -D tailwindcss
npx tailwindcss init

# Replace src/ contents with provided components
# Start frontend
npm start
```

The app will run at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
