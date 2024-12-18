from flask import Flask, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

# Path to the JSON data file
DATA_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'pnp_data', 'output.json')

@app.route('/api/promotions', methods=['GET'])
def get_promotions():
    try:
        with open(DATA_FILE, 'r') as f:
            data = json.load(f)
        return jsonify(data)
    except Exception as e:
        print(f"Error loading data: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    print(f"Loading data from: {DATA_FILE}")
    app.run(debug=True, port=5001)
