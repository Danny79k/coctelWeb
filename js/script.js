//#region declaracio de variables
const nombreCoctelHTML = document.querySelector(".nombreCoctel")
const listaIngredientes = document.querySelector(".lista-ingredientes")
const preparacion = document.querySelector(".preparacion")
const imgCoctel = document.querySelector(".imgCoctel")
const buscador = document.querySelector("#buscador")
const contedorResultados = document.querySelector(".contedor-resultados")
const divOscurecedor = document.querySelector(".oscurecido")
const sectionBottom = document.querySelector(".bottom")
let botonABCs = document.querySelectorAll(".abc")

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

async function devuelveCoctelRandom() {
    try {
        let response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/random.php`)
        if (!response.ok) {
            throw new Error(`error HTTP: ${response.status}`)
        }
        return await response.json()
    } catch (e) {
        console.log("no se ha podido recuperar un coctel random");
        return null
    }
}

async function devuelveCoctelPorLetra(letra) {
    try {
        let response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${letra}`)
        if (!response.ok) {
            throw new Error(`error HTTP: ${response.status}`)
        }
        return await response.json()
    } catch (e) {
        console.log("no se ha podido recuperar un coctel random");
        return null
    }
}

async function primerCocktail() {
    try {
        let respuesta = await devuelveCoctelRandom()
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
            preparacion.classList.add("text-center")
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

let lupa = document.querySelector(".lupa")

lupa.addEventListener('click', async (e) => {
    usarFrasePlaceholder()
    let busqueda = String(buscador.value).charAt(0).toUpperCase() + String(buscador.value).slice(1);
    console.log(busqueda);
    let resultado = await nombreCoctel(busqueda);
    contedorResultados.innerHTML = '';

    if (resultado && resultado.drinks && resultado.drinks.length > 0) {
        let filteredDrinks = resultado.drinks.filter(drink =>
            drink["strDrink"] && drink["strDrink"].includes(busqueda)
        );

        let Row = document.createElement("div")
        Row.classList.add("row", "d-flex", "justify-content-evenly", "p-4", 'contendorCocteles')
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
                cuadroExplicativo.classList.add("cuadroExplicativo", "cuadroExplicativo-responsive", "d-flex", "flex-column", "text-center", "text-white", "z-index-1", "fixed-top", "bg-dark", "p-5")
                divOscurecedor.classList.add("active")
                document.querySelector("body").classList.add("overflow-y-hidden")
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
                    document.querySelector("body").classList.remove("overflow-y-hidden")
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
    },
    {
        "frase": "“No me fío de nadie que no beba, el mundo entero lleva tres copas de retraso”",
        "autor": "Humphrey Bogart"
    },
    {
        "frase": "“Un hombre inteligente a veces se ve obligado a estar borracho para pasar tiempo con tontos”",
        "autor": "Ernest Hemingway"
    },
    {
        "frase": "“Bebo para hacer interesantes a las otras personas”",
        "autor": "Groucho Marx"
    },
    {
        "frase": "“Ese es el problema de beber, pensaba, mientras me servía un trago. Si algo malo pasa, bebes para intentar olvidar; si algo bueno pasa, bebes para celebrar; y si nada pasa, bebes para que hacer que algo pase”",
        "autor": "Charles Bukowski"
    },
    {
        "frase": "“El alcohol puede ser el peor enemigo del hombre, pero la Biblia dice que ames a tu enemigo”",
        "autor": "Frank Sinatra"
    }
]

let divBuscador = document.querySelector("#divBuscador")

function usarFrasePlaceholder() {
    let quoteDiv = document.querySelector(".divQuote")
    let botonLimpiar = document.querySelector(".limpiar")
    if (buscador.value === "") {

        if (!quoteDiv) {
            let fraseAleatoria = frases[Math.floor(Math.random() * frases.length)];
            let texto = fraseAleatoria["frase"];
            let autor = fraseAleatoria["autor"];
            console.log(texto, autor);

            lupa.classList.add('rounded-end')

            let divQuote = document.createElement("div");
            let quoteBlock = document.createElement("blockquote");
            let cite = document.createElement("cite");

            quoteBlock.innerHTML = texto;
            cite.innerHTML = autor;
            divQuote.classList.add("divQuote");
            cite.classList.add("cite");
            quoteBlock.classList.add("quoteBlock", "love");

            divQuote.appendChild(quoteBlock);
            divQuote.appendChild(cite);

            sectionBottom.appendChild(divQuote);

            botonLimpiar.remove()

        }
    } else if (quoteDiv) {
        let botonLimpiar = document.createElement("button")
        botonLimpiar.classList.add('bg-danger', 'text-white', 'px-3', 'rounded-end', 'limpiar')
        let contendorCocteles = document.querySelector(".contendorCocteles")
        botonLimpiar.addEventListener('click', () => {
            contedorResultados.innerHTML = '';
            buscador.value = '';
            usarFrasePlaceholder();
        })
        lupa.classList.remove('rounded-end')
        botonLimpiar.innerHTML = "Limpiar"
        divBuscador.appendChild(botonLimpiar)
        quoteDiv.remove();
    }
}

botonABCs.forEach(boton => {
    boton.addEventListener('click', async (e) => {
        e.preventDefault()
        let letra = e.target.textContent
        console.log(letra);
        let cocteles = await devuelveCoctelPorLetra(letra)

        let divCancelar = document.createElement("div")
        divCancelar.classList.add("d-flex")
        let botonCancelar = document.createElement("a")
        botonCancelar.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="red" class="bi bi-x-lg" viewBox="0 0 16 16">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                    </svg>
                    `
        botonCancelar.classList.add("botonCancelarDiv")
        divCancelar.appendChild(botonCancelar)
        divOscurecedor.appendChild(divCancelar)

        divOscurecedor.classList.add('active', 'overflow-y-auto')
        document.querySelector("body").classList.add("overflow-y-hidden")

        let Row = document.createElement("div")
        Row.classList.add("row", "d-flex", "justify-content-evenly", "p-4", 'contendorCocteles')
        divOscurecedor.appendChild(Row)
        console.log(cocteles);

        let BTNCancelarDiv = document.querySelector(".botonCancelarDiv")
        cocteles.drinks.forEach(drink => {

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
                cuadroExplicativo.classList.add("cuadroExplicativo", "cuadroExplicativo-responsive", "d-flex", "flex-column", "text-center", "text-white", "z-index-1", "fixed-top", "bg-dark", "p-5")
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
                    cuadroExplicativo.remove();
                });
            })

        })
        let cuadroExplicativo = document.querySelector(".cuadroExplicativo")
        BTNCancelarDiv.addEventListener("click", (e) => {
            // cuadroExplicativo.remove();
            document.querySelector("body").classList.remove("overflow-y-hidden")
            Row.innerHTML = ''
            Row.remove()
            divOscurecedor.classList.remove('active');
            BTNCancelarDiv.remove()
        });
    })
})


usarFrasePlaceholder()