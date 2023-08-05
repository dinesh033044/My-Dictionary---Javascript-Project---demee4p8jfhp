// Get elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const historyBtn = document.getElementById('historyBtn');
const wordCardsContainer = document.getElementById('wordCardsContainer');
const clearHistory=document.getElementById('clearHistory');

// Event listeners
searchBtn.addEventListener('click', searchWord);
historyBtn.addEventListener('click', showHistory);

// Search button click handler
function searchWord() {
  const word = searchInput.value.trim();
  if (word !== '') {
    // Call API and get word meaning
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          const wordObj = {
            word: data[0].word,
            meaning: data[0].meanings[0].definitions[0].definition
          };
          console.log(wordObj);
          // Add word to word cards
          addWordCard(wordObj);
          // Save word to localStorage
          saveToLocalStorage(wordObj);
          // Clear search input
          searchInput.value = '';
        } else {
          alert('Word not found');
        }
      })
      .catch(error => {
        console.log(error);
        alert('An error occurred while fetching the word meaning');
      });
  }
}

// Add word card to the UI
function addWordCard(wordObj) {
  const card = document.createElement('div');
  card.className = 'wordCard';
  card.innerHTML = `
    <h2> Word: ${wordObj.word}</h2>
    <p><h2>Meaning:</h2> ${wordObj.meaning}</p>
    <button class="deleteBtn">Delete</button>
  `;
  wordCardsContainer.appendChild(card);

  // Add event listener to delete button
  const deleteBtn = card.querySelector('.deleteBtn');
  deleteBtn.addEventListener('click', () => {
    // Delete word card
    card.remove();
    // Remove word from localStorage
    removeFromLocalStorage(wordObj);
  });
}

// Show search history
function showHistory() {
  // Clear word cards container
  wordCardsContainer.innerHTML = '';

  // Get search history from localStorage
  const searches = getFromLocalStorage();

  // Add word cards to the UI
  searches.forEach(wordObj => {
    addWordCard(wordObj);
  });
}

// Save word to localStorage
function saveToLocalStorage(wordObj) {
  const searches = getFromLocalStorage();
  searches.push(wordObj);
  localStorage.setItem('searches', JSON.stringify(searches));
}

// Remove word from localStorage
function removeFromLocalStorage(wordObj) {
  const searches = getFromLocalStorage();
  const index = searches.findIndex(obj => obj.word === wordObj.word);
  if (index !== -1) {
    searches.splice(index, 1);
    localStorage.setItem('searches', JSON.stringify(searches));
  }
}

// Get search history from localStorage
function getFromLocalStorage() {
  const searchesString = localStorage.getItem('searches');
  let searches = [];
  if (searchesString) {
    searches = JSON.parse(searchesString);
  }
  return searches;
}

// clear All history

// clearHistory.addEventListener('click',()=>{
//   searches=[];
//   wordCardsContainer.innerHTML = '';
//   searches.splice();
//   localStorage.setItem('searches', JSON.stringify(searches));
// });
