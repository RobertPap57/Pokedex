function smallCardHtml(backgroundColor, pokemon, info, type1, displayType, type2, index) {
    return `
    <div class="card" onclick="openCard(${index})">
    <div class="card-content" style="background-color: ${backgroundColor};">
    <div class="card-title">
    <h2>${pokemon['name'].toUpperCase()}</h2>  
    </div>
    <div>
    <img src="${info['sprites']['other']['showdown']['front_default']}">
    </div>
    <div class="card-types">
    <div class="type1">${type1}</div>
    <div class="type2" style="display: ${displayType};">${type2}</div>
    </div>
    </div>
    </div>
    `
}

function addPokemonsHtml(maxPokemons) {
 document.getElementById('main-content').innerHTML += 
    `
    <div class="card no-hover">
    <div class="card-content add-pokemon-card">
    <h2 class="add-pokemon-title">Load More Pokemons</h2>
    <form onsubmit="addPokemons(); return false">
    <input id="pokemons-number" type="number" required minlength="1" min="1" max="${maxPokemons}" placeholder="Number">
    <button type="submit" class="add-pokemon-btn">
    <img src="./img/plus-circle-fill.svg" alt="">
    </button>
    </form>
    </div>
    </div>
    `
}

function bigCardHtml(
    pokemon, 
    statValue, 
    measurements, 
    typeName, 
    pokemonText, 
    pokemonClass, 
    ability1Name, 
    ability2Name, 
    displayAbility, 
    ability1text, 
    ability2text, 
    displayType
) {
    return ` 
        <div id="big-card" style="background-color: ${getTypeBackgroundColor(typeName[0])};">
            <div class="bc-container" style="background-color: ${getTypeBackgroundColor(typeName[0])};">
                <img class="bc-background-img" src="./img/background-lava.jpg" alt="">
                <div class="bc-title">
                    <span class="pokemon-text"><span>${pokemonText.replace('\f', ' ')}</span></span>
                    ${capitalizeFirstLetter(pokemon['name'])}
                </div>
                <div class="hp-container">
                    <div>HP</div>
                    <div>${statValue[0]}</div>
                </div>
                <div class="bc-types bc-type2" style="background-color: ${getTypeBackgroundColor(typeName[1])}; display: ${displayType};">
                    <img src="./img/icons/${typeName[1]}.svg" />
                </div>
                <div class="bc-types bc-type1" style="background-color: ${getTypeBackgroundColor(typeName[0])}; pointer-events: ${displayType};">
                    <img src="./img/icons/${typeName[0]}.svg" />
                </div>
                <div class="bc-img-container">
                    <div class="bc-img">
                        <img src="${pokemon.info['sprites']['other']['official-artwork']['front_default']}">
                        <div class="bc-info">
                            NO. ${pokemon.info['id'].toString().padStart(3, '0')}
                            &nbsp; ${pokemonClass} &nbsp;
                            HT: ${measurements['feet']}'${measurements['inches']}" &nbsp; WT: ${measurements['lbs']} lbs.
                        </div>
                    </div>
                </div>
                <div class="stats-title">Stats</div>
                <div class="stats">
                    <div class="stat-name">Attack</div>
                    <div class="progress-container">
                        <div class="progress-bar">
                            <div class="progress" style="width: ${calculatePercentage(statValue[1])}%; background-color:rgba(255, 0, 0, 0.6);">${statValue[1]}</div>
                        </div>
                    </div>
                    <div class="stat-name">Speed</div>
                    <div class="progress-container">
                        <div class="progress-bar">
                            <div class="progress" style="width: ${calculatePercentage(statValue[5])}%; background-color: rgba(255, 165, 0, 0.6);">${statValue[5]}</div>
                        </div>
                    </div>
                    <div class="stat-name">Defense</div>
                    <div class="progress-container">
                        <div class="progress-bar">
                            <div class="progress" style="width: ${calculatePercentage(statValue[2])}%; background-color: rgba(0, 128, 0, 0.6);">${statValue[2]}</div>
                        </div>
                    </div>
                    <div class="stat-name">Special Attack</div>
                    <div class="progress-container">
                        <div class="progress-bar">
                            <div class="progress" style="width: ${calculatePercentage(statValue[3])}%; background-color: rgb(0, 0, 255, 0.6);">${statValue[3]}</div>
                        </div>
                    </div>
                    <div class="stat-name">Special Defense</div>
                    <div class="progress-container">
                        <div class="progress-bar">
                            <div class="progress" style="width: ${calculatePercentage(statValue[4])}%; background-color: rgba(128, 0, 128, 0.6);">${statValue[4]}</div>
                        </div>
                    </div>
                </div>
                <div class="abilities-title">Abilities</div>
                <div class="abilities">
                    <div class="ability1">
                        <div class="ability-div" style="background-color: ${getTypeBackgroundColor(typeName[0])};">${ability1Name}</div>
                        <span class="ability-text"><span>${ability1text}</span></span>
                    </div>
                    <div class="ability2" style="display: ${displayAbility};">
                        <div class="ability-div" style="background-color: ${getTypeBackgroundColor(typeName[0])};">${ability2Name}</div>
                        <span class="ability-text"><span>${ability2text}</span></span>
                    </div>
                </div>
            </div>
        </div>`;
}

function getTypeBackgroundColor(type) {
    const typeColors = {
        'fire': '#FBA64C',
        'grass': '#60BD58',
        'water': '#539DDF',
        'bug': '#92BD2D',
        'normal': '#A0A29F',
        'poison': '#B763CF',
        'electric': '#F2D94E',
        'fairy': '#EF90E6',
        'ground': '#DA7C4D',
        'fighting': '#D3425F',
        'psychic': '#FA8581',
        'rock': '#C9BB8A',
        'ghost': '#5F6DBC',
        'ice': '#75D0C1',
        'dragon': '#0C69C8',
        'flying': '#A1BBEC',
        'steel': '#5695A3'
    };
    return typeColors[type];
}