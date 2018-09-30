/* eslint-env jquery */

(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        function responseError(err, part) {
            console.log(`${part} ${err}`);
        }

        $.ajax({
            url: `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`,
            headers: {
                'Authorization': 'Client-ID 687a3c4da148fd0d3517ff6a94da86d8bdc4428158e92cd1f6cfcc8c800a5891'
            }
        }).done(addImage).fail(function (err) {
            responseError(err, 'image');
        });

        $.ajax({
            url: `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=17cb8894b3ce44c3814c40327bb3d48c`
        }).done(addArticles).fail(function (err) {
            responseError(err, 'articles');
        });

        function addImage(images) {
            const firstImage = images.results[0];

            responseContainer.insertAdjacentHTML('afterbegin', `<figure>
            <img src="${firstImage.urls.small}" alt="${searchedForText}">
            <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
        </figure>`
            );
        }

        function addArticles(articles) {
            let htmlContent = '';

            // console.log(articles)
            htmlContent = '<ul>' + articles.response.docs
                .map(article => `<li class="article">
                        <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
                        <p>${article.snippet}</p>
                    </li>`)
                .join('') + '</ul>';

            responseContainer.insertAdjacentHTML('beforeend', htmlContent);
        }
    });
})();
