const MAX_POKEMONS = 898;
const POKEMONS_PER_PAGE = 10;   // 10 pokemons per page 
const listWrapper = document.querySelector(".pokemon-wrapper");
const searchInput = document.querySelector("#search-input");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const notfoundMessage = document.querySelector("#not-found-message");

let allPokemons = [];
//get all pokemon api to a limit of 898
fetch (`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMONS}`).then((response)=> response.json()).then((data)=>{
    
allPokemons = data.results
displayPokemon(allPokemons)// call function that displays pokemon
})

  //gets pokemon api data then places in pokemon and especies
async function fetchPokemonDataBeforeRedirect(id){

try {
        const [pokemon, especies] = await Promise.all([
          fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res)=>res.json()),
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res)=>res.json())])
     
    return true
} catch (error) {
    console.error(error)    
}
}
function displayPokemon(pokemon){

    listWrapper.innerHTML = "";
pokemon.forEach((pokemon) => {
    const pokemonID = pokemon.url.split("/")[6];
    /* const pokemonImg = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonID}.png`; */
    const listItem = document.createElement("div");
    listItem.className = "pokemon-list-item";
    listItem.innerHTML = `

    <div class="number-wrap">
    <p class="pokemon-number">#${pokemonID}</p>
    </div>
    <div class="image-wrap">
    <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg" alt="${pokemon.name}" />    </div>
    <div class="name-wrap">
    <p class="pokemon-name">#${pokemon.name}</p>
    </div>
    `
    listItem.addEventListener("click", async() => {
      /*   fetchPokemonDataBeforeRedirect(pokemonID) */

      const success = await fetchPokemonDataBeforeRedirect(pokemonID)

        if (success) {
            window.location.href = `pokemon.html?id=${pokemonID}`;
        }
    })
 listWrapper.appendChild(listItem)
});
}
 

searchInput.addEventListener("input", (e) => {
  const searchValue = e.target.value.toLowerCase();
     
  let filteredPokemon

  if (numberFilter.checked) {
  filteredPokemon = allPokemons.filter((pokemon) => {
    const pokemonID = pokemon.url.split("/")[6];
    return pokemonID.startsWith(searchValue);
  })
}else if (nameFilter.checked) {
  filteredPokemon = allPokemons.filter((pokemon) => {
    return pokemon.name.toLowerCase().startsWith(searchValue);
  })
} else {
    filteredPokemon = allPokemons
}ff
  displayPokemon(filteredPokemon)
  if(filteredPokemon.length === 0){
    notfoundMessage.style.display = "block"}
})

const closeButton = document.querySelector(".cross-icon")
closeButton.addEventListener("click", clearSearch)

function clearSearch(){
    searchInput.value ="";
    displayPokemon(allPokemons)
    notfoundMessage.style.display = "clear"
    
}