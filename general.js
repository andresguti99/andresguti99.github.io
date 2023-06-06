import {fetchData} from './data.js';

//Function to generate a button for each city in the dropdown Desarrollos with the city as a url parameter
function generateDropdownMenu(data) {
    // Get the cities
    const cities = Object.keys(data).sort();

    // Get the dropdown menu
    const dropdownMenu = document.querySelector('#cities-dropdown');

    // Create a dropdown item for each city
    cities.forEach(city => {
        const dropdownItem = document.createElement('a');
        dropdownItem.classList.add('dropdown-item');
        dropdownItem.href = `desarrollos.html?city=${city}`;
        dropdownItem.textContent = city;

        // Append the dropdown item to the menu
        dropdownMenu.appendChild(dropdownItem);
    });
}


function updateCarousel (projects) {
    const logosContainer = document.createElement('div');
    logosContainer.className = 'project-logos-container';

    const carouselItem = document.querySelector('.carousel-item');
    carouselItem.appendChild(logosContainer);

    let maxProjectsToShow = 10;

    if (projects.length < 10) {
        maxProjectsToShow = projects.length;
    }

    // Start from the end of the projects array
    for (let i = maxProjectsToShow - 1; i >= 0; i--) {
        const project = projects[i];

        const logoDiv = document.createElement('div');
        logoDiv.className = 'project-logo-overlay';

        const logoImg = document.createElement('img');
        logoImg.src = project.logo;

        logoDiv.appendChild(logoImg);
        logosContainer.appendChild(logoDiv);
    }

    for (let i = 0; i < 2; i++) {
        let projectSlide = document.querySelector(`.project_slide_${i+1}`);
        projectSlide.innerHTML = '';
        const project = projects[i];

        projectSlide.innerHTML = `
      <div class="d-flex justify-content-center align-items-center" style="width: 100%; height: 100%; background-color: blue;">
            <div class="project-carousel-image-container">
                <img src="${project.image}" alt="Project image" class="project-carousel-image">
            </div>
            <div class="project-overlay-1">
                <div class="project-logo-container">
                    <a href="desarrollos.html?project=${encodeURIComponent(project.projectKey)}">
                        <img src="${project.logo}" alt="Logo">
                    </a>
                </div>
            </div>
            <div class="project-overlay-2">
              <div class="project-text-wrapper">
                <h3> Precio: <span style="color:#29292f;font-weight:bold">${project.price}</span>!</h3>
              </div>
              <p>${project.name}</p>
            </div>
      </div>
    `;
    }
}

fetchData().then(data => {
    let projects = [];

    // Remove the position object for all the cities
    for (const city in data) {
        if (typeof data[city] === "object" && !Array.isArray(data[city])) {
            delete data[city].position;
        }
    }

    // Loop through each city in the data
    for (const cityKey in data) {
        // Extract the projects of the current city
        const cityProjects = data[cityKey];

        // If it's an object, not a position or an array
        if (typeof cityProjects === "object" && !Array.isArray(cityProjects)) {
            // Push each project to the 'projects' array
            for (const projectKey in cityProjects) {
                // Create a new project object that includes the city and required details (logo, price and year for sorting)
                const projectWithDetails = {
                    logo: cityProjects[projectKey].logo,
                    price: cityProjects[projectKey].price,
                    year: cityProjects[projectKey].year,
                    name: cityProjects[projectKey].name,
                    image: cityProjects[projectKey].images[0],
                    projectKey: projectKey,
                };
                projects.push(projectWithDetails);
            }
        }
    }

    // Sort the projects by year in descending order
    projects.sort((a, b) => b.year - a.year);




    //Populate the cities for the dropdown menu
    generateDropdownMenu(data);

    //Generate the data for the carousel
    updateCarousel (projects)

});











