(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        fetch(`https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`, {
            headers: {
                Authorization: 'Client-ID 687a3c4da148fd0d3517ff6a94da86d8bdc4428158e92cd1f6cfcc8c800a5891'
            }
        }).then(response => response.json())
        .then(addImage)
        .catch(err => requestError(e, 'image'));

        fetch(`http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=17cb8894b3ce44c3814c40327bb3d48c`)
            .then(response => response.json())
            .then(addArticles)
            .catch(err => requestError(e, 'articles'));

        function addImage(data) {
            let htmlContent = '';
            const firstImage = data.results[0];

            if (firstImage) {
                htmlContent = `<figure>
            <img src="${firstImage.urls.small}" alt="${searchedForText}">
            <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
        </figure>`;
            } else {
                htmlContent = 'Unfortunately, no image was returned for your search.';
            }

            responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
        }

        function addArticles(articles) {
            let htmlContent = '';

            if (articles) {
                htmlContent = '<ul>' + articles.response.docs
                    .map(article => `<li class="article">
                    <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
                    <p>${article.snippet}</p>
                </li>`)
                    .join('') + '</ul>';
            } else {
                htmlContent = 'Unfortunately, no article was returned for your search.';
            }
            responseContainer.insertAdjacentHTML('beforeend', htmlContent);
        }

        function requestError(e, part) {
            console.log(e);
            responseContainer.insertAdjacentHTML('beforeend', `<p class="network-warning">Oh no! There was an error making a request for the ${part}.</p>`);
        }
    });
})();
