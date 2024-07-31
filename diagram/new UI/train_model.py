from sentence_transformers import SentenceTransformer, util
import json
import torch
from transformers import pipeline

# Load your data
with open('staff_affiliation.json', 'r') as f:
    staff_affiliation = json.load(f)

with open('papers.json', 'r') as f:
    papers = json.load(f)

# Combine data for training
corpus = [entry['name'] + ' ' + entry['affiliation'] for entry in staff_affiliation + papers]

# Load a pre-trained Sentence-BERT model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Load a pre-trained BERT model for synonym generation
synonym_generator = pipeline('fill-mask', model='bert-base-uncased')

# Function to generate synonyms
def generate_synonyms(word, top_k=5):
    masked_word = f"{word} is a [MASK]"
    results = synonym_generator(masked_word, top_k=top_k)
    synonyms = [result['token_str'] for result in results]
    return synonyms

# Enhance corpus with interests and their synonyms
for entry in staff_affiliation + papers:
    if 'interests' in entry:
        for interest in entry['interests']:
            corpus.append(interest)
            synonyms = generate_synonyms(interest)
            corpus.extend(synonyms)

corpus = list(set(corpus))  # Remove duplicates

# Encode the enhanced corpus
corpus_embeddings = model.encode(corpus, convert_to_tensor=True)

# Save the model and embeddings
model.save('semantic_model')
torch.save(corpus_embeddings, 'corpus_embeddings.pt')
