from flask import Flask, request, jsonify
from semantic_search import semantic_search
import json

app = Flask(__name__)

@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('query', '')
    results = semantic_search(query)
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)
