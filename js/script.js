
// let contendorIngredientes = document.querySelector("#cajaingredientes")

// const ingredientes = ["azucar", "harina", "miel", "chocolate", "ron"]

// for (let i = 0; i < ingredientes.length; i++) {
//     let divIngrediente = document.createElement("div")
//     divIngrediente.innerHTML = ingredientes[i]
//     divIngrediente.classList.add("ingrediente")
//     contendorIngredientes.appendChild(divIngrediente)
// }
//#region declaracio de variables
const nombreCoctelHTML = document.querySelector(".nombreCoctel")
const listaIngredientes = document.querySelector(".lista-ingredientes")
const preparacion = document.querySelector(".preparacion")
const imgCoctel = document.querySelector(".imgCoctel")
const buscador = document.querySelector("#buscador")
const contedorResultados = document.querySelector(".contedor-resultados")

async function nombreCoctel(termino) {
    try {
        let response = await fetch(`https://thecocktaildb.com/api/json/v1/1/search.php?s=${termino}`)

        if (!response.ok) {
            throw new Error(`error HTTP: ${response.status}`);
        }
        return await response.json()
    } catch (error) {
        console.error("Error en nombreCoctel:", error);
        return null
    }
}

function generarNumeroAleatorio() {
    return Math.floor(Math.random() * 256);
}

async function primerCocktail() {
    try {
        let respuesta = await nombreCoctel(Math.floor(Math.random(0) * 10)); // Simplemente espera la respuesta
        if (respuesta && respuesta.drinks && respuesta.drinks.length > 0) {
            return respuesta.drinks;
        } else {
            console.log("No se encontraron cócteles.");
            respuesta = await nombreCoctel("mojito")
            return respuesta.drinks;
        }
    } catch (error) {
        console.error("Error en primerCocktail:", error);
    }
}

async function insertPrimerCocktail() {
    try {
        let drinkData = await primerCocktail()
        if (drinkData && drinkData !== null) {
            let nombreCoctel = drinkData[0]["strDrink"]
            console.log(nombreCoctel);
            nombreCoctelHTML.innerHTML = nombreCoctel
            let instrucciones = drinkData[0]["strInstructionsES"]
            instrucciones === null ? instrucciones = drinkData[0]["strInstructions"] : instrucciones
            console.log(instrucciones);
            // ingredientes
            let ingredientes = []
            let medidas = []
            for (let i = 1; i <= 15; i++) {
                if (drinkData[0][`strIngredient${i}`] !== null) ingredientes.push(drinkData[0][`strIngredient${i}`])
                if (drinkData[0][`strMeasure${i}`] !== null) medidas.push(drinkData[0][`strMeasure${i}`])
            }
            console.log(ingredientes);
            console.log(medidas);
            for (let i = 0; i < ingredientes.length; i++) {
                let elementoLista = document.createElement("li")
                elementoLista.textContent = `${ingredientes[i]}: ${medidas[i] !== undefined ? medidas[i] : "al gusto"}`
                listaIngredientes.appendChild(elementoLista)
            }
            preparacion.innerHTML = instrucciones
            let imagenDrink = drinkData[0]["strDrinkThumb"]
            console.log(imagenDrink);
            imgCoctel.src = imagenDrink
        }
    } catch (error) {
        console.error("Error en insertPrimerCocktail:", error);
    }
}

//NO SE PUEDE USAR, DEMASIADAS PETICIONES A LA API PAPI PERO BUENA IDEA IGUALMENTE

buscador.addEventListener('input', async (e) => {
    let busqueda = String(e.target.value).charAt(0).toUpperCase() + String(e.target.value).slice(1);
    console.log(busqueda);
    let resultado = await nombreCoctel(busqueda);
    contedorResultados.innerHTML = '';

    if (resultado && resultado.drinks && resultado.drinks.length > 0) {
        let filteredDrinks = resultado.drinks.filter(drink =>
            drink["strDrink"] && drink["strDrink"].includes(busqueda)
        );

        filteredDrinks.forEach(drink => {
            let contendorCoctel = document.createElement("div");
            contendorCoctel.classList.add("contenedorCoctel");
            contendorCoctel.innerHTML = drink["strDrink"];
            contedorResultados.appendChild(contendorCoctel);
        });
    }
});

document.addEventListener('DOMContentLoaded', insertPrimerCocktail)