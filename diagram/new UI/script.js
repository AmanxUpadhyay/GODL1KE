let scholars = [];

// Fetch the JSON data
fetch('staff_affiliation.json')
  .then(response => response.json())
  .then(data => {
    scholars = data;
  })
  .catch(error => {
    console.error('Error staff_affiliation.json:', error);
  });

const searchInput = document.querySelector('.search-input');
const suggestionsList = document.getElementById('suggestions-list');
const suggAndResultContainer = document.getElementById('sugg_and_result');
const resultsContainer = document.getElementById('results');


resultsContainer.style.display = 'none';

searchInput.addEventListener('input', function () {
  const input = this.value.toLowerCase();
  const filteredScholars = scholars.filter(scholar => 
    scholar.name.toLowerCase().includes(input) ||
    scholar.interests.some(interest => interest.toLowerCase().includes(input))
  );
  
  if (input.length > 0) {
    suggAndResultContainer.style.display = 'block';
    suggestionsList.style.display = 'block';
  } else {
    suggestionsList.style.display = 'none';
    suggAndResultContainer.style.display = 'none';
    resultsContainer.style.display = 'none';
  }
  
  displaySuggestions(filteredScholars);
});

function displaySuggestions(suggestions) {
  suggestionsList.innerHTML = '';
  if (suggestions.length > 0) {
    suggestions.forEach(suggestion => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <div class="profile-container">
          <img src="${suggestion.url_picture || 'default-profile.jpg'}" alt="${suggestion.name}'s profile picture" class="profile-image">
          <div class="profile-details">
            <strong class="resrch_name">Name: </strong> ${suggestion.name}<br>
            <span class="interest"><strong>Interest: </strong> ${suggestion.interests.join(', ')}</span>
          </div>
        </div>`;
      listItem.addEventListener('click', function () {
        
        // searchInput.value = '';
        displayResults(suggestion);
        resultsContainer.style.display = 'block';
      });
      suggestionsList.appendChild(listItem);
    });
  } else {
    const noResultsItem = document.createElement('li');
    noResultsItem.textContent = 'No results found';
    suggestionsList.appendChild(noResultsItem);
  }
}

searchInput.addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    const input = searchInput.value.toLowerCase();
    const results = scholars.filter(scholar => 
      scholar.name.toLowerCase().includes(input) ||
      scholar.interests.some(interest => interest.toLowerCase().includes(input))
    );
    if (results.length > 0) {
      displayResults(results[0]); 
      resultsContainer.style.display = 'block';
    } else {
      resultsContainer.innerHTML = '<p>No results found.</p>';
      resultsContainer.style.display = 'none';
    }
  }
});

function displayResults(result) {
  resultsContainer.innerHTML = '';

  const resultItem = document.createElement('div');
  resultItem.className = 'result-item';
  resultItem.innerHTML = `
    <p><strong>Name:</strong> ${result.name}</p>
    <p><strong>Affiliation:</strong> ${result.affiliation}</p>
    <p><strong>Email:</strong> ${result.email_domain}</p>
    <p><strong>Scholar ID:</strong> ${result.scholar_id}</p>
  `;
  resultsContainer.appendChild(resultItem);

  const approximity = document.createElement('div');
  approximity.className = 'approximity';
  approximity.innerHTML = `
    <p><strong>Accuracy:</strong> ${(result.score * 100).toFixed(2)}%</p>
  `;
  resultsContainer.appendChild(approximity);

  if (result.publications && result.publications.length > 0) {
    const publicationsContainer = document.createElement('div');
    publicationsContainer.className = 'publications';
    publicationsContainer.innerHTML = '<p><strong>Publications:</strong></p>';
    result.publications.forEach(publication => {
      const publicationItem = document.createElement('div');
      publicationItem.innerHTML = `
        <p><strong>Title:</strong> ${publication.bib.title}</p>
        <p><strong>Year:</strong> ${publication.bib.pub_year}</p>
        <p><strong>Citation:</strong> ${publication.bib.citation}</p>
        <hr>
      `;
      publicationsContainer.appendChild(publicationItem);
    });
    resultsContainer.appendChild(publicationsContainer);
  } else {
    const noPublicationsItem = document.createElement('p');
    noPublicationsItem.textContent = 'No publications found.';
    resultsContainer.appendChild(noPublicationsItem);
  }

  resultsContainer.style.display = 'block';
}
