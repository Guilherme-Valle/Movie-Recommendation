/**
 * Array of Categories of Movies
 * @type {string[]}
 */
var categories = ['Ação', 'Ficção', 'Drama',
    'Comédia', 'Terror', 'Musical',
    'Documentário', 'Épico', 'Aventura', 'Suspense',
    'Faroeste', 'Romance', 'Policial',
    'Guerra', 'Clássico', 'Animação', 'Infantil'];

/**
Put the categories into the select-box.
*/
$.each(categories, function (i, item) {
    $('.categorie').append($('<option>', {
        value: item,
        text : item
    }));
});

/**
 * Listener para o botão de recomendação do filme.
 * Faz uma requisição Ajax.
 */
$("#recomendation").click(function () {
    var xmlhttp;
    if (window.XMLHttpRequest){
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject();
    }

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
            var dom = document.createElement('main_content');
            dom.innerHTML = xmlhttp.responseText;
            /** Itera o objeto DOM e realiza os filtros  */
            for (var i = 0; i < dom.children.length; i++){
                var sinopsis = dom.children[i].getElementsByClassName('sinopsis')[0].innerText;
                var categorie = dom.children[i].getElementsByClassName('categories')[0].innerText
            }

        }
        
    }
    xmlhttp.open("GET", "https://leandrojsa.github.io/movies.html", true);
    xmlhttp.send();
})