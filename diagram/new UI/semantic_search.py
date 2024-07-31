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

corpus = [entry['name'] + ' ' + entry['affiliation'] for entry in staff_affiliation + papers]

def semantic_search(query, top_k=5):
    query_embedding = model.encode(query, convert_to_tensor=True)
    hits = util.semantic_search(query_embedding, corpus_embeddings, top_k=top_k)
    hits = hits[0]  # Get the top-k hits

    results = []
    for hit in hits:
        results.append(corpus[hit['corpus_id']])

    return results

if __name__ == "__main__":
    query = "machine learning"
    results = semantic_search(query)
    print("Top 5 results for query:", query)
    for result in results:
        print(result)
