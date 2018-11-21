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
Using youtube apikey to get trailers of the movies
*/
/*
$(function(){
	$("form").on("submit", fuction(e) {
		e.preventDefault(); //Request is ready
		var request = gapi.client.youtube.search.list({
			part: "snippet",
			type: "video",
			q: encodeURIComponent($("#search").val()).replace(/%20/g, "+"),
			maxResults: 1,
			order: "viewCount"
		});
		//request is executed
		request.execute(fuction(response)){
			var results =
			});
		});
	});
});

function iniatilizeapi(){
		gapi.client.setApiKey("AIzaSyA6J3Ru2hawX5rArvcX_Re7NwB8Bl8KLIY");
		gapi.client.load("youtube", "v3", function(){
			//Api=Ok
		}
}
/*
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
            var dom = document.createElement('main_content');
            dom.innerHTML = xmlhttp.responseText;
            /** Lista que será preenchida com os filmes que atenderem a critérios do filtro */
            var moviesOnFilter = [];
            /** Itera o objeto DOM e realiza os filtros  */
            for (var i = 1; i < dom.children.length; i++){
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
                    for (var z = 0; z < categoriesOfMovie.length; z++){
                        if (categoriesOfMovie[z].innerText === vm.categorie){
                            flag++;
                        }
                    }
                }
                /** Verifica se um dos atores do filtro corresponde a algum dos atores do filme */
                if (vm.actors){
                    filters++;
                    for (var k = 0; k < actors.length; k++){
                        for (x = 0; x < actorsOfMovie.length; x++){
                            if (actorsOfMovie[x].innerText === vm.actors[k]){
                                flag++;
                            }
                        }
                    }
                }
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

            if (moviesOnFilter.length > 0) {
                moviesOnFilter = shuffle(moviesOnFilter);
                showMovieRecommendation(moviesOnFilter[0]);
            }

        }

    }
    xmlhttp.open("GET", "https://leandrojsa.github.io/movies.html", true);
    xmlhttp.send();
}

/**
 * Exibe a recomendação do filme na tela
 * @param div
 */
function showMovieRecommendation(div) {
    var main_content = document.getElementById("main_content");
    /** Salva conteúdo anterior da div */
    if (vm.countRestart === 0) {
        vm.previous_content = main_content.innerHTML;
    }
    vm.countRestart++;
    main_content.innerHTML = div.innerHTML;
    var options = document.getElementsByTagName("h4");
    options[0].style.display = "block";
    options[1].style.display = "block";
    var button = document.getElementById('recomendation');
    button.style.display = "none";
    vm.countRestart++;
}

$("#show_another_movie").click(function () {
    makeRecommendation(true);
})

$("#new_search").click(function () {
    vm.countRestart = 0;
    var button = document.getElementById('recomendation');
    button.style.display = "block";
    button.style.marginLeft = "45%";
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
