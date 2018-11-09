/**
 * Array of Categories of Movies
 * @type {string[]}
 */
var categories = ['Ação', 'Ficção', 'Drama', 'Comédia', 'Terror', 'Musical', 'Documentário', 'Épico', 'Aventura', 'Suspense',
    'Faroeste', 'Romance', 'Policial', 'Guerra', 'Clássico', 'Animação', 'Infantil'];

$.each(categories, function (i, item) {
    $('.categorie').append($('<option>', {
        value: item,
        text : item
    }));
});
