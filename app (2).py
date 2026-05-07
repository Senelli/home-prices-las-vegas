import os
import sqlalchemy
from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
import datetime as dt

app = Flask(__name__)
CORS(app)

# Reads from environment variables (set these in Streamlit Secrets or your hosting platform)
host     = os.environ.get("DB_HOST")
user     = os.environ.get("DB_USER")
password = os.environ.get("DB_PASSWORD")
dbname   = os.environ.get("DB_NAME", "neondb")
port     = os.environ.get("DB_PORT", "5432")

app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{user}:{password}@{host}/{dbname}?sslmode=require'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class city_zipcodes(db.Model):
    zipcode = db.Column(db.Integer, primary_key=True)
    city    = db.Column(db.String(50), nullable=False)
    state   = db.Column(db.String(50), nullable=False)

class home_values(db.Model):
    zipcode = db.Column(db.Integer, db.ForeignKey('city_zipcodes.zipcode'), nullable=False)
    Date    = db.Column(db.Date, nullable=False)
    value   = db.Column(db.Numeric, primary_key=True)


@app.route('/get_city_zipcodes')
def get_city_zipcodes():
    zipcodes_and_values = db.session.query(
            city_zipcodes, home_values,
            func.extract('year',  home_values.Date).label('year'),
            func.extract('month', home_values.Date).label('month'),
            func.extract('day',   home_values.Date).label('day'))\
        .select_from(home_values)\
        .join(city_zipcodes, home_values.zipcode == city_zipcodes.zipcode)\
        .order_by(home_values.zipcode.asc(), home_values.Date.asc())\
        .all()

    nested_results = {}
    for city_zipcode, home_value, year, month, day in zipcodes_and_values:
        zipcode_key = int(home_value.zipcode)
        year_key    = int(year)

        if zipcode_key not in nested_results:
            nested_results[zipcode_key] = {
                'zipcode': zipcode_key,
                'city':    city_zipcode.city,
                'state':   city_zipcode.state,
                'yearly_values': []
            }

        yearly_values = next(
            (y for y in nested_results[zipcode_key]['yearly_values'] if y['year'] == year_key), None)

        if yearly_values is None:
            yearly_values = {'year': year_key, 'monthly_values': []}
            nested_results[zipcode_key]['yearly_values'].append(yearly_values)

        yearly_values['monthly_values'].append({
            'date':   dt.datetime(year_key, int(month), int(day)).strftime('%Y-%m-%d'),
            'month':  int(month),
            'day':    int(day),
            'values': float(home_value.value)
        })

    return jsonify(list(nested_results.values()))


if __name__ == '__main__':
    app.run(debug=True)
