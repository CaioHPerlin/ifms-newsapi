if('serviceWorker' in navigator){
    window.addEventListener('load', async () => {
        try{
            let reg;
            reg = await navigator.serviceWorker.register('./sw.js', {type: 'module'});

            console.log('Service Worker registrada!', reg);
            postNews();
        } catch (err) {
            console.log('Registor da Service Worker falhou', err);
        }
    });
}

const apiKey = '5dcf7552d5ec4ea98d00e25748eaba12';
let url = `https://newsapi.org/v2/everything?q=AI&apiKey=${apiKey}`;
const main = document.querySelector('main');

document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.querySelector('#search-bar');
    document.querySelector('#search-btn').addEventListener('click', () => {
        url = `https://newsapi.org/v2/everything?q=${searchBar.value}&apiKey=${apiKey}`;
        postNews();
    })
})

async function postNews() {
    const res = await fetch(url);
    const data = await res.json();
    main.innerHTML = '';
    main.innerHTML = data.articles.map(createArticle).join('\n');
}

function createArticle(article) {
    if(!article.title || article.title == '[Removed]') return
    description = article.description? article.description : '';
    imageUrl = article.urlToImage? article.urlToImage : 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/2560px-Placeholder_view_vector.svg.png'
    return `
        <article>
            <a href="${article.url}">
                <img src="${imageUrl}" class="image" alt="${article.content}"/>
                <div class="text">
                    <h2>${article.title}</h2>
                    <p>${description}</p>
                </div>
            </a>
        </article>
    `
}