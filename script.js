const buscarPokemonBtn = document.getElementById('boton-busqueda');
const inputPokemon = document.getElementById('input-pokemons');
const formularioPokemon = document.getElementById('buscar-pokemons');
const infoPokemon = document.getElementById('info-principal');
const contenedorDePokemons = document.getElementById('contenedor-de-pokemons');
const agregarPokemonsBtn = document.getElementById('poner-mas-pokemons');
const mostrarPokemonsAnteriores = document.getElementById('menos-pokemons');
const volverAlInicioBtn = document.getElementById('inicio');
const tiposPokemons = document.getElementById('tiposPokemons');
let rangoMayor = 9;
let rangoMenor = 1;
let pokemonsMostrados = 0; // Contador de Pokémon mostrados
let lastIndex = 0; // Último índice consultado

// Recuperar los valores de localStorage al cargar la página
const savedRangoMenor = localStorage.getItem('rangoMenor');
const savedRangoMayor = localStorage.getItem('rangoMayor');
const savedLastIndex = localStorage.getItem('lastIndex');
const savedTipoSeleccionado = localStorage.getItem('tipoSeleccionado');
const savedPokemonsHTML = localStorage.getItem('pokemonsHTML');


//%%%%%%%%%%%%%%%%%%%%%%%%%%%% obtener lista de pokemons %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

tiposPokemons.addEventListener('change', () => {
    resetPagination();
    localStorage.setItem('tipoSeleccionado', tiposPokemons.value);
    mostrarPokemons();
});

const resetPagination = () => {
    rangoMenor = 1;
    rangoMayor = 9;
    pokemonsMostrados = 0; // Resetear el contador de Pokémon mostrados
    lastIndex = 0; // Resetear el último índice consultado
    guardarRangos();
}

const mostrarPokemons = async () => {
    try {
        const valorTipo = tiposPokemons.value;
        contenedorDePokemons.innerHTML = "";
        pokemonsMostrados = 0;
        let i =  lastIndex + 1;

        while (pokemonsMostrados < 9) {
            const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
            const respuesta = await fetch(url);
            const dato = await respuesta.json();
            
            if (valorTipo === 'todos') {
                mostrarPokemon(dato);
                pokemonsMostrados++;
            } else {
                const tipos = dato.types.map(tipo => tipo.type.name);
                if (tipos.includes(valorTipo)) {
                    mostrarPokemon(dato);
                    pokemonsMostrados++;
                }
            }
            i++;
        }
        lastIndex = i - 1; // Actualizar el último índice consultado
        guardarRangos();
        guardarPokemonsHTML();
    } catch (err) {
        console.log(err);
    }
}

const mostrarPokemon = (dato) => {
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
}

const devolverElementoConTipo = (tipos) => tipos.map(tipo => `<span class="tipo ${tipo.type.name}">${tipo.type.name.toUpperCase()}</span>`).join('')

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Funciones de los botones %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

agregarPokemonsBtn.addEventListener('click', () => {
    animarYModificarContenedorDePokemons(agregarNuevosPokemonsAlContenedor);
});

mostrarPokemonsAnteriores.addEventListener('click', () => {
    animarYModificarContenedorDePokemons(agregarPokemonsAnterioresAlContenedor);
});

//tiene que invocarse minimo una vez para que la pagina me muestre todos los pokemons
if (!savedPokemonsHTML) {
    mostrarPokemons(); // Cargar desde el inicio si no hay datos guardados
}

const animarYModificarContenedorDePokemons = (unaFuncion) => {
    animacionScroll();
    modificarContenedorDePokemons(unaFuncion);
    mostrarBotonInicio();
}

const animacionScroll = () => {
    window.scrollTo({
        behavior: "smooth",
        top: 0
    })
}

const modificarContenedorDePokemons = (unaFuncion) => {
    setTimeout(unaFuncion, 200);
}

const agregarNuevosPokemonsAlContenedor = () => {
    rangoMayor += 9;
    guardarRangosYMostrarPokemons();
}

const agregarPokemonsAnterioresAlContenedor = () => {
    if (rangoMenor > 1) {
        rangoMayor = rangoMenor - 1;
        rangoMenor = Math.max(rangoMenor - 9, 1);
    }
    guardarRangosYMostrarPokemons();
}

const guardarRangosYMostrarPokemons = () => {
    guardarRangos();
    mostrarPokemons();
}

const guardarRangos = () => {
    localStorage.setItem('rangoMenor', rangoMenor);
    localStorage.setItem('rangoMayor', rangoMayor);
    localStorage.setItem('lastIndex', lastIndex);
}

const guardarPokemonsHTML = () => {
    localStorage.setItem('pokemonsHTML', contenedorDePokemons.innerHTML);
}

const mostrarBotonInicio = () => {
    if (rangoMayor >= 9) {
        volverAlInicioBtn.classList.remove('hidden');
    }
}

volverAlInicioBtn.addEventListener('click', () => {
    volverAlInicioBtn.classList.add('hidden');
    resetPagination();
    mostrarPokemons();
});

//%%%%%%%%%%%%%%%%%%%%%%%%%%%% Recuperar datos del local storage %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
const recuperarEstadoGuardado = () => {
    const rangoMenorGuardado = localStorage.getItem('rangoMenor');
    const rangoMayorGuardado = localStorage.getItem('rangoMayor');
    const lastIndexGuardado = localStorage.getItem('lastIndex');
    const tipoSeleccionadoGuardado = localStorage.getItem('tipoSeleccionado');
    const pokemonsHTMLGuardado = localStorage.getItem('pokemonsHTML');

    if (rangoMenorGuardado !== null && rangoMayorGuardado !== null && lastIndexGuardado !== null) {
        rangoMenor = parseInt(rangoMenorGuardado, 10);
        rangoMayor = parseInt(rangoMayorGuardado, 10);
        lastIndex = parseInt(lastIndexGuardado, 10);
    }

    if (tipoSeleccionadoGuardado !== null) {
        tiposPokemons.value = tipoSeleccionadoGuardado;
    }

    if (rangoMayor > 9) {
        volverAlInicioBtn.classList.remove('hidden');
    }

    if (pokemonsHTMLGuardado !== null) {
        contenedorDePokemons.innerHTML = pokemonsHTMLGuardado;
    }
};

document.addEventListener('DOMContentLoaded', recuperarEstadoGuardado);
//%%%%%%%%%%%%%%%%%%%%%%%%%%%% Recuperar datos del local storage %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
