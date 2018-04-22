let allCharacters = [];


document.addEventListener('DOMContentLoaded', () => {
  url="http://hp-api.herokuapp.com/api/characters";
  makeRequest(url, requestComplete);

  const typeSelect = document.querySelector('#character-type-dropdown');
  typeSelect.addEventListener('change', handleTypeChangeRequest);

  const characterSelect = document.querySelector('#character-dropdown');
  characterSelect.addEventListener('change', handleCharacterChangeRequest);

});

const handleClickEvent = function(event) {
  setInterval((event) => {this.className = "not-pressed"}, 5000);
  this.className = "pressed";

};

const handleTypeChangeRequest = function(event) {
  const select = document.querySelector('#character-dropdown');
  select.innerHTML = '';
  createCharacterDropDown(select, allCharacters, this.value)
};

const handleCharacterChangeRequest = function(event) {
  const list = document.querySelector('#character-info');
  list.innerHTML = '';
  const selectedCharacter = getCharacterByName(allCharacters, this.value);
  console.log(selectedCharacter);
  createCharacterInfo(list, selectedCharacter);
};

const getCharacterByName = function(characters, name) {
  let selectedCharacter;
  characters.forEach((character) => {
    if(character.name === name) {
      selectedCharacter = character;
    };
  });
  return selectedCharacter;
};

const createCharacterInfo = function(list, character) {
  const name = document.createElement('li');
  name.textContent = character.name;

  const today = new Date();
  const age = document.createElement('li');

  if(character.yearOfBirth === "") {
    age.textContent = "Not Known";
  } else {
    age.textContent = today.getFullYear() - character.yearOfBirth;
  }

  const ancestry = document.createElement('li');
  ancestry.textContent = character.ancestry;

  const patronus = document.createElement('li');
  patronus.textContent = character.patronus;

  const img = document.createElement('img');
  img.src = character.image;
  img.addEventListener('click', handleClickEvent);

  list.appendChild(name);
  list.appendChild(age);
  list.appendChild(ancestry);
  list.appendChild(patronus);
  list.appendChild(img);
};

const createCharacterDropDown = function(select, characters, characterType) {
  const filteredCharacters = getCharactersByHogwartsType(characters, characterType)
  filteredCharacters.forEach((character) => {
    const option = document.createElement('option');
    option.textContent = character.name;
    select.appendChild(option);
  });
};

const getCharactersByHogwartsType = function(characters, characterType) {
  if (characterType === "student") {
    return getStudents(characters);
  } else if (characterType === "staff") {
    return getStaff(characters);
  } else {
    return getNonMembers(characters);
  };
};

const getStudents = function(characters) {
  return characters.filter((character) => character.hogwartsStudent);
};

const getStaff = function(characters) {
  return characters.filter((character) => character.hogwartsStaff);
};

const getNonMembers = function(characters) {
  return characters.filter((character) => (!character.hogwartsStaff && !character.hogwartsStudent));
};



const makeRequest = function (url, callback) {
  const request = new XMLHttpRequest();
  request.open('GET', url);
  request.send();
  request.addEventListener('load', callback);
};

const requestComplete = function () {
  if (this.status !== 200) return;
  const jsonString = this.responseText;
  allCharacters = JSON.parse(jsonString);
  const array = getStudents(allCharacters);
};
