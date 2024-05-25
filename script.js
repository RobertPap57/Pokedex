let URL = `https://pokeapi.co/api/v2/pokemon?limit=25&offset=0`;
let pokemons = [];
let currentCardIndex = 0;
let modalOpen = false;
let currentPokemons = 25;
let maxPokemons = 1277;

async function init() {
    showLoadingScreen();
    try {
        await fetchPokemons();
        await fetchPokemonInfos(pokemons);
        await fetchPokemonAbility(pokemons);
        await fetchPokemonSpecies(pokemons);
        hideLoadingScreen();
        renderPokemons();
    } catch (error) {
        console.error('Error fetching data:', error);
        hideLoadingScreen();
    }
}

async function fetchPokemons() {
    let response = await fetch(URL);
    let responseAsJson = await response.json();
    pokemons = responseAsJson['results'];
    console.log('Total Pokemons:' + pokemons.length);
}

async function fetchNewPokemons() {
    let response = await fetch(URL);
    let responseAsJson = await response.json();
    console.log('New Pokemons:' + responseAsJson['results'].length);
    return responseAsJson['results'];
}

async function fetchPokemonInfos(pokemons) {
    for (let i = 0; i < pokemons.length; i++) {
        const pokemon = pokemons[i];
        let infoUrl = pokemon['url'];
        let infoResponse = await fetch(infoUrl);
        let infoResponseAsJson = await infoResponse.json();
        pokemon.info = infoResponseAsJson;
   
    }
}

async function fetchPokemonSpecies(pokemons) {
    for (let i = 0; i < pokemons.length; i++) {
        const pokemon = pokemons[i];
        let speciesUrl = pokemon.info.species.url;
        let speciesResponse = await fetch(speciesUrl);
        let speciesResponseAsJson = await speciesResponse.json();
        pokemon.species = speciesResponseAsJson;
 
    }
}

async function fetchPokemonAbility(pokemons) {
    const fetchAbility = async url => url ? fetch(url).then(res => res.json()) : null;
    for (const pokemon of pokemons) {
        const abilities = pokemon.info.abilities.filter(ability => !ability.is_hidden);
        const [ability1Url, ability2Url] = abilities.map(ability => ability.ability.url);
        const [ability1Data, ability2Data] = await Promise.all([
            fetchAbility(ability1Url),
            fetchAbility(ability2Url)
        ]);
        pokemon.abilities = [ability1Data, ability2Data];
    }
   
}

function renderPokemons() {
    const mainContainer = document.getElementById('main-content');
    mainContainer.innerHTML = '';
    pokemons.forEach((pokemon, i) => {
        const { info } = pokemon;
        const [type1, type2] = info.types.map(type => type.type.name);
        const displayType = type2 ? 'block' : 'none';
        const backgroundColor = getTypeBackgroundColor(type1);
        mainContainer.innerHTML += smallCardHtml(backgroundColor, pokemon, info, type1, displayType, type2, i);
    });
    addPokemonsHtml(maxPokemons);
    console.log(pokemons);
}

async function addPokemons() {
    let newPokemonsNr = Number(document.getElementById('pokemons-number').value);
    URL = `https://pokeapi.co/api/v2/pokemon?limit=${newPokemonsNr}&offset=${currentPokemons}`;
    maxPokemons -= newPokemonsNr;
    showLoadingScreen()
    let newPokemons = await fetchNewPokemons();
    await fetchPokemonInfos(newPokemons);
    await fetchPokemonAbility(newPokemons);
    await fetchPokemonSpecies(newPokemons);
    pokemons = pokemons.concat(newPokemons);
    hideLoadingScreen();
    renderPokemons();
    scrollToBottom();
    currentPokemons += newPokemonsNr;
}

function displayCard(index) {
    const bigCard = document.getElementById('modal-content');
    const pokemon = pokemons[index];
    const measurements = convertMetrics(index);
    const types = pokemon.info.types.map(type => type.type.name);
    const displayType = types[1] ? 'block' : 'none';
    const stats = pokemon.info.stats.map(stat => stat.base_stat);
    const abilities = filterAbilities(pokemon);
    const speciesInfo = filterSpecies(pokemon);
    const cardHtml = bigCardHtml(
        pokemon, 
        stats, 
        measurements, 
        types, 
        speciesInfo.pokemonText, 
        speciesInfo.pokemonClass, 
        abilities.ability1Name, 
        abilities.ability2Name, 
        abilities.displayAbility, 
        abilities.ability1text, 
        abilities.ability2text, 
        displayType
    );
    bigCard.innerHTML = removeUndefinedImages(cardHtml);
    document.getElementById('modal').style.display = 'flex';
    modalOpen = true;
   
}

function searchPokemons() {
    const search = document.getElementById('search').value.toLowerCase();
    const mainContainer = document.getElementById('main-content');
    if (search === '') {
        renderPokemons(); 
        return;
    }
    mainContainer.innerHTML = '';
    pokemons.forEach((pokemon, i) => {
        const { name, info } = pokemon;
        const [type1, type2] = info.types.map(type => type.type.name);
        const displayType = type2 ? 'block' : 'none';
        const backgroundColor = getTypeBackgroundColor(type1);
        if (name.toLowerCase().includes(search)) {
            mainContainer.innerHTML += smallCardHtml(backgroundColor, pokemon, info, type1, displayType, type2, i);
        }
    });
}

function filterAbilities(pokemon) {
    const abilities = pokemon.abilities || [];
    const [ability1, ability2] = abilities.map(ability => ({
        name: transformString(ability?.name || ''),
        text: ability?.effect_entries.find(entry => entry.language.name === 'en')?.short_effect || ''
    }));
    return {
        ability1Name: ability1?.name || '',
        ability2Name: ability2?.name || '', 
        displayAbility: ability2?.name ? 'flex' : 'none', 
        ability1text: ability1?.text || '',
        ability2text: ability2?.text || ''
    };
}

function filterSpecies(pokemon) {
    const { flavor_text_entries, genera } = pokemon.species;
    const pokemonText = flavor_text_entries.find(entry => entry.language.name === 'en')?.flavor_text || '';
    const pokemonClass = genera.find(genus => genus.language.name === 'en')?.genus || '';
    return { pokemonText, pokemonClass };
}


function openCard(index) {
    currentCardIndex = index;
    displayCard(currentCardIndex);
    document.body.classList.add('modal-open');
}

function nextCard() {
    if (modalOpen) {
        currentCardIndex = (currentCardIndex + 1) % pokemons.length;
        displayCard(currentCardIndex);
    }
}

function prevCard() {
    if (modalOpen) {
        currentCardIndex = (currentCardIndex - 1 + pokemons.length) % pokemons.length;
        displayCard(currentCardIndex);
    }
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
    modalOpen = false;
    document.body.classList.remove('modal-open');
}

document.addEventListener('keydown', (event) => {
    if (modalOpen) {
        if (event.key === 'ArrowRight') {
            nextCard();
        } else if (event.key === 'ArrowLeft') {
            prevCard();
        } else if (event.key === 'Escape') {
            closeModal();
        }
    }
});

window.onclick = function (event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
}
function scrollToBottom() {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
}

function showLoadingScreen() {
    document.getElementById('loading-screen').style.display = 'flex';
    document.getElementById('main-content').style.display = 'none';
}

function hideLoadingScreen() {
    document.getElementById('loading-screen').style.display = 'none';
    document.getElementById('main-content').style.display = 'flex';
}

function removeUndefinedImages(html) {
    const removeHtml = html.replace('<img src="./img/icons/undefined.svg" />', '');
    return removeHtml;
}

function transformString(str) {
    if (typeof str === 'string' && str.trim() !== '') {
        if (str.includes(' ') || str.includes('-')) {
            let words = str.split(/\s+|-+/);
            let capitalizedWords = words.map(word => capitalizeFirstLetter(word));
            return capitalizedWords.join(' ');
        } else {
            return capitalizeFirstLetter(str);
        }
    } else {
        return '';
    }
}

function calculatePercentage(stat) {
    const maxStat = 180;
    const percentage = (stat / maxStat) * 100;
    return percentage;
}

function capitalizeFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function convertMetrics(index) {
    let height = pokemons[index].info['height'] / 10;
    let weight = pokemons[index].info['weight'] / 10;
    const lbs = weight * 2.20462;
    const totalInches = height * 39.3701;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return {
        lbs: lbs.toFixed(1),
        feet: feet,
        inches: inches.toString().padStart(2, '0')
    };
}


