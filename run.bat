
@echo off

call venv\Scripts\activate
start cmd /k python manage.py runserver

cd frontend/vite_kordict
start cmd /k serve -s dist -l 5173

timeout /t 10 >nul
start http://localhost:5173