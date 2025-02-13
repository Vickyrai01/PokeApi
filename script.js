const buscarPokemonBtn = document.getElementById('boton-busqueda');
const inputPokemon = document.getElementById('input-pokemons');
const formularioPokemon = document.getElementById('buscar-pokemons');
const infoPokemon = document.getElementById('info-principal');
const contenedorDePokemons = document.getElementById('contenedor-de-pokemons');
const agregarPokemonsBtn = document.getElementById('poner-mas-pokemons');
const mostrarPokemonsAnteriores = document.getElementById('menos-pokemons');
let rangoMayor = 9;
let rangoMenor = 1;

// Recuperar los valores de localStorage al cargar la página
const savedRangoMenor = localStorage.getItem('rangoMenor');
const savedRangoMayor = localStorage.getItem('rangoMayor');
if (savedRangoMenor !== null && savedRangoMayor !== null) {
    rangoMenor = parseInt(savedRangoMenor, 10);
    rangoMayor = parseInt(savedRangoMayor, 10);
}

const obtenerPokemon = async () => {
    try {
        const nombrePokemonOId = inputPokemon.value;
        const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombrePokemonOId}`);
        const dato = await respuesta.json();
        mostrarPokemon(dato);
    } catch (err) {
        alert("Ese pokemon no existe");
        console.log(err);
    }
}

const mostrarPokemon = (dato) => {
    const nombrePokemon = dato.name.toUpperCase();
    const idPokemon = dato.id;
    const imagenPokemon = dato.sprites.front_default;
    const tipos = dato.types;

    infoPokemon.innerHTML = `
        <p>#${idPokemon} ${nombrePokemon}</p>
        <img src="${imagenPokemon}" alt="${nombrePokemon}">
        <div id="contenedor-de-tipos">${devolverElementoConTipo(tipos)}</div>
    `;
}


const mostrarNuevePokemons = async () => {
    try {
        let contador = rangoMenor;
        while (contador <= rangoMayor) {
            const url = `https://pokeapi.co/api/v2/pokemon/${contador}`;
            const respuesta = await fetch(url);
            const dato = await respuesta.json();
            contenedorDePokemons.innerHTML += `
            <div class="pokemon">
            <img class="img-pokemon" src="${dato.sprites.other['official-artwork'].front_default}" alt="${dato.name}">
            <div class="info-principal-pokemon">
            <p class="id-pokemon">#${dato.id}</p>
            <p class="nombre-pokemon">${dato.name.toUpperCase()}</p>
            </div>
            <div class="tipos-pokemon">
            ${devolverElementoConTipo(dato.types)}
            </div>
            <div class="medidas-pokemon">
            <p class="peso">${dato.weight / 10}kg</p>
            <p class="altura">${dato.height / 10}m</p>
            </div>             
            </div>
            `;
            contador++;
        }
    } catch (err) {
        console.log(err);
    }
}
const devolverElementoConTipo = (tipos) => tipos.map(tipo => `<span class="tipo ${tipo.type.name}">${tipo.type.name.toUpperCase()}</span>`).join('')

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Funciones de los botones %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        
agregarPokemonsBtn.addEventListener('click', () => {
    animarYModificarContenedorDePokemons(agregarNuevosPokemosnAlContenedor);
});

mostrarPokemonsAnteriores.addEventListener('click', () => {
    animarYModificarContenedorDePokemons(agregarPokemosnAnterioresAlContenedor);
});

//tiene que invocarse minimo una vez para que la pagina me muestre todos los pokemons
mostrarNuevePokemons();

const animarYModificarContenedorDePokemons = (unaFuncion) =>{
    animacionScroll();
    modificarContenedorDePokemons(unaFuncion);
}

const animacionScroll = () =>{
    window.scrollTo({
        behavior: "smooth",
        top: 0
})
}

const modificarContenedorDePokemons = (unaFuncion) =>{
    setTimeout(unaFuncion, 200);
}

const agregarNuevosPokemosnAlContenedor = () =>{
    contenedorDePokemons.innerHTML= "";
    rangoMenor = rangoMayor + 1;
    rangoMayor += 9;
    // Guardar los valores en localStorage
    guardarRangos(rangoMenor, rangoMayor);
    mostrarNuevePokemons();
}
const agregarPokemosnAnterioresAlContenedor = () =>{
    contenedorDePokemons.innerHTML = "";
    if (rangoMenor > 1) {
        rangoMayor = rangoMenor - 1;
        rangoMenor = Math.max(rangoMenor - 9, 1); 
    }
    guardarRangos(rangoMenor, rangoMayor);
    mostrarNuevePokemons();
}

const guardarRangos = (rangoMenor, rangoMayor) =>{
    localStorage.setItem('rangoMenor', rangoMenor);
    localStorage.setItem('rangoMayor', rangoMayor);
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Funciones de los botones %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

formularioPokemon.addEventListener('submit', e => {
    e.preventDefault();
    obtenerPokemon();
    inputPokemon.value = "";
});


