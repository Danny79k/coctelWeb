//#region declaracio de variables
const nombreCoctelHTML = document.querySelector(".nombreCoctel")
const listaIngredientes = document.querySelector(".lista-ingredientes")
const preparacion = document.querySelector(".preparacion")
const imgCoctel = document.querySelector(".imgCoctel")
const buscador = document.querySelector("#buscador")
const contedorResultados = document.querySelector(".contedor-resultados")
const divOscurecedor = document.querySelector(".oscurecido")
const sectionBottom = document.querySelector(".bottom")

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

//todo refactor this shit

buscador.addEventListener('input', async (e) => {
    usarFrasePlaceholder()
    let busqueda = String(e.target.value).charAt(0).toUpperCase() + String(e.target.value).slice(1);
    console.log(busqueda);
    let resultado = await nombreCoctel(busqueda);
    contedorResultados.innerHTML = '';

    if (resultado && resultado.drinks && resultado.drinks.length > 0) {
        let filteredDrinks = resultado.drinks.filter(drink =>
            drink["strDrink"] && drink["strDrink"].includes(busqueda)
        );

        let Row = document.createElement("div")
        Row.classList.add("row", "d-flex", "justify-content-evenly", "p-4")
        contedorResultados.appendChild(Row)

        filteredDrinks.forEach(drink => {
            let contendorCoctel = document.createElement("div");
            contendorCoctel.classList.add("contenedorCoctel", "my-4", "contenedor");
            contendorCoctel.innerHTML = drink["strDrink"];
            Row.appendChild(contendorCoctel);

            contendorCoctel.addEventListener("click", () => {
                let cuadroExplicativo = document.createElement("div")
                let divCancelar = document.createElement("div")
                divCancelar.classList.add("d-flex")
                let botonCancelar = document.createElement("a")
                botonCancelar.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="bi bi-x-lg" viewBox="0 0 16 16">
                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                </svg>
                `
                botonCancelar.classList.add("botonCancelar")
                divCancelar.appendChild(botonCancelar)
                cuadroExplicativo.appendChild(divCancelar)
                cuadroExplicativo.classList.add("cuadroExplicativo", "d-flex", "flex-column", "text-center", "text-white", "z-index-1", "fixed-top", "bg-dark", "p-5")
                divOscurecedor.classList.add("active")
                contedorResultados.appendChild(cuadroExplicativo)
                console.log(cuadroExplicativo);
                let infoSeleccionado = document.createElement("div")
                infoSeleccionado.classList.add("infoSeleccionado", "overflow-x-auto")
                // nombre coctel
                let nombreTitulo = document.createElement("h1")
                nombreTitulo.classList.add("display-3", "text-white")
                nombreTitulo.textContent = drink["strDrink"]
                infoSeleccionado.appendChild(nombreTitulo)
                // imagen
                let imagen = document.createElement("img")
                let divImagen = document.createElement("div")
                divImagen.classList.add("imagen", "d-flex", "justify-content-center")
                imagen.src = drink["strDrinkThumb"]
                imagen.classList.add("img-fluid", "w-50")
                divImagen.appendChild(imagen)
                infoSeleccionado.appendChild(divImagen)

                // ingredientes & medidas
                let tituloIngredientes = document.createElement("h1")
                tituloIngredientes.classList.add("display-5", "text-white")
                tituloIngredientes.textContent = "Ingredientes & Medidas"
                infoSeleccionado.appendChild(tituloIngredientes)
                let listaContendor = document.createElement("ul")

                let ingredientes = []
                let medidas = []

                for (let i = 1; i <= 15; i++) {
                    if (drink[`strIngredient${i}`] !== null) ingredientes.push(drink[`strIngredient${i}`])
                    if (drink[`strMeasure${i}`] !== null) medidas.push(drink[`strMeasure${i}`])
                }

                for (let i = 0; i < ingredientes.length; i++) {
                    let elementoLista = document.createElement("li")
                    elementoLista.textContent = `${ingredientes[i]}: ${medidas[i] !== undefined ? medidas[i] : "al gusto"}`
                    listaContendor.appendChild(elementoLista)
                }

                infoSeleccionado.appendChild(listaContendor)

                //preparacion
                if (drink["strInstructionsES"] !== null) {
                    let tituloPreparacion = document.createElement("h1")
                    tituloPreparacion.classList.add("display-5", "text-white")
                    tituloPreparacion.textContent = "Preparación"
                    infoSeleccionado.appendChild(tituloPreparacion)
                    let textoPreparacion = document.createElement("p")
                    textoPreparacion.classList.add("text-white")
                    textoPreparacion.textContent = drink["strInstructionsES"]
                    infoSeleccionado.appendChild(textoPreparacion)
                }


                cuadroExplicativo.appendChild(infoSeleccionado)
                let BTNCancelar = document.querySelector(".botonCancelar")
                BTNCancelar.addEventListener("click", (e) => {
                    divOscurecedor.classList.remove("active");
                    cuadroExplicativo.remove();
                });
            })
        });
    }
});

document.addEventListener('DOMContentLoaded', insertPrimerCocktail)

//#region frases aleatorias de placeholder

const frases = [
    {
        "frase": "“¡Venid rápido, estoy bebiendo las estrellas!”",
        "autor": "Dom Pierre Perignon"
    },
    {
        "frase": "“En el vino hay sabiduría, en la cerveza libertad, y en el agua bacterias”",
        "autor": "Benjamin Franklin"
    },
    {
        "frase": "“Alcohol, esa manera de ver con cristales rosas la vida”",
        "autor": "F. Scott Fitzgerald"
    },
    {
        "frase": "“Una vez me enamoré de una hermosa rubia, querida. Ella me empujó al alcohol. Es lo único por lo que le estoy agradecido”",
        "autor": "W. C. Fields"
    },
    {
        "frase": "“El gin tonic ha salvado más vidas y mentes de hombres ingleses que todos los doctores del Imperio”,  nos quedamos con otra que da debida cuenta de ese carácter arrollador que tenía: “Una señora se me acercó un día y me dijo: “Señor, está usted borrado; es más, asquerosamente borracho”… a lo que le respondí: “Sí, lo estoy señora, y déjeme decirle que usted es fea, es más, rematadamente fea. La diferencia es que mañana yo estaré sobrio, y usted seguirá siendo fea”.",
        "autor": "Winston Churchill"
    }
]

function usarFrasePlaceholder() {
    if (buscador.value === "") {
        let fraseAleatoria = frases[Math.floor(Math.random() * frases.length)];
        let texto = fraseAleatoria["frase"]
        let autor = fraseAleatoria["autor"]
        console.log(texto, autor);
        let divQuote = document.createElement("div")
        let quoteBlock = document.createElement("blockquote")
        let cite = document.createElement("cite")
        quoteBlock.innerHTML = texto
        cite.innerHTML = autor
        divQuote.classList.add("divQuote")
        cite.classList.add("cite")
        quoteBlock.classList.add("quoteBlock", "love")
        divQuote.appendChild(quoteBlock)
        divQuote.appendChild(cite)
        sectionBottom.appendChild(divQuote)
    } else {
        let divQuote = document.querySelector(".divQuote")
        divQuote.remove()
    }
}

usarFrasePlaceholder()