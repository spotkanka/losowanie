document.addEventListener('DOMContentLoaded', () => {
    const card = document.querySelector('.card');
    const nameInput = document.getElementById('name-input');
    const addNameButton = document.getElementById('add-name');
    const nameList = document.getElementById('name-list');
    const drawNameButton = document.getElementById('draw-name');
    const spotkankoElement = document.getElementById("spotkanko");
    const allowRepeatsCheckbox = document.getElementById('allow-repeats-checkbox');

    let allNames = [];
    let remainingNames = [];

    allowRepeatsCheckbox.checked = false;

    card.addEventListener('click', (event) => {
        if (
            event.target !== nameInput &&
            event.target !== addNameButton &&
            event.target !== allowRepeatsCheckbox &&
            event.target.parentElement !== allowRepeatsCheckbox.parentElement
        ) {
            card.classList.toggle('flipped');
        }
    });

    allowRepeatsCheckbox.addEventListener('click', (event) => {
        event.stopPropagation();
        const allowRepeats = event.target.checked;
        console.log(`Powtarzanie: ${allowRepeats ? "włączone" : "wyłączone"}`);
    });

    const addName = (name) => {
        const listItem = document.createElement('li');
        listItem.textContent = name;
        listItem.classList.add('list-item');
        nameList.appendChild(listItem);
        allNames.push(name);
        remainingNames.push(name);
    };

    addNameButton.addEventListener('click', (event) => {
        event.stopPropagation();
        const name = nameInput.value.trim();
        if (name) {
            addName(name);
            nameInput.value = '';
        }
    });

    spotkankoElement.addEventListener("click", () => {
        const names = ["Oliwier", "Dominik", "Kuba", "Justyna", "Ewa", "Emilia"];
        names.forEach(name => {
            nameInput.value = name;
            addNameButton.click();
        });
    });

    nameInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const name = nameInput.value.trim();
            if (name) {
                addName(name);
                nameInput.value = '';
            }
        }
    });

    nameList.addEventListener('click', (event) => {
        if (event.target.tagName === 'LI') {
            event.stopPropagation();
            const name = event.target.textContent;
            allNames = allNames.filter(n => n !== name);
            remainingNames = remainingNames.filter(n => n !== name);
            nameList.removeChild(event.target);
        }
    });

    drawNameButton.addEventListener('click', () => {
        if (allNames.length === 0) {
            alert('Dodaj przynajmniej jedno imię przed losowaniem!');
            return;
        }

        const allowRepeats = allowRepeatsCheckbox.checked;

        let selectedName;
        if (allowRepeats) {
            const randomIndex = Math.floor(Math.random() * allNames.length);
            selectedName = allNames[randomIndex];
        } else {
            if (remainingNames.length === 0) {
                remainingNames = [...allNames];
            }
            const randomIndex = Math.floor(Math.random() * remainingNames.length);
            selectedName = remainingNames.splice(randomIndex, 1)[0];
        }

        card.classList.remove('flipped');
        card.querySelector('.front').textContent = selectedName;
    });
});
