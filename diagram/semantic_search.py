import torch
from sentence_transformers import SentenceTransformer, util
import json

# Load the model and embeddings
model = SentenceTransformer('semantic_model')
corpus_embeddings = torch.load('corpus_embeddings.pt')

# Load the data
with open('staff_affiliation.json', 'r') as f:
    staff_affiliation = json.load(f)

with open('papers.json', 'r') as f:
    papers = json.load(f)

# Enhance corpus with interests and their synonyms
corpus = [entry['name'] + ' ' + entry['affiliation'] for entry in staff_affiliation + papers]
for entry in staff_affiliation + papers:
    if 'interests' in entry:
        for interest in entry['interests']:
            corpus.append(interest)
            synonyms = generate_synonyms(interest)
            corpus.extend(synonyms)

def semantic_search(query, top_k=5):
    query_embedding = model.encode(query, convert_to_tensor=True)
    hits = util.semantic_search(query_embedding, corpus_embeddings, top_k=top_k)
    hits = hits[0]  # Get the top-k hits

    results = []
    for hit in hits:
        result = {
            'text': corpus[hit['corpus_id']],
            'score': hit['score']
        }
        results.append(result)

    return results

if __name__ == "__main__":
    interests = ["Artificial Intelligence", "Machine Learning", "Data Analytics", "Software Engineering"]
    for interest in interests:
        results = semantic_search(interest)
        print(f"Top 5 results for interest: {interest}")
        for result in results:
            print(f"Text: {result['text']}, Score: {result['score']:.4f}")
