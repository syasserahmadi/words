async function randomQuoteController() {
    return fetch("http://127.0.0.1:8000/randomquote", {
        method: "GET",
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .catch(error => console.error("Error:", error));
}



async function nextQuoteController(quoteId) {
    return fetch(`http://127.0.0.1:8000/nextquote/${quoteId}`, {
        method: "GET",
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .catch(error => console.error("Error:", error));
}

async function prevQuoteController(quoteId) {
    return fetch(`http://127.0.0.1:8000/prevquote/${quoteId}`, {
        method: "GET",
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .catch(error => console.error("Error:", error));
}


async function bookmarkToggleController(userId, quoteId) {
    const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
    return fetch("http://127.0.0.1:8000/bookmarktoggle", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({
            userId: userId,
            quoteId: quoteId,
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    });
}



async function bookmarksController(userId, requestedPage) {
    const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
    return fetch("http://127.0.0.1:8000/bookmarks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({
            userId: userId,
            requestedPage: requestedPage

        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    });
}



async function searchController(searchType, searchValue, requestedPage) {
    const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
    return fetch("http://127.0.0.1:8000/search", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({
            searchType: searchType,
            searchValue: searchValue,
            requestedPage: requestedPage
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .catch(error => console.error("Error:", error));
}


export {
    randomQuoteController,
    nextQuoteController,
    prevQuoteController,
    bookmarkToggleController,
    bookmarksController,
    searchController,
};