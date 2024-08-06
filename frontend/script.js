let scholars = [];

// Fetch the JSON data
fetch('staff_affiliation.json')
  .then(response => response.json())
  .then(data => {
    scholars = data;
  })
  .catch(error => {
    console.error('Error fetching staff_affiliation.json:', error);
  });

const searchInput = document.querySelector('.search-input');
const suggestionsList = document.getElementById('suggestions-list');
const suggAndResultContainer = document.getElementById('sugg_and_result');
const resultsContainer = document.getElementById('results');

resultsContainer.style.display = 'none';

searchInput.addEventListener('input', function () {
  const input = this.value.toLowerCase();
  
  if (input.length > 0) {
    fetch(`http://127.0.0.1:5001/search?query=${encodeURIComponent(input)}&top_n=5`)
      .then(response => response.json())
      .then(apiData => {
        const filteredScholars = apiData.map(apiScholar => {
          const scholar = scholars.find(s => s.name.toLowerCase() === apiScholar.name.toLowerCase());
          if (scholar) {
            return { ...scholar, score: apiScholar.score };
          }
          return null;
        }).filter(scholar => scholar !== null);
        
        suggAndResultContainer.style.display = 'block';
        suggestionsList.style.display = 'block';
        displaySuggestions(filteredScholars);
      })
      .catch(error => {
        console.error('Error fetching API data:', error);
      });
  } else {
    suggestionsList.style.display = 'none';
    suggAndResultContainer.style.display = 'none';
    resultsContainer.style.display = 'none';
  }
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
            <span class="interest"><strong>Interest: </strong> ${suggestion.interests.join(', ')}</span><br>
            <span class="score"><strong>Cosine Similarlity: </strong> ${suggestion.score.toFixed(2)}</span>
          </div>
        </div>`;
      listItem.addEventListener('click', function () {
        // searchInput.value = suggestion.name;
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
    fetch(`http://127.0.0.1:5001/search?query=${encodeURIComponent(input)}&top_n=5`)
      .then(response => response.json())
      .then(apiData => {
        const results = apiData.map(apiScholar => {
          const scholar = scholars.find(s => s.name.toLowerCase() === apiScholar.name.toLowerCase());
          if (scholar) {
            return { ...scholar, score: apiScholar.score };
          }
          return null;
        }).filter(scholar => scholar !== null);

        if (results.length > 0) {
          displayResults(results[0]);
          resultsContainer.style.display = 'block';
        } else {
          resultsContainer.innerHTML = '<p>No results found.</p>';
          resultsContainer.style.display = 'none';
        }
      })
      .catch(error => {
        console.error('Error fetching API data:', error);
      });
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
    <p><strong>Score:</strong> ${result.score.toFixed(2)}</p>
  `;
  resultsContainer.appendChild(resultItem);

  const approximity = document.createElement('div');
  approximity.className = 'approximity';
  approximity.innerHTML = `
    <p><strong>Cosine Similarlity:</strong> ${result.score.toFixed(2)}</p>
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
