document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const suggestionsList = document.getElementById('suggestionsList');
    const resultsList = document.getElementById('searchResultsList');
    const backButton = document.getElementById('backButton');
    const buttonsSection = document.getElementById('buttons-section');
    const departmentInstruction = document.getElementById('department-instruction'); // Reference to the department instruction text
    let jsonData = [];
    let lastClickedButton = null;

    // Load JSON data
    fetch('asset/data/data.json')
        .then(response => response.json())
        .then(data => {
            jsonData = data;
        })
        .catch(error => {
            console.error('Error loading the JSON data:', error);
        });

        searchButton.addEventListener('click', function() {
            const searchQuery = searchInput.value.trim().toLowerCase();
            if (searchQuery) {
                const filteredData = jsonData.filter(company => company.name.toLowerCase().includes(searchQuery));
                displayResults(filteredData);
            }
        });
    
        function displayResults(data) {
            resultsList.innerHTML = '';
            data.forEach(company => {
                const li = document.createElement('li');
                li.className = 'list-group-item';
        
                // Company information display formatting
                const infoText = document.createElement('p');
                infoText.innerHTML = `
                    <strong>Entreprise:</strong> ${company.entreprise}<br>
                    <strong>Responsable:</strong> ${company.name} ${company.lastname}<br>
                    <strong>Email:</strong> ${company.email}<br>
                    <strong>Phone:</strong> ${company.phone}<br>
                    <strong>Département desservi:</strong> ${company.departement}<br>
                    <strong>Services:</strong> ${company.keyactivity}
                `;
                li.appendChild(infoText);
        
                // 'En savoir plus' button to show more details
                const moreInfoBtn = document.createElement('button');
                moreInfoBtn.textContent = 'En savoir plus';
                moreInfoBtn.className = 'btn btn-info';
                moreInfoBtn.addEventListener('click', function() {
                    showCompanyDetails(company);
                });
                li.appendChild(moreInfoBtn);
                resultsList.appendChild(li);
            });
        }
        
        function showCompanyDetails(company) {
            const modal = document.getElementById('companyInfoModal');
            const details = document.getElementById('companyDetails');
            details.innerHTML = `
                <strong>Entreprise:</strong> ${company.entreprise}<br>
                <strong>Responsable:</strong> ${company.name} ${company.lastname}<br>
                <strong>Email:</strong> ${company.email}<br>
                <strong>Phone:</strong> ${company.phone}<br>
                <strong>Département desservi:</strong> ${company.departement}<br>
                <strong>Services:</strong> ${company.keyactivity}
            `;
            modal.style.display = 'flex'; // Show the modal
        }
        
        document.querySelector('.close-button').addEventListener('click', function() {
            const modal = document.getElementById('companyInfoModal');
            modal.style.display = 'none';
        });


    // Input event for search suggestions
    searchInput.addEventListener('input', function() {
        const searchQuery = this.value.trim().toLowerCase();
        if (searchQuery.length > 0) {
            displaySuggestions(jsonData.filter(company => company.entreprise.toLowerCase().includes(searchQuery)));
        } else {
            suggestionsList.innerHTML = ''; // Clear suggestions if input is cleared
        }
    });

    // Click event for search button
    searchButton.addEventListener('click', function() {
        const searchQuery = searchInput.value.trim().toLowerCase();
        if (searchQuery.length === 0) {
            resultsList.innerHTML = '';
            return;
        }
        displayResults(jsonData.filter(company => company.entreprise.toLowerCase().includes(searchQuery)));
        hideDepartmentButtons();
        departmentInstruction.style.display = 'none'; // Hide the general instruction
    });

    // Department button event handling with toggle functionality
    document.querySelectorAll('#buttons-section button:not(#backButton)').forEach(button => {
        button.addEventListener('click', function() {
            if (lastClickedButton === this) {
                resetInterface();
            } else {
                lastClickedButton = this;
                displayFilteredResults(this);
            }
        });
    });

    // Back button and department button shared reset functionality
    backButton.addEventListener('click', resetInterface);

    function displayFilteredResults(button) {
        const department = button.textContent.trim();
        const filteredData = jsonData.filter(company => company.departement.toLowerCase().includes(department.toLowerCase()));
        toggleButtonVisibility(button);
        displayResults(filteredData, button);
        departmentInstruction.textContent = `List depatman ki bay sevis nan depatman ${department}`; // Update instruction text
        departmentInstruction.style.display = 'block'; // Show updated instruction
    }

    function toggleButtonVisibility(selectedButton) {
        document.querySelectorAll('#buttons-section button').forEach(button => {
            if (button !== selectedButton) {
                button.style.display = 'none'; // Hide other buttons
            }
        });
        selectedButton.style.display = 'block'; // Ensure the selected button is visible
        backButton.style.display = 'block'; // Show back button
    }

    function displaySuggestions(data) {
        suggestionsList.innerHTML = '';
        data.forEach(company => {
            const li = document.createElement('li');
            li.className = 'list-group-item clickable';
            li.textContent = company.entreprise;
            li.onclick = () => {
                searchInput.value = company.entreprise;
                displayResults([company]);
                suggestionsList.innerHTML = '';
                hideDepartmentButtons();
                departmentInstruction.style.display = 'none'; // Hide instruction when suggestion is clicked
            };
            suggestionsList.appendChild(li);
        });
    }

    function displayResults(data, button = null) {
        resultsList.innerHTML = '';
        data.forEach(company => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.textContent = `${company.entreprise}`;
    
            // Add 'Learn More' button
            const learnMoreBtn = document.createElement('button');
            learnMoreBtn.className = 'btn btn-info';
            learnMoreBtn.textContent = 'En savoir plus';
            learnMoreBtn.onclick = () => showCompanyDetails(company);
    
            li.appendChild(learnMoreBtn);
            resultsList.appendChild(li);
        });
        backButton.style.display = 'block';
    }

    

    function clearResults() {
        while (resultsList.firstChild) {
            resultsList.removeChild(resultsList.firstChild);
        }
    }

    function hideDepartmentButtons() {
        document.querySelectorAll('#buttons-section button:not(#backButton)').forEach(button => {
            button.style.display = 'none';
        });
    }

    function resetInterface() {
        document.querySelectorAll('#buttons-section button').forEach(button => {
            button.style.display = 'block';
        });
        resultsList.innerHTML = '';
        suggestionsList.innerHTML = '';
        searchInput.value = '';
        backButton.style.display = 'none';
        lastClickedButton = null;
        departmentInstruction.textContent = 'Klike yon depatman pouw jwenn konpayi ki ofri sevis asenisman'; // Reset to original text
        departmentInstruction.style.display = 'block'; // Show the general instruction
    }

    
});

