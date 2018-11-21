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
        text: item
    }));
});

/**
 * Listener para o botão de recomendação do filme.
 * Faz uma requisição Ajax.
 */
$("#recomendation").click(function () {
    var xmlhttp;

    /**
     * Retorna valores dos inputs
     * @type {jQuery}
     */
    var actors = $('#actors').val();
    var informations = $('#informations').val();
    var year = $('#year').val();
    var categorie = $('#select').val();
    actors = actors ? actors.split(',') : null;

    if (window.XMLHttpRequest){
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject();
    }

    /**
     * Requisição Ajax para o arquivo HTML com as informações dos filmes.
     */
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
            var dom = document.createElement('main_content');
            dom.innerHTML = xmlhttp.responseText;
            /** Lista que será preenchida com os filmes que atenderem a critérios do filtro */
            var moviesOnFilter = [];
            /** Itera o objeto DOM e realiza os filtros  */
            for (var i = 1; i < dom.children.length; i++){
                /** Variável para verificar se o filme atende aos filtros */
                var flag = 0;
                /** Quantidade de filtros preenchidos */
                var filters = 0;
                /** Busca as informações sobre o filme  */
                var sinopsisOfMovie = dom.children[i].getElementsByClassName('sinopsis')[0].innerText;
                var categoriesOfMovie = dom.children[i].getElementsByClassName('categories')[0].children;
                var yearOfMovie = dom.children[i].children[2].innerText;
                var actorsOfMovie = dom.children[i].getElementsByClassName('actors')[0].children;

                /** Verifica se o ano do filme corresponde ao do filtro */
                if (year){
                    filters++;
                    yearOfMovie = yearOfMovie.split(": ");
                    if (year === yearOfMovie[1]){
                        flag++;
                    }
                }
                /** Verifica se uma das categorias do filme corresponde ao do filtro */
                if (categorie){
                    filters++;
                    for (var z = 0; z < categoriesOfMovie.length; z++){
                        if (categoriesOfMovie[z].innerText === categorie){
                            flag++;
                        }
                    }
                }
                /** Verifica se um dos atores do filtro corresponde a algum dos atores do filme */
                if (actors){
                    filters++;
                    for (var k = 0; k < actors.length; k++){
                        for (x = 0; x < actorsOfMovie.length; x++){
                            if (actorsOfMovie[x].innerText === actors[k]){
                                flag++;
                            }
                        }
                    }
                }
                if (informations){
                    filters++;
                    /** Transforma a String numa variável RegExp, para usar como uma expressão regular */
                    var rgxp = new RegExp(informations, "g");
                    /** Simulação do LIKE no SQL */
                    if (sinopsisOfMovie.match(rgxp)){
                        flag++;
                    }
                }

                /**
                 * Verifica se todos os filtros preenchidos correspondem aos critérios do filme.
                 */
                if (flag === filters){
                    moviesOnFilter.push(dom.children[i]);
                }
            }

            console.log(moviesOnFilter);

        }
        
    }
    xmlhttp.open("GET", "https://leandrojsa.github.io/movies.html", true);
    xmlhttp.send();
})