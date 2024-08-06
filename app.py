from flask import Flask, jsonify, request
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd

app = Flask(__name__)
CORS(app)

# Read CSV
researchers_df = pd.read_csv('researchers.csv')

# Assuming researchers_df is already created and populated
vectorizer = TfidfVectorizer()
tfidf = vectorizer.fit_transform(researchers_df['combined'])

@app.route('/search', methods=['GET'])
def search_researcher():
    query = request.args.get('query', '')
    top_n = int(request.args.get('top_n', 5))
    
    if not query:
        return jsonify({'error': 'Query parameter is required'}), 400

    query_lower = query.lower()
    name_matches = researchers_df[researchers_df['name'].str.lower().str.contains(query_lower)]
    
    results = []
    if not name_matches.empty:
        for _, row in name_matches.iterrows():
            researcher_name = row['name']
            score = 1.0
            reason = "Direct name match"
            results.append({'name': researcher_name, 'score': score, 'reason': reason})
            if len(results) >= top_n:
                return jsonify(results)
    
    query_vec = vectorizer.transform([query_lower])
    similarity = cosine_similarity(query_vec, tfidf).flatten()
    top_indices = similarity.argsort()[-top_n*2:][::-1]
    
    for idx in top_indices:
        researcher_name = researchers_df.iloc[idx]['name']
        if any(res['name'] == researcher_name for res in results):
            continue
        
        score = similarity[idx]
        researcher_text = researchers_df.iloc[idx]['combined'].lower()
        query_terms = query_lower.split()
        relevant_terms = [term for term in query_terms if term in researcher_text]
        reason = f"Relevant terms found: {', '.join(relevant_terms)}"
        
        results.append({'name': researcher_name, 'score': score, 'reason': reason, 'area_of_interest': researchers_df.iloc[idx]['interests'],})
        
        if len(results) >= top_n:
            break
    
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)  # Change port as necessary
