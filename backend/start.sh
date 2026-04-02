echo "Running collectstatic..."
python manage.py collectstatic --noinput

echo "Running migrations..."
python manage.py migrate

echo "Starting gunicorn..."
gunicorn job_tracker.wsgi:application --bind 0.0.0.0:8000 --workers 1 --timeout 120