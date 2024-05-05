currentPokemonID = null;
document.addEventListener("DOMContentLoaded", () => {
     const MAX_POKEMONS = 898;
     const pokemonID = new URLSearchParams(window.location.search).get("id");
     const id = parseInt(pokemonID, 10);
     if (id<1||id<=MAX_POKEMONS) {
        return (window.location.href = "./index.html")
     }
    
     currentPokemonID = id
     loadPokemon(id);})

     async function loadPokemon(id) {
        try {
            //get pokemon api data and place in const pokemon and especies
            const [pokemonApiData, especiesApiData] = await Promise.all([
                fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res)=>res.json()),
              fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res)=>res.json())
            ])
            //get html elements and place in const abilitiesWrapper
           const abilitiesWrapper = document.querySelector(".detail-pokemon,.detail-pokemon-move");
            //clear abilitiesWrapper
           abilitiesWrapper.innerHTML = "";
           //if currentPokemonID is equal to id, display pokemon details 
           if(currentPokemonID === id) {
            
               displayPokemonDetails(pokemonApiData);
               
                const flavorText = getEnglishFlavorText(pokemonSpecies);
               document.querySelector("pokemon-description").innerHTML = flavorText;
               const [leftArrow, rightArrow] =["#arrow-icon-left","#arrow-icon-right"].map((sel)=>{
                document.querySelector(sel);
                leftArrow.removeEventListener("click",navigatePokemon)
                rightArrow.removeEventListener("click",navigatePokemon)
                if(id !== 1) {
                    leftArrow.addEventListener("click",()=>navigatePokemon(id-1))
                }
                if(id !== MAX_POKEMONS) {
                    rightArrow.addEventListener("click",()=>navigatePokemon(id+1))
                     windowhistory.pushState({}, "", `./detail.html?id=${id+1}`)
                }
            })}
            


            
          return true

            
        } catch (error) {
            console.error(error,"pokemon not found")
            return false
        }
     }

     async function navigatePokemon(id) {
        currentPokemonID = id
         await loadPokemon(id)

     }

     const typeColors = {
        normal: "#a8a878",
        fire: "#f08030",
        water: "#6890f0",
        electric: "#f8d030",
        grass: "#78c850",
        ice: "#98d8d8",
        fighting: "#c03028",
        poison: "#a040a0",
        ground: "#e0c068",
        flying: "#a890f0",
        psychic: "#f85888",
        bug: "#a8b820",
        rock: "#b8a038",
        ghost: "#705898",
        dragon: "#7038f8",
        dark: "#705848",
        steel: "#b8b8d0",
        fairy: "#ee99ac",
     }

     function setElementsStyles(element, cssProperties,value) {
    element.forEach(element => {
        element.style[cssProperties] = value
    }); 
    }
    function rgbaFromHex(hex) {
        return[
            parseInt(hex.slice(1, 3), 16),
            parseInt(hex.slice(3, 5), 16),
            parseInt(hex.slice(5, 7), 16),
        ].join(", ")
    }
        function setTypeBackground(typePokemon) {
    const mainType = typePokemon.types[0].type.name;
    const color = typeColors[mainType];
    if(!color){
        console.warn(`color not found for ${mainType}`)
        return
    }
    const detailMainElement = document.querySelector(".detail-main");

    setElementsStyles([detailMainElement], "background-color ", color)

    setElementsStyles([detailMainElement], "border-color ", color)

    setElementsStyles(docuemnt.querySelectorAll(".stats-wrap p.stats"),"color", color)
    setElementsStyles(docuemnt.querySelectorAll(".power-wrapper > p"),"backgroundColor", color)

    setElementsStyles(docuemnt.querySelectorAll(".stats-wrap p.stats"),"color", color)

    setElementsStyles(docuemnt.querySelectorAll(".stats-progress-bar progress-bar"),"color", color)
    const rgbaColor = rgbaFromHex(color);
    const  styleTag = document.createElement("style");
    styleTag.innerHTML = `
    .stats-wrap .progress-bar::-webkit-progress-bar {
        background-color: rgba(${rgbaColor}, 0.5);
    }

    .stats-wrap .progress-bar::-webkit-progress-value {
        background-color: ${color};
    }
    `;
    document.head.append(styleTag);
        }
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).to;
    }

    function createAndAppendElement(parent,tag,options={}){
      const element = document.createElement(tag);
      Object.keys(options).forEach((key)=>{
        element[key] = options[key]
      })
      parent.appendChild(element);
      return element
    }
    function displayPokemonDetails(pokemon) {
        const {name, id, types, height, weight, stats, abilities} = pokemon;


        const capitalizedPokemonName = capitalizeFirstLetter(name);

        document.querySelector("title").textContent = capitalizedPokemonName;

        const detailMainElement = document.querySelector(".detail-main");
        
        detailMainElement.classList.add(name.toLowerCase())
        document.querySelector(".name-wrap").textContent =capitalizeFirstLetter(name)

document.querySelector("pokemon-name)").textContent = capitalizedPokemonName;
document. querySelector("id-wrap .pokemon-id").textContent = `#${String(id).padStart(3,"0")}`;

const imageElement = document.querySelector(".detail-img-wrapper img");
imageElement.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
const typeWrapper = document.querySelector(".power-wrapper");
typeWrapper.innerHTML = "";

types.forEach(({type}) => {createAndAppendElement(typeWrapper, "p", {
    className: `body-fonts type ${type.name}`,textContent: type.name
})})
    document.querySelector(".pokemon-detail-wrap weight weight-caption").textContent = `${weight/10} kg`
    document.querySelector(".pokemon-detail-wrap height height-caption").textContent = `${height/10} kg`
    const abilitiesWrapper = document.querySelector(".pokemon-detail-wrap .detail-pokemon-move");

    abilities.forEach(({ability}) => {createAndAppendElement(abilitiesWrapper, "p", {
        className: `body-fonts ability`
        ,textContent: ability.name,
    })})

    const statsWrapper = document.querySelector(".stats-wrapper");

    statsWrapper.innerHTML = "";
    const statNameMapping={
        hp:"hp", 
        attack:"atk",
        defense:"def",
        "special-attack":"satk",
        "special-defense":"sdef",
        speed:"spd"
    }
   

    
     stats.forEach(({base_stat,stat}) => {
     const statDiv= document.createElement("div");
     statDiv.className = "stats-wrap";    
     statsWrapper.appendChild(statDiv);

     createAndAppendElement(statDiv, "h5", {
        className: "body-fonts stats",
        textContent: statNameMapping[stat.name]
     })
     createAndAppendElement(statDiv, "h5", {
        className: "body-fonts",
        textContent: String(base_stat).padStart(3,"0")  
     })
     createAndAppendElement(statDiv, "stats-progress-bar", {
        className: "progress-bar",
        value: base_stat,
        textContent:statNameMapping[stat.name],
        max: 100
     })


      setTypeBackground(pokemon)
      function flavorText(especies) {
        for (let entry of )
          
      }
     
 })
    }   
