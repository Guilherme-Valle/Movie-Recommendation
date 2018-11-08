/**
 * Array of Categories of Movies
 * @type {string[]}
 */
var categories = ['Ação', 'Ficção', 'Drama', 'Comédia', 'Terror', 'Musical', 'Documentário', 'Épico', 'Aventura', 'Suspense',
    'Faroeste', 'Romance', 'Policial', 'Guerra', 'Clássico', 'Animação', 'Infantil'];

var select = document.getElementById("categorie");
console.log(select);
for (var i = 0; i < categories.length; i++){
    var element = document.createElement("element");
    element.textContent = String(categories[i]);
    element.value = String(categories[i]);
    select.appendChild(element);
}

console.log(categories);