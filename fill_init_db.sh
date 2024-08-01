#!/bin/bash
set -e

until PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

TABLES=$(PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" -t | xargs)

if [ "$TABLES" -eq "0" ]; then
  echo "Database is empty. Running migrations and initial data load..."
  SAMPLE_DATA_DIR="api/management/sample_docker_data"

  echo "Migrating..."
  python manage.py migrate

  echo "Filling sample database..."
  python manage.py read_dict_jsons "$SAMPLE_DATA_DIR/sample.json"
  echo "Editing word data..."
  python manage.py remove_html

  echo "Adding Hanja characters to database..."
  python manage.py read_hanja_txt "$SAMPLE_DATA_DIR/hanja_sample.json" "$SAMPLE_DATA_DIR/hanzi_sample.txt"
  echo "Editing Hanja data..."
  python manage.py replace_radicals "$SAMPLE_DATA_DIR/hanzi_sample.txt"
  echo "Adding more Hanja data..." 
  python manage.py add_hanja_level
  
  echo "Adding test user..."
  python manage.py add_superuser

  echo "Completed database initialization."
else
  echo "Database is not empty. Skipping initialization."
fi