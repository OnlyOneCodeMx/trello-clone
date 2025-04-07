/**
 * Fetcher Function
 *
 * This function makes a network request to the specified URL and returns the
 * response as JSON.
 *
 * @param {string} url - The URL of the resource to fetch
 * @returns {Promise<any>} A promise that resolves with the parsed JSON response
 */
export const fetcher = (url: string) => fetch(url).then((res) => res.json());
