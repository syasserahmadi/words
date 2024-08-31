import {
    randomQuoteController,
    nextQuoteController,
    prevQuoteController,
    bookmarkToggleController,
    bookmarksController,
    searchController,
} from './controllers.js'; 


// Global variables
let quoteElement = document.getElementById('thequote');
let bookmarkIcon = document.getElementById('bookmarkicon');
let userId = document.getElementById('userid').value;



document.addEventListener('DOMContentLoaded', function() {
    // Randomquote button trigger
    let randomButton = document.getElementById('randombtn');
    randomButton.addEventListener('click', function() {
        randomQuoteView();
    });

    // Nextquote button trigger
    let nextButton = document.getElementById('nextbtn');
    nextButton.addEventListener('click', function() {
        nextQuoteView();
    });

    // Prevquote button trigger
    let prevButton = document.getElementById('prevbtn');
    prevButton.addEventListener('click', function() {
        prevQuoteView();
    });

    // Bookmark toggle trigger
    let bookmarkButton = document.getElementById('bookmarkbtn');
    if (bookmarkButton) {
        bookmarkButton.addEventListener('click', function() {
            bookmarkToggleView();
        });
    };

    // Bookmarks button trigger
    let bookmarksButton = document.getElementById('bookmarksbtn');
    if (bookmarkButton) {
        bookmarksButton.addEventListener('click', function() {
            bookmarksView(document.getElementById('userid').value);
        });
    };

    // Search button trigger
    let searchButton = document.getElementById('searchbtn');
    searchButton.addEventListener('click', function() {
        searchView();
    })
});


function clearView() {
    // Removing child elements of an element
    let Element = document.getElementById("index");
    while (Element.firstChild) {
    Element.removeChild(Element.firstChild);
    }
}


function randomQuoteView() {
    randomQuoteController().then(response => {
        // Changing the title
        document.getElementById("maintitle").innerHTML = `Quote No: ${response.quoteid}`;
        // Changing the quote
        quoteElement.innerHTML = response.quote;
        quoteElement.classList.add('text-gradient');
        quoteElement.classList.add('d-inline');
        quoteElement.classList.add('text-gradient');
        // Changing the author
        document.getElementById('theauthor').innerHTML = response.author;
        // Changing the category
        document.getElementById('thecategory').innerHTML = response.category;
        // Setting the id of the quote
        quoteElement.dataset.quoteid = response.quoteid;
        
        if (userId && bookmarkIcon) {
            // Set bookmark icon and status
            if (response.isBookmarked === true) {
                bookmarkIcon.src = bookmarkIcon.dataset.checkicon;
            } else {
                bookmarkIcon.src = bookmarkIcon.dataset.plusicon;
            }
        };
    });
}


function nextQuoteView() {
    nextQuoteController(quoteElement.dataset.quoteid).then(response => {
        // Changing the title
        document.getElementById("maintitle").innerHTML = `Quote No: ${response.quoteid}`;
        // Changing the quote
        quoteElement.innerHTML = response.quote;
        quoteElement.classList.add('text-gradient');
        quoteElement.classList.add('d-inline');
        quoteElement.classList.add('text-gradient');
        // Changing the author
        document.getElementById('theauthor').innerHTML = response.author;
        // Changing the category
        document.getElementById('thecategory').innerHTML = response.category;
        // Setting the id of the quote
        quoteElement.dataset.quoteid = response.quoteid;

        if (userId && bookmarkIcon) {
            if (response.isBookmarked === true) {
                bookmarkIcon.src = bookmarkIcon.dataset.checkicon;
            }
            else {
                bookmarkIcon.src = bookmarkIcon.dataset.plusicon;
            }
        };
    });
}


function prevQuoteView() {
    prevQuoteController(quoteElement.dataset.quoteid).then(response => {
        // Changing the title
        document.getElementById("maintitle").innerHTML = `Quote No: ${response.quoteid}`;
        // Changing the quote
        quoteElement.innerHTML = response.quote;
        quoteElement.classList.add('text-gradient');
        quoteElement.classList.add('d-inline');
        quoteElement.classList.add('text-gradient');
        // Changing the author
        document.getElementById('theauthor').innerHTML = response.author;
        // Changing the category
        document.getElementById('thecategory').innerHTML = response.category;
        // Setting the id of the quote
        quoteElement.dataset.quoteid = response.quoteid;

        if (userId && bookmarkIcon) {
            if (response.isBookmarked === true) {
                bookmarkIcon.src = bookmarkIcon.dataset.checkicon;
            }
            else {
                bookmarkIcon.src = bookmarkIcon.dataset.plusicon;
            }
        };
    });
}



function bookmarkToggleView () {
    let quoteId = quoteElement.dataset.quoteid;
    bookmarkToggleController(userId, quoteId).then(response => {
        if (response.isBookmarked === true) {
            bookmarkIcon.src = bookmarkIcon.dataset.checkicon;
        }
        else {
            bookmarkIcon.src = bookmarkIcon.dataset.plusicon;
        }
    })
}


function bookmarksView (userId, requestedPage) {
    document.getElementById("maintitle").innerText = "Bookmarks:"
    bookmarksController(userId, requestedPage).then(response => {
        clearView();
        let indexElement = document.getElementById("index");

        let bookmarksParentDiv = document.createElement("div");
        bookmarksParentDiv.className = "d-flex; flex-wrap: wrap;";
        bookmarksParentDiv.style = "width: 75vw;"
        indexElement.appendChild(bookmarksParentDiv);

        response.bookmarks.forEach(element => {
            // Creation of the parent element for each quote
            let textParentElement = document.createElement("div");
            textParentElement.className = "d-flex justify-content-center mb-2";
            bookmarksParentDiv.appendChild(textParentElement);

            // Creation of the quote
            let quoteTextElement = document.createElement("h2");
            quoteTextElement.className = "fs-3 fw-bold m-5 text-gradient";
            quoteTextElement.innerHTML = element.quote;
            textParentElement.appendChild(quoteTextElement);

            // Create a div to wrap the button and apply justify-content-center to it
            let buttonWrapper = document.createElement("div");
            buttonWrapper.className = "d-flex justify-content-center flex-column align-items-center w-100";
            quoteTextElement.appendChild(buttonWrapper);

            // Creation of the author
            let authorTextElement = document.createElement("p");
            authorTextElement.className = "fs-3 fw-light text-muted";
            authorTextElement.innerHTML = `- ${element.author}`;
            buttonWrapper.appendChild(authorTextElement);

            if (userId && bookmarkIcon) {
                // Creation of the bookmark button
                let bookmarkButtonElement = document.createElement("button");
                bookmarkButtonElement.className = "btn btn-outline-bookmark";
                bookmarkButtonElement.href = "#";
                buttonWrapper.appendChild(bookmarkButtonElement);

                // Creation of the bookmark button image
                let bookmarkButtonImgElement = document.createElement("img");
                bookmarkButtonImgElement.src = bookmarkIcon.dataset.checkicon;
                bookmarkButtonElement.appendChild(bookmarkButtonImgElement);


                // Adding an event listener to the bookmark button
                bookmarkButtonElement.addEventListener('click', function() {
                    let quoteId = element.quote_id;
                    bookmarkToggleController(userId, quoteId).then(response => {
                        if (response.isBookmarked === true) {
                            bookmarkButtonImgElement.src = bookmarkIcon.dataset.checkicon;
                        }
                        else {
                            bookmarkButtonImgElement.src = bookmarkIcon.dataset.plusicon;;
                        }
                    })
                });
            }
        });

        
        // Pagination
        if (response.page_number < response.total_pages) {
            const pageNavigation = document.createElement("nav");
            pageNavigation.setAttribute("aria-label", "Page navigation");
            pageNavigation.classList.add("mt-3");
            const ul = document.createElement("ul");
            ul.classList.add("pagination")
            ul.classList.add("justify-content-center");
            const li = document.createElement("li");
            li.className = "page-item";
            const a = document.createElement("a");
            a.className = "page-link";
            a.href = "#";
            a.innerText = "Next";
            a.addEventListener('click', () => {
                clearView();
                bookmarksView(userId, response.page_number + 1);
            });

            indexElement.appendChild(pageNavigation);
            pageNavigation.appendChild(ul);
            ul.appendChild(li);
            li.appendChild(a);
        }
        
        if (response.page_number > 1) {
            const pageNavigation = document.createElement("nav");
            pageNavigation.setAttribute("aria-label", "Page navigation");
            pageNavigation.classList.add("mt-3");
            const ul = document.createElement("ul");
            ul.classList.add("pagination");
            ul.classList.add("justify-content-center");
            const li = document.createElement("li");
            li.className = "page-item";
            const a = document.createElement("a");
            a.className = "page-link";
            a.href = "#";
            a.innerText = "Previous";
            a.addEventListener('click', () => {
                clearView();
                bookmarksView(userId, response.page_number - 1);
            });

            indexElement.appendChild(pageNavigation);
            pageNavigation.appendChild(ul);
            ul.appendChild(li);
            li.appendChild(a);
        }
    })
}



function searchView () {
    document.getElementById("maintitle").innerText = "Search:";
    clearView();
    let indexElement = document.getElementById("index");

    // Add search form with options to search by quote or author
    let searchForm = document.createElement("form");
    searchForm.id = "searchform";
    searchForm.style = "width: 40vw;";
    searchForm.className = "flex-wrap";
    indexElement.appendChild(searchForm);

    let searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.name = "search";
    searchInput.placeholder = "Search For Quotes...";
    searchInput.className = "form-control mb-3";
    searchForm.appendChild(searchInput);

    // Creation of the search radio buttons
    let searchSelect = document.createElement("div");
    searchSelect.className = "d-flex form-check justify-content-center";
    searchForm.appendChild(searchSelect);

    let quoteOption = document.createElement("input");
    quoteOption.className = "form-check-input me-1";
    quoteOption.type = "radio";
    quoteOption.name = "searchType";
    quoteOption.value = "quote";
    quoteOption.id = "searchbyquote";
    quoteOption.checked = true;
    searchSelect.appendChild(quoteOption);

    let quoteLabel = document.createElement("label");
    quoteLabel.className = "form-check-label me-5";
    quoteLabel.htmlFor = "searchbyquote";
    quoteLabel.innerText = "Search by Quote";
    searchSelect.appendChild(quoteLabel);

    let authorOption = document.createElement("input");
    authorOption.className = "form-check-input me-1";
    authorOption.type = "radio";
    authorOption.name = "searchType";
    authorOption.value = "author";
    authorOption.id = "searchbyauthor";
    searchSelect.appendChild(authorOption);

    let authorLabel = document.createElement("label");
    authorLabel.className = "form-check-label";
    authorLabel.htmlFor = "searchbyauthor";
    authorLabel.innerText = "Search by Author";
    searchSelect.appendChild(authorLabel);

    // Creation of submit button
    let submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.className = "btn btn-primary mt-4";
    submitButton.innerText = "Search";
    searchForm.appendChild(submitButton);
    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        searchResultView(searchInput.value, searchForm.querySelector('input[name="searchType"]:checked').value);
    })
}



function searchResultView(searchType, searchValue, requestedPage) {
    clearView();
    let indexElement = document.getElementById("index");

    searchController(searchValue, searchType, requestedPage).then(response => {
        response.quotes.forEach(element => {
            // Creation of the parent element for each quote
            let textParentElement = document.createElement("div");
            textParentElement.className = "d-flex justify-content-center mb-2";
            indexElement.appendChild(textParentElement);

            // Creation of the quote
            let quoteTextElement = document.createElement("h2");
            quoteTextElement.className = "fs-3 fw-bold m-5 text-gradient";
            quoteTextElement.innerHTML = element.quote;
            textParentElement.appendChild(quoteTextElement);

            // Create a div to wrap the button and apply justify-content-center to it
            let buttonWrapper = document.createElement("div");
            buttonWrapper.className = "d-flex justify-content-center flex-column align-items-center w-100";
            quoteTextElement.appendChild(buttonWrapper);

            // Creation of the author
            let authorTextElement = document.createElement("p");
            authorTextElement.className = "fs-3 fw-light text-muted";
            authorTextElement.innerHTML = `- ${element.author}`;
            buttonWrapper.appendChild(authorTextElement);

            if (userId && bookmarkIcon) {
                // Creation of the bookmark button
                let bookmarkButtonElement = document.createElement("button");
                bookmarkButtonElement.className = "btn btn-outline-bookmark";
                bookmarkButtonElement.href = "#";
                buttonWrapper.appendChild(bookmarkButtonElement);

                // Creation of the bookmark button image
                let bookmarkButtonImgElement = document.createElement("img");
                bookmarkButtonImgElement.src = bookmarkIcon.dataset.plusicon;
                bookmarkButtonElement.appendChild(bookmarkButtonImgElement);

                // Adding an event listener to the bookmark button
                bookmarkButtonElement.addEventListener('click', function() {
                    let quoteId = element.quote_id;
                    bookmarkToggleController(userId, quoteId).then(response => {
                        if (response.isBookmarked === true) {
                            bookmarkButtonImgElement.src = bookmarkIcon.dataset.checkicon;
                        }
                        else {
                            bookmarkButtonImgElement.src = bookmarkIcon.dataset.plusicon;;
                        }
                    })
                });
            };
        });


        // Pagination
        if (response.page_number < response.total_pages) {
            const pageNavigation = document.createElement("nav");
            pageNavigation.setAttribute("aria-label", "Page navigation");
            pageNavigation.classList.add("mt-3");
            const ul = document.createElement("ul");
            ul.classList.add("pagination")
            ul.classList.add("justify-content-center");
            const li = document.createElement("li");
            li.className = "page-item";
            const a = document.createElement("a");
            a.className = "page-link";
            a.href = "#";
            a.innerText = "Next";
            a.addEventListener('click', () => {
                clearView();
                searchResultView(searchValue, searchType, response.page_number + 1);
            });

            indexElement.appendChild(pageNavigation);
            pageNavigation.appendChild(ul);
            ul.appendChild(li);
            li.appendChild(a);
        }
        
        if (response.page_number > 1) {
            const pageNavigation = document.createElement("nav");
            pageNavigation.setAttribute("aria-label", "Page navigation");
            pageNavigation.classList.add("mt-3");
            const ul = document.createElement("ul");
            ul.classList.add("pagination");
            ul.classList.add("justify-content-center");
            const li = document.createElement("li");
            li.className = "page-item";
            const a = document.createElement("a");
            a.className = "page-link";
            a.href = "#";
            a.innerText = "Previous";
            a.addEventListener('click', () => {
                clearView();
                searchResultView(searchValue, searchType, response.page_number - 1);
            });

            indexElement.appendChild(pageNavigation);
            pageNavigation.appendChild(ul);
            ul.appendChild(li);
            li.appendChild(a);
        }
    });
}
