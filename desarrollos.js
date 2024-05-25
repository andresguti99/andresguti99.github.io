// Import necessary functions
import { fetchData } from './data.js';

// Get URL parameters
let params = (new URL(document.location)).searchParams;
let city = params.get('city') || 'all';
let project = params.get('project');


fetchData().then(data => {
    // Remove the position object for all the cities
    for (const city in data) {
        // Check if the current property is a city object
        if (typeof data[city] === "object" && !Array.isArray(data[city])) {
            // Delete the "position" property from the city object
            delete data[city].position;
        }
    }

    // If a project is specified in the URL parameters
    if (project) {
        // Display the project details
        displayProjectDetails(data, project);
    }
    // If a city is specified in the URL parameters
    else if (city) {
        // Display the projects of the city
        displayProjects(data, city);
    }
});

function displayProjects(data, city) {
    // Initialize projects
    let projects;

    console.log(city);
    console.log(project)

    // Check if city parameter is 'all'
    if (city === 'all') {
        // Create an empty array to hold all projects
        projects = [];

        // Loop through each city in the data
        for (const cityKey in data) {
            // Extract the projects of the current city
            const cityProjects = data[cityKey];

            // Push each project to the 'projects' array
            for (const projectKey in cityProjects) {
                // Create a new project object that includes the city
                const projectWithCity = { ...cityProjects[projectKey], city: cityKey, projectKey: projectKey };
                projects.push(projectWithCity);
            }
        }
    } else {
        // Fetch projects of the selected city
        projects = Object.keys(data[city]).map(projectKey => ({ ...data[city][projectKey], city, projectKey }));
    }

    // Sort the projects by year
    const sortedProjects = Object.values(projects).sort((a, b) => b.year - a.year);

    // Get the container for the projects
    console.log(document.querySelector('#projects-container'));
    const projectsContainer = document.querySelector('#projects-container');

    // Clear any previously displayed projects
    projectsContainer.innerHTML = '';

    // Display each project
    sortedProjects.forEach(project => {
        // Create a card for the project
        const projectCard = document.createElement('div');
        projectCard.classList.add('card', 'mb-3');

        // Add the Bootstrap grid classes
        projectCard.classList.add('col-lg-4', 'col-md-6', 'col-sm-12');

        // Add the project's image to the card
        const projectImage = document.createElement('img');
        projectImage.src = project.images[0];
        projectImage.classList.add('card-img-top');
        projectCard.appendChild(projectImage);

        // Create a container for the card's text
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        projectCard.appendChild(cardBody);

        // Add the project's name, city and logo to the card
        const projectName = document.createElement('div');
        projectName.classList.add('d-flex', 'align-items-center');

        const projectLogo = document.createElement('img');
        projectLogo.classList.add('project-logo');
        projectLogo.src = project.logo;
        projectLogo.alt = `${project.name} Logo`;
        projectLogo.width = 70;
        projectLogo.height = 70;

        const projectTitle = document.createElement('h5');
        projectTitle.classList.add('mb-0', 'ml-3');
        projectTitle.textContent = project.name;

// Append the elements to the projectName div
        projectName.appendChild(projectLogo);
        projectName.appendChild(projectTitle);

// Append the projectName div to the card body
        cardBody.appendChild(projectName);


        const projectCity = document.createElement('p');
        projectCity.classList.add('card-text', 'mt-2');
        projectCity.textContent = project.city;
        cardBody.appendChild(projectCity);

        // Add the project's 'Descúbrelo' button to the card
        const projectButton = document.createElement('a');
        projectButton.classList.add('btn', 'mt-2');
        projectButton.href = `desarrollos.html?project=${encodeURIComponent(project.projectKey)}`;
        projectButton.textContent = 'Descúbrelo';

        // Check if the project is available or sold and add the appropriate class to the button
        if (project.price.toLowerCase().includes("vendido")) {
            projectButton.classList.add('btn-sold');
        } else {
            projectButton.classList.add('btn-available');
        }

        cardBody.appendChild(projectButton);

        // Append the card to the container
        projectsContainer.appendChild(projectCard);
    });
}

function displayProjectDetails(data, projectName) {
    const project = Object.values(data).find(city => city[projectName] !== undefined)[projectName];
    const projectsContainer = document.querySelector('#projects-container');
    let combinedHTML = '';

    // Check if the project is available or sold and add the appropriate class to the badge
    let availabilityClass;
    if (project.price.toLowerCase().includes("vendido")) {
        availabilityClass = 'badge-sold';
    } else {
        availabilityClass = 'badge-available';
    }

    // Add the badge to your HTML string
    const availabilityBadge = `<span class="badge ${availabilityClass} badge-mini">&nbsp;</span>`;

    const topSection = `
        <div class="top-section">
            <img class="bg-image" src="${project.images[0]}" alt="${project.name} Image">
            <div class="logo-container">
                <img class="logo-overlay" src="${project.logo}" alt="${project.name} Logo">
            </div>
        </div>
        <div class="project-info">
            <h2>${project.name}</h2>
            <div class="price-badge-container">
                ${availabilityBadge}
                <p class="project-price no-margin">${project.price}</p>
            </div>
            <p class="project-description">${project.description}</p>
        </div>
    `;

    const carouselSection = `
        <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-indicators">
                ${project.images.map((image, index) =>
        `<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${index}" ${index === 0 ? 'class="active" aria-current="true"' : ''} aria-label="Slide ${index + 1}"></button>`
    ).join('')}
            </div>
            <div class="carousel-inner">
                ${project.images.map((image, index) =>
        `<div class="carousel-item ${index === 0 ? 'active' : ''}">
                        <img src="${image}" class="d-block w-100" alt="${project.name} Image ${index + 1}">
                    </div>`
    ).join('')}
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>
    `;

    combinedHTML += topSection + carouselSection;

    if (project.virtual_tour) {
        const virtualTourSection = `
        <div class="container my-2">
            <div class="row justify-content-center">
                ${project.virtual_tour}
                <p>Tour Virtual</p>
            </div>
        </div>
        `;
        combinedHTML += virtualTourSection;
    }

    if (project.models) {
        combinedHTML += `<div class="my-4"></div><h3>Modelos de Vivienda</h3>`;
        combinedHTML += createAccordionNavigation(project);
    } else {
        combinedHTML += createProjectDetailsSection(project);
    }

    combinedHTML += createContactInfoSection(project);

    projectsContainer.innerHTML = combinedHTML;
}

function createModelDetails(model, modelName) {
    return `
        ${createModelCarousel(model.images, modelName)}
        ${createFloorPlans(model.floor_plan)}
        <p><strong>Precio:</strong> ${model.price}</p>
        <p><strong>Plantas:</strong> ${model.floors}</p>
        <p><strong>Recámaras:</strong> ${model.bedrooms}</p>
        <p><strong>Baños:</strong> ${model.bathrooms}</p>
        <p><strong>Superficie de Terreno:</strong> ${model.size}</p>
        <p><strong>Superficie Construida:</strong> ${model.construction_size}</p>
        <p><strong>Características Principales de la Vivienda:</strong> ${model.house_info}</p>
        <p><strong>Características del Conjunto Habitacional:</strong> ${model.additional_info}</p>
    `;
}

function createFloorPlans(floorPlans) {
    if (floorPlans.length === 1) {
        return `
            <div class="container my-2">
                <div class="row floor-plan-section justify-content-center">
                    <div class="col-12 col-md-6 text-center">
                        <img src="${floorPlans[0]}" alt="Planta Arquitectónica">
                        <p>Planta Arquitectónica</p>
                    </div>
                </div>
            </div>
        `;
    } else {
        return `
            <div class="container my-2">
                <div class="row floor-plan-section">
                    <div class="col-12 col-md-6">
                        <img src="${floorPlans[0]}" alt="Planta Baja">
                        <p>Planta Baja</p>
                    </div>
                    <div class="col-12 col-md-6">
                        <img src="${floorPlans[1]}" alt="Planta Alta">
                        <p>Planta Alta</p>
                    </div>
                </div>
            </div>
        `;
    }
}

function createProjectDetailsSection(project) {
    let detailsSection = '';
    if (project.floor_plan) {
        detailsSection += createFloorPlans(project.floor_plan);
    }
    detailsSection += `
    <div class="row project-details-section">
        <div class="col-12 col-md-6">
            <div class="project-details">
                <p><strong>Precio:</strong> ${project.price}</p>
                <p><strong>Plantas:</strong> ${project.floors}</p>
                <p><strong>Recámaras:</strong> ${project.bedrooms}</p>
                <p><strong>Baños:</strong> ${project.bathrooms}</p>
                <p><strong>Superficie de Terreno:</strong> ${project.size}</p>
                <p><strong>Superficie Construida:</strong> ${project.construction_size}</p>
                <p><strong>Características Principales de la Vivienda:</strong> ${project.house_info}</p>
                <p><strong>Características del Conjunto Habitacional:</strong> ${project.additional_info}</p>
            </div>
        </div>
    </div>
    `;
    return detailsSection;
}

function createContactInfoSection(project) {
    return `
    <div class="row">
        <div class="col-12 col-md-6">
            <div class="contact-info mt-4 mb-4">
                <h3>Contáctanos</h3>
                <p><strong>Teléfono:</strong> <a href="tel:${project.phone}">${project.phone}</a></p>
                <div class="contact-icons">
                    <a href="https://wa.me/${project.phone.replace(/\s/g, '')}?text=Quiero%20informes%20de%20${encodeURIComponent(project.name)}" target="_blank">
                        <span class="icon-text"><i class="bi bi-whatsapp"></i> WhatsApp</span>
                    </a>
                    <a href="${project.link}" target="_blank">
                        <span class="icon-text"><i class="bi bi-facebook"></i> Facebook</span>
                    </a>
                </div>
            </div>
            <p><strong>Ubicación:</strong> ${project.location}</p>
            ${project.mapEmbed}
        </div>
    </div>
    `;
}

function createModelCarousel(images, model) {
    const sanitizedModel = model.replace(/\s+/g, '-');
    return `
        <div id="carousel-${sanitizedModel}" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-indicators">
                ${images.map((image, index) =>
        `<button type="button" data-bs-target="#carousel-${sanitizedModel}" data-bs-slide-to="${index}" ${index === 0 ? 'class="active" aria-current="true"' : ''} aria-label="Slide ${index + 1}"></button>`
    ).join('')}
            </div>
            <div class="carousel-inner">
                ${images.map((image, index) =>
        `<div class="carousel-item ${index === 0 ? 'active' : ''}">
                        <img src="${image}" class="d-block w-100" alt="${model} Image ${index + 1}">
                    </div>`
    ).join('')}
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${sanitizedModel}" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carousel-${sanitizedModel}" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>
    `;
}

function createAccordionNavigation(project) {
    const models = Object.keys(project.models);
    let accordion = `
        <div class="accordion" id="modelAccordion">
    `;

    models.forEach((model, index) => {
        const sanitizedModel = model.replace(/\s+/g, '-');
        accordion += `
            <div class="accordion-item">
                <h2 class="accordion-header" id="heading-${sanitizedModel}">
                    <button class="accordion-button ${index === 0 ? '' : 'collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${sanitizedModel}" aria-expanded="${index === 0}" aria-controls="collapse-${sanitizedModel}">
                        ${model}
                    </button>
                </h2>
                <div id="collapse-${sanitizedModel}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" aria-labelledby="heading-${sanitizedModel}" data-bs-parent="#modelAccordion">
                    <div class="accordion-body">
                        ${createModelDetails(project.models[model], model)}
                    </div>
                </div>
            </div>
        `;
    });

    accordion += '</div>';
    return accordion;
}


