fetch('asset/data/data.json')
    .then(response => response.json())
    .then(data => {
        document.dispatchEvent(new CustomEvent('data-loaded', { detail: data }));
    })
    .catch(error => console.error('Error loading the JSON data:', error));

    document.addEventListener('suggestion-selected', function(event) {
        const company = event.detail;
        const searchInput = document.getElementById('searchInput');
        const resultsList = document.getElementById('searchResultsList');
    
        searchInput.value = company.entreprise; // Set the search bar value
        displayResults([company]); // Function to display results in the main script
        hideDepartmentButtons(); // Optionally hide department buttons
    });