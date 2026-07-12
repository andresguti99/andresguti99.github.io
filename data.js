//Separate functions. Built this way for improved readability and maintainability to have logic separated

// Function to retrieve the information from the cities JSON

// Several modules on the same page call fetchData(), so the network request is
// shared. Each caller gets its own clone because callers mutate the result
// (e.g. deleting the "position" property).
let dataPromise;

export async function fetchData() {
    dataPromise ??= fetch('../cities.json').then(response => response.json());
    return structuredClone(await dataPromise);
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
