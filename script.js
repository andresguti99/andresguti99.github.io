// Import necessary functions
import { fetchData, debounce } from './data.js';

const DEBOUNCE_DELAY = 100;

// SVG attributes
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const SVG_WIDTH = '16';
const SVG_HEIGHT = '16';
const SVG_FILL = 'rgb(180,6,6)' //Color de los pines
const SVG_CLASS = 'bi bi-geo-alt-fill';
const SVG_VIEWBOX = '0 0 16 16';
const SVG_PATH_D = 'M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z';

// CSS Styles
const ICON_POSITION = 'absolute';
const ICON_CURSOR = 'pointer';
const ICON_FONTSIZE = '2vw';
const ICON_ZINDEX = '2';

/*The Map class is responsible for generating the svg pins and position them correctly over the map.
It also adjusts the pin positions when the viewport changes.
 */
class Map {
    constructor(containerId, overlayId) {
        this.container = document.getElementById(containerId); // This is the HTML element that will contain the map
        this.overlay = document.getElementById(overlayId); //This is the HTML element that will act as the map overlay.
        this.aspectRatio = 1024 / 696; //This is the aspect ratio of the map image, which is used to correctly position the pins on the map
    }

    /*This method creates a new SVG element that represents a pin on the map.
    It takes two parameters, iconId and cityName, which are used to set the ID and data attribute of the SVG element.
    It sets several attributes and styles on the SVG element to define its appearance and position, and then returns the element.
     */
    createSvgElement(iconId, cityName) {
        const icon = document.createElementNS(SVG_NAMESPACE, 'svg');
        icon.setAttribute('xmlns', SVG_NAMESPACE);
        icon.setAttribute('width', SVG_WIDTH);
        icon.setAttribute('height', SVG_HEIGHT);
        icon.setAttribute('fill', SVG_FILL);
        icon.setAttribute('class', SVG_CLASS);
        icon.setAttribute('viewBox', SVG_VIEWBOX);
        icon.setAttribute('data-city-name', cityName);
        icon.innerHTML = `<path d="${SVG_PATH_D}"/>`;
        icon.id = iconId;
        icon.style.position = ICON_POSITION;
        icon.style.cursor =  ICON_CURSOR;
        icon.style.fontSize = ICON_FONTSIZE;
        icon.style.zIndex = ICON_ZINDEX;  // This will put the pins on top of the map-overlay
        return icon;
    }

    /*This method positions the map pins based on the data in the cities object. It first calculates the width, height, and aspect ratio of the map container.
    Then, for each city in the cities object, it does the following:
    It retrieves the pin element for the city, or creates a new one if it doesn't exist.
    It calculates the correct position of the pin based on the city's position data and the map's size and aspect ratio.
    It sets the pin's position using CSS styles.
     */
    positionPins(cities) {
        const mapWidth = this.container.offsetWidth;
        const mapHeight = this.container.offsetHeight;
        const containerAspectRatio = mapWidth / mapHeight;  // Width / Height

        for (const cityName in cities) {
            let icon = document.getElementById(`popover-icon-${cityName}`);
            if (!icon) {
                const iconId = `popover-icon-${cityName}`;
                icon = this.createSvgElement(iconId, cityName);
                this.container.appendChild(icon);
            }

            const { position: { x, y } } = cities[cityName];
            let adjustedTop = y / 100 * mapHeight;
            let adjustedLeft = x / 100 * mapWidth;

            // Adjust the position of the pins if the aspect ratios don't match
            if (containerAspectRatio > this.aspectRatio) {
                // The container is wider than the image
                adjustedLeft = adjustedLeft * (this.aspectRatio / containerAspectRatio);
            } else if (containerAspectRatio < this.aspectRatio) {
                // The container is taller than the image
                adjustedTop = adjustedTop * (containerAspectRatio / this.aspectRatio);
            }

            icon.style.top = `${adjustedTop}px`;
            icon.style.left = `${adjustedLeft}px`;
        }
    }
}

/*The popover class is responsible for generating the information popovers shown.
For single project cities a brief description for the project is shown.
For multiple project cities it shows a project list that are clickable.
 */
class Popover {
    constructor() {
        this.popover = null; //This property will hold the current popover object created by the Bootstrap library.
    }

    /*This method creates a new popover. It takes three parameters:
    button: the HTML element that will trigger the popover.
    content: the HTML content that will be displayed inside the popover.
    title: the title that will be displayed at the top of the popover.
    Before creating a new popover, it checks if there's an existing popover and disposes it using the dispose method. This ensures that there's only one popover at a time.
     */
    createPopover(button, content, title) {
        // Check if there's an existing popover and dispose it
        this.popover?.dispose();

        this.popover = new bootstrap.Popover(button, {
            html: true,
            content: content,
            container: 'body',
            trigger: 'manual',
            placement:'auto',
            title: title
        });
    }

    /*This method generates the HTML content for a popover based on a project object.
    It destructures the project object to extract the logo, name, price, description, images, and link.
    Then it uses these values to create a string of HTML that represents the project.
     */
    createProjectPopoverContent(project) {
        const { logo, name, short_name, price, description, images, link } = project;
        return `
            <div class="d-flex align-items-center project-name" data-index="0">
                <img class="project-logo" src="${logo}" alt="${name} Logo" width="70" height="70">
                <h5 class="mb-0 ml-3 flex-fill">
                   <a href="desarrollos.html?project=${encodeURIComponent(short_name)}">${name}</a>
                </h5>
                <p class="mb-0 ml-3"><strong>Precio:</strong> ${price}</p>
            </div>
            <p class="mt-3 text-justify">${description}</p>
            <img src="${images[0]}" class="img-fluid" alt="${name}">
            <a href="${link}" class="d-flex align-items-center justify-content-start mt-2" target="_blank" rel="noopener noreferrer">
                <i class="bi-facebook icon-facebook"></i>
                <span class="ml-1">Facebook</span>
            </a>
        `;
    }

    /*Show and Hide
    These methods are used to show and hide the popover.
    They check if the popover property is not null, and then call the show or hide method on the popover object.
    So, the Popover class is responsible for creating and managing the popover that displays the project details when a user clicks a city icon on the map.
    It provides methods to create the popover, generate its content, and show or hide it.
     */
    show() {
        if (this.popover) {
            this.popover.show();
        }
    }

    hide() {
        if (this.popover) {
            this.popover.hide();
        }
    }



}

/*The PopoverManager class is responsible for managing the interactions between the map, the cities, and the popovers that appear when you interact with the map.
It contains methods for registering click and hover events on the map and its elements, and for handling those events when they occur.
 */
class PopoverManager {
    constructor(cities, map, popover) {
        this.cities = cities;
        this.map = map;
        this.popover = popover;
    }

    /*This method sets up event listeners for click events on the SVG elements (representing the cities) in the map container,
     on the document body, on the map overlay, and for window resize events.
    When one of these events occurs, the corresponding handler function is called.
     */
    registerClickEvents() {
        this.map.container.querySelectorAll('svg').forEach(popoverTriggerEl => {
            popoverTriggerEl.addEventListener('click', (event) => {
                this.handleIconClick(popoverTriggerEl, event);
            });
        });

        // Listen for clicks on the document body
        document.body.addEventListener('click', (event) => {
            this.handleBodyClick(event);
        });

        // Function for closing the popovers
        this.map.overlay.addEventListener('click', (event) => {
            this.handleOverlayClick(event);
        });

        // Run the positionPins function whenever the window is resized
        window.addEventListener('resize', debounce(() => {
            this.map.positionPins(this.cities);
        }, DEBOUNCE_DELAY));
    }

    /*This method is called when an SVG element in the map container is clicked.
    It takes the clicked element as a parameter, retrieves the city name and projects associated with that city,
    and then creates and shows a popover with the appropriate content based on the number of projects in the city.
     */
    handleIconClick(icon) {
        const cityName = icon.dataset.cityName; // Get the city name from the data attribute
        const cityProjects = this.cities[cityName];  // Get the projects of the clicked city

        // Count the number of projects for the city
        const projectCount = Object.keys(cityProjects).length - 1;

        // If the city only has one project, display detailed project info
        if (projectCount === 1) {
            for (let projectKey in cityProjects) {
                if (projectKey !== 'position') {
                    let project = cityProjects[projectKey];
                    this.popover.createPopover(icon, this.popover.createProjectPopoverContent(project), project.name);
                    this.popover.show();  // Show the popover
                    break; // exit the loop as there's only one project
                }
            }
        }
        // Otherwise, create the popover content for the project list of this city
        else {
            let popoverContent = "";
            for (let [projectKey, project] of Object.entries(cityProjects)) {
                if (projectKey === 'position') continue; // Skip the 'position' property
                popoverContent += `
            <div id="${cityName}.${projectKey}" class="d-flex align-items-center project-name" data-index="${projectKey}">
                <img class="project-logo" src="${project.logo}" alt="${project.name} Logo" width="70" height="70">
                <h5 class="mb-0 ml-3">${project.name}</h5>
            </div>
        `;
            }

            this.popover.createPopover(icon, popoverContent, cityName);
            this.popover.show();  // Show the popover

        }
    }

    /*This method is called when the document body is clicked. It extracts the id of the clicked element and splits it into city and project names.
    If the city and project name exist in the cities object, it creates and shows a popover with the project information.
     */
    handleBodyClick(event) {
        const target = event.target.id ? event.target.id : event.target.parentNode.id;

        // If target id is empty, return early
        if (!target) {
            return;
        }

        const [city, ...projectNameParts] = target.split("."); // Split the target into city and project using the dot as a separator
        const projectName = projectNameParts.join('.'); // Join the remaining parts to get the full project name

        console.log('Click is registered in ' + target);

        // Check if city and projectName are defined and exist in the cities object
        if (city && projectName && this.cities[city] && this.cities[city][projectName]) {
            console.log(`Project exists it is ${projectName}`);
            let icon = document.getElementById(`popover-icon-${city}`);  // Get the icon directly using document.getElementById
            this.popover.createPopover(icon, this.popover.createProjectPopoverContent(this.cities[city][projectName]), this.cities[city][projectName].name);
            setTimeout(() => this.popover.show(), 100);
        }
    }

    /*This method is called when the map overlay is clicked.
    If the click was not inside an SVG element or the current popover, it hides the popover.
     */
    handleOverlayClick(event) {
        const popoverNode = document.querySelector('.popover');
        let isClickInsideIcon = Array.from(this.map.container.querySelectorAll('svg')).some(el => el.contains(event.target));

        if (!isClickInsideIcon && (!popoverNode || !popoverNode.contains(event.target))) {
            this.popover.hide();
        }
    }

    /*This method sets up event listeners for mouseover and mouseout events on the SVG elements in the map container.
    When a mouseover event occurs, the 'hovered' class is added to the SVG element, and when a mouseout event occurs, the 'hovered' class is removed.
     */
    registerHoverEvents() {
        this.map.container.querySelectorAll('svg').forEach((popoverTriggerEl) => {
            popoverTriggerEl.addEventListener('mouseover', () => {
                popoverTriggerEl.classList.add('hovered');
            });

            popoverTriggerEl.addEventListener('mouseout', () => {
                popoverTriggerEl.classList.remove('hovered');
            });
        });
    }
}

// Initialize function
async function initialize() {
    console.log("Script Started")

    try {
        // Fetch data from the server
        const cities = await fetchData();
        console.log(cities);

        // Create the map
        const map = new Map('map-container', 'map-overlay');

        // Create the popover
        const popover = new Popover();

        // Position pins initially
        map.positionPins(cities);

        // Create the popover manager
        const popoverManager = new PopoverManager(cities, map, popover);

        // Register click events
        popoverManager.registerClickEvents();

        // Register hover events
        popoverManager.registerHoverEvents();


    } catch (error) {
        console.error("Error fetching data:", error);
        alert("There was an error fetching the city data. Please try again later.");
    }
}


// Wait for the DOM to load before initializing the script. This ensures that all DOM elements are available before the script tries to interact with them.
document.addEventListener("DOMContentLoaded", async function() {
    await initialize();
});