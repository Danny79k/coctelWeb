
let contendorIngredientes = document.querySelector(".cajaingredientes")
let listaIngredientes = document.querySelector(".listaIngredientes")

const ingredientes = ["azucar", "harina", "miel", "chocolate", "ron"]

for (let i = 0; i < ingredientes.length; i++) {
    let divIngrediente = document.createElement("div")
    divIngrediente.innerHTML = ingredientes[i]
    divIngrediente.classList.add("ingrediente")
    contendorIngredientes.appendChild(divIngrediente)
}

let divIngredientes = document.querySelectorAll(".ingrediente")

divIngredientes.forEach(divIngrediente =>
    divIngrediente.addEventListener('click', (e) => {
        let ingrediente = e.target
        let ingredienteElegido = ingrediente.cloneNode(true)
        ingredienteElegido.classList.add("elegido")
        listaIngredientes.appendChild(ingredienteElegido)
        ingredienteElegido.addEventListener('click', (e) => {
            let ingrediente = e.target
            ingrediente.remove()
        })
    })
)
