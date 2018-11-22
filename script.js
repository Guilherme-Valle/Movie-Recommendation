vm = this;
vm.countRestart = 0;

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
    makeRecommendation(false);
});

function makeRecommendation(isRepeated) {
    var xmlhttp;
    /**
     * Retorna valores dos inputs
     * @type {jQuery}
     */
    /**
     * Caso a variável isRepeated seja true, significa que irá ser buscado outro filme, com os mesmos filtros, por isso, não busca
     * valor dos inputs.
     */
    if (!isRepeated) {
        vm.actors = $('#actors').val();
        vm.informations = $('#informations').val();
        vm.year = $('#year').val();
        vm.categorie = $('#select').val();
        vm.actors = vm.actors ? vm.actors.split(',') : null;
    }
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
            /**
             * Cria um elemento HTML, que recebe o conteúdo do arquivo retornado na requisição Ajax;
             * @type {HTMLElement}
             */
            var dom = document.createElement('main_content');
            dom.innerHTML = xmlhttp.responseText;
            /** Lista que será preenchida com os filmes que atenderem a critérios do filtro */
            var moviesOnFilter = [];
            /** Itera o objeto DOM e realiza os filtros  */
            for (var i = 1; i < dom.children.length; i++){

                /** Trata as imagens, alterando o caminho dos arquivos source
                 * para a pasta do Github */
                var img = dom.children[i].getElementsByTagName('img');
                var imgFullSrc = img[0].src.split('Movie-Recommendation');
                var linkImg = imgFullSrc[1];
                var srcGithub = "https://leandrojsa.github.io";

                if (linkImg !== "/index.html") {
                    img[0].src = srcGithub.concat(linkImg);
                }
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
                if (vm.year){
                    filters++;
                    yearOfMovie = yearOfMovie.split(": ");
                    if (vm.year === yearOfMovie[1]){
                        flag++;
                    }
                }
                /** Verifica se uma das categorias do filme corresponde ao do filtro */
                if (vm.categorie){
                    filters++;
                    var hasCategorie = false;
                    for (var z = 0; z < categoriesOfMovie.length; z++){
                        if (categoriesOfMovie[z].innerText === vm.categorie){
                            hasCategorie = true;
                        }
                    }
                    if (hasCategorie){
                        flag++;
                    }
                }
                /** Verifica se um dos atores do filtro corresponde a algum dos atores do filme */
                if (vm.actors){
                    filters++;
                    var hasActor = false;
                    for (var k = 0; k < actors.length; k++){
                        for (x = 0; x < actorsOfMovie.length; x++){
                            if (actorsOfMovie[x].innerText === vm.actors[k]){
                                hasActor = true;
                            }
                        }
                        if (hasActor){
                            flag++;
                        }
                    }
                }

                /**
                 * Verifica o campo Outras informações para ver se alguma das palavras corresponde à descrição do filme.
                 */
                if (vm.informations){
                    filters++;
                    /** Transforma a String numa variável RegExp, para usar como uma expressão regular */
                    var rgxp = new RegExp(vm.informations, "g");
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

            /*
            Caso tenham filmes dentro dos critérios, mistura Array e exibe, aleatóriamente, o filme na primeira posição
             */
            if (moviesOnFilter.length > 0) {
                moviesOnFilter = shuffle(moviesOnFilter);
                showMovieRecommendation(moviesOnFilter[0]);
            }

        }

    };

    /**
     * Requisição Ajax
     */
    xmlhttp.open("GET", "https://leandrojsa.github.io/movies.html", true);
    xmlhttp.send();
}

/**
 * Exibe a recomendação do filme na tela
 * @param div
 */
function showMovieRecommendation(div) {
    console.log();
    var main_content = document.getElementById("main_content");
    /** Salva conteúdo anterior da div, para possibilitar voltar ao estado inicial. */
    if (vm.countRestart === 0) {
        vm.previous_content = main_content.innerHTML;
    }
    vm.countRestart++;
    main_content.innerHTML = div.innerHTML;

    /**  Exibe botões para voltar à tela anterior */
    var options = document.getElementsByTagName("h4");
    options[0].style.display = "block";
    options[1].style.display = "block";
    var button = document.getElementById('recomendation');

    /**
     * Formata a string que será enviada na requisição à API do Youtube, como NomeDoFilme trailer
     * @type {string}
     */
    var nomeDoFilme = div.children[1].innerText;
    nomeDoFilme += ' trailer';

    /**
     * Requisição para a API do Youtube.
     */
    getRequest(nomeDoFilme);

    /** Oculta o botão */
    button.style.display = "none";
    vm.countRestart++;
}

/**
 * Chama outra recomendação, sem mudar os parâmetros dos filtros.
 *
 */
$("#show_another_movie").click(function () {
    makeRecommendation(true);
})

/**
 * Retorna para a tela inicial
 */
$("#new_search").click(function () {
    /**
     * Reseta variável que verifica se é uma pesquisa nova
     * @type {number}
     */
    vm.countRestart = 0;

    /**
     * Oculta o vídeo
     * @type {string}
     */
    document.getElementById('video').style.display = "none";

    /**
     * Mostra novamente o botão de submit.
     * @type {HTMLElement}
     */
    var button = document.getElementById('recomendation');
    button.style.display = "block";
    button.style.marginLeft = "45%";

    /**
     * Recupera e exibe novamente o formulário com os filtros
     * @type {HTMLElement}
     */
    var main_content = document.getElementById("main_content");
    main_content.innerHTML = vm.previous_content;
    var options = document.getElementsByTagName("h4");
    options[0].style.display = "none";
    options[1].style.display = "none";

})


/** Classical algorithm to shuffle array */
function shuffle(array){
    var m = array.length, t, i;
    // While there remain elements to shuffle…
    while (m) {

        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);

        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }

    return array;
}

/**
 * Request para a API do youtube
 * @param searchTerm
 */
function getRequest(searchTerm) {
    var url = 'https://www.googleapis.com/youtube/v3/search';
    var search = searchTerm;
    var params = {
        part: 'snippet',
        key: 'AIzaSyC_DoDVVipZ2yQCnkZw6kuIu5t9kNwPlf8',
        q: search
    };
    $.getJSON(url, params, showResults);
}

/**
 * Formata retorno da requisição GET, formatando o src do vídeo e o exibindo.
 * @param results
 */
function showResults(results) {
    var entries = results.items[0].id.videoId;
    vm.src = "https://www.youtube.com/embed/" + entries.toString();
    document.getElementById('video').src = vm.src;
    document.getElementById('video').style.display = "block";

}

