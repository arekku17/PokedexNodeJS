import { getColorType } from "./pokemon-type-colours.js";
console.log(getColorType("poison"));

//Variables para filtrar la navegacion
let limitPokemons = 10;
let offsetPokemons = 0;

const cardContainer = document.querySelector(".cards-container");
const botonMas = document.querySelector(".showMore");
const masContainer = document.querySelector(".showMore-button");
const modal = document.querySelector('.modal');
const btnSearch = document.querySelector(".btn-search");

const getPokemon = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

const obtenerSprite = (pokeData) => {
    let sprite = pokeData.sprites.other["dream_world"].front_default;
    if (sprite === null){
        sprite = pokeData.sprites.other["official-artwork"].front_default;
        if (sprite === null){
            sprite = pokeData.sprites.other["home"].front_default;
        }
    }
    return sprite;
}

const logicaBotones = (id) => {
    //Obtengo todos los botones info que hay
    const infoBtn = document.querySelector(`.info-button${id}`);
    let html = '';
    let doc;
    infoBtn.addEventListener('click', async () => {
        //Uso el dataset para obtener la informacion del boton del pokemon
        doc = await getPokemon(`https://pokeapi.co/api/v2/pokemon/${infoBtn.dataset.id}/`);
        //Lleno las habilidades aparte
        let htmlAbilities = "";
        doc.abilities.forEach(abilitie => {
            htmlAbilities += `
                <p>${abilitie.ability.name.toUpperCase()}</p>
                `;
        })
        //Hago el template html
        html = `
            <div class="info-modal">
                <img src="${obtenerSprite(doc)}" alt="${doc.name}">
                <h2>${(doc.name.charAt(0).toUpperCase() + doc.name.slice(1))}</h2>
                <p>Altura: ${(doc.height *  2.54)} cm</p>
                <p>Peso: ${Math.ceil(doc.weight / 2.205)} kg</p>
            </div>
            <div class="abilities">
                <div class="title-abilities">

                    <p>Habilidades</p>
                </div>
                <div class="list-abilities">
                    ${htmlAbilities}
                </div>
            </div>
            <button class="exit-button">
                X
            </button>
            `;
        modal.innerHTML = html;
        //Cambio a visible el modal
        modal.classList.toggle("visible");

        //BtnExit
        const btnExit = document.querySelector(".exit-button");
        btnExit.addEventListener('click', () => {
            modal.classList.toggle("visible");
        })
    })
}

const llenarCard = async (pokemon) => {
    console.log(pokemon);
    const pokeData = await getPokemon(pokemon.url.toLowerCase());
    let templateTypes = "";
    let html = '';
    pokeData.types.forEach(type => {
        let tipoPokemon = type.type.name;
        templateTypes += `<div class="type" style="background:${getColorType(tipoPokemon)}">
        <p>${tipoPokemon.toUpperCase()}</p>
        </div>`
    })
    console.log(pokeData)
    html = `
    <div class="card animate__animated animate__fadeInLeft" style="background:${getColorType(pokeData.types[0].type.name)}">
    <div class="img-card">
        <img src="${obtenerSprite(pokeData)}" alt="${pokeData.name})}">
    </div>
    <div class="info-card">
        <h2>${(pokeData.name.charAt(0).toUpperCase() + pokeData.name.slice(1))}</h2>
        
        <div class="types">
            <p>Type:</p>
            <div class="types-container">
                ${templateTypes}
            </div> 
        </div>
    </div>
    <div class="button-modal">
        <button class="info-button info-button${pokeData.id}" data-id="${pokeData.id}">
            i
        </button>
    </div>  
</div>
    `
    cardContainer.insertAdjacentHTML('beforeend', html);
    logicaBotones(pokeData.id);
}

const pintarCards = async () => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limitPokemons}&offset=${offsetPokemons}`);
    const data = await response.json();
    // let html = cardContainer.innerHTML;
    data.results.forEach(pokemon => llenarCard(pokemon));
}

botonMas.addEventListener('click', () => {
    offsetPokemons = offsetPokemons + 10;
    pintarCards();
})


//Boton buscar
btnSearch.addEventListener('click', async () => {
    const search = document.querySelector(".input-search").value;
    let pokemon = {
        url: "https://pokeapi.co/api/v2/pokemon/" + search
    };
    cardContainer.innerHTML = "";
    //Si no hay nada muestro todo
    if (search === "") {
        if (masContainer.classList.contains("hidden")) {
            masContainer.classList.remove("hidden");
        }
        offsetPokemons = 0;
        //Borro lo que hay

        pintarCards();
    }
    else {
        if (!(getColorType(search) === "#777")) {
            pokemon.url = "https://pokeapi.co/api/v2/type/" + search;
            let data = await getPokemon(pokemon.url);
            let pokemons = data.pokemon;
            pokemons.forEach(poke => 
                llenarCard(poke.pokemon)
            )
            if (masContainer.classList.contains("hidden")) masContainer.classList.remove("hidden");
        }
        else {
            llenarCard(pokemon);
            if (!masContainer.classList.contains("hidden")) {
                masContainer.classList.add("hidden");
            }
        }

    }
})

pintarCards();