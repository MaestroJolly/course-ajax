(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        // NewYork Times Articles API

        function addArticles() {
                let htmlContent = '';
                const data = JSON.parse(this.responseText);

                if (data.response && data.response.docs && data.response.docs.length > 1){
                    htmlContent = '<ul>' + data.response.docs.map(article => `<li class="article">
                        <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
                        <p>${article.snippet}</p>
                    </li>`).join('') + '</ul>';
                }else{
                    htmlContent = '<div class="error-no-articles">No articles are available</div>';
                }

                responseContainer.insertAdjacentHTML('beforeend', htmlContent);
        }
        const articleRequest = new XMLHttpRequest();
        articleRequest.onload = addArticles;
        articleRequest.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=17cb8894b3ce44c3814c40327bb3d48c`);
        articleRequest.send();


        // Unsplash API implementation

        // const searchedForText = 'hippos';
        const unsplashRequest = new XMLHttpRequest();

        unsplashRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
        unsplashRequest.onload = addImage;
        unsplashRequest.onerror = function (err) {
            console.log(`you are experiencing this error ${err}`);
        };
        unsplashRequest.setRequestHeader('Authorization', 'Client-ID 687a3c4da148fd0d3517ff6a94da86d8bdc4428158e92cd1f6cfcc8c800a5891');
        unsplashRequest.send();

        function addImage() {
            let htmlContent = '';
            const data = JSON.parse(this.responseText);

            if (data && data.results && data.results[0]){
                const firstImage = data.results[0];
                htmlContent = `<figure>
                    <img src="${firstImage.urls.regular}" alt="${searchedForText}">
                    <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
                </figure>`;
            }else{
                htmlContent = '<div class="error-no-image">No images are available</div>';
            }

            responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
        }
    });
})();


