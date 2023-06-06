//Separate functions. Built this way for improved readability and maintainability to have logic separated

// Function to retrieve the information from the cities JSON

export async function fetchData() {
    const response = await fetch('../cities.json');
    return await response.json();
}

//Debounce used to stop a code from being executed multiple times, while its condition is true.
export function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

