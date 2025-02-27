document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const suggestionsList = document.getElementById('suggestionsList');
    let jsonData = [];

    // Assume jsonData is fetched or imported elsewhere and is available here
    // This script will use jsonData which should be set by the main script or loaded here

    // Input event for search suggestions
    searchInput.addEventListener('input', function() {
        const searchQuery = this.value.trim().toLowerCase();
        if (searchQuery.length > 0) {
            const filteredData = filterData(searchQuery);
            displaySuggestions(filteredData);
        } else {
            suggestionsList.innerHTML = ''; // Clear suggestions if input is cleared
        }
    });

    function filterData(query) {
        return jsonData.filter(company => company.entreprise.toLowerCase().includes(query));
    }

    function displaySuggestions(data) {
        suggestionsList.innerHTML = ''; // Clear previous suggestions
        data.forEach(company => {
            const li = document.createElement('li');
            li.className = 'list-group-item clickable';
            li.textContent = company.entreprise;
            li.onclick = () => {
                document.dispatchEvent(new CustomEvent('suggestion-selected', { detail: company }));
            };
            suggestionsList.appendChild(li);
        });
    }

    // Listen for an event to update jsonData externally
    document.addEventListener('data-loaded', function(event) {
        jsonData = event.detail;
    });
});