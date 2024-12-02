document.addEventListener('DOMContentLoaded', () => {
    const card = document.querySelector('.card');
    const nameInput = document.getElementById('name-input');
    const addNameButton = document.getElementById('add-name');
    const nameList = document.getElementById('name-list');
    const drawNameButton = document.getElementById('draw-name');
    const spotkankoElement = document.getElementById("spotkanko");
    const minimalCheckmark = document.querySelector('#allow-repeats-container .minimal-checkmark');
    const checkbox = document.getElementById('allow-repeats-checkbox');
    const label = document.getElementById('allow-repeats-container');
    const footer = document.querySelector('footer p'); // Tekst stopki
    const container = document.getElementById("video-container");
    const gifConteiner = document.getElementById("gif-container");

    let allNames = [];
    let remainingNames = [];
    let black = ["Wojtek", "Wojciech", "Klimek" , "Jerved", "Jerwed", "Kosarz", "Wojteczek", "Wojtunio", "kulka", "mocy", "gruby"];
    let blackCounter = 0;

    checkbox.checked = false;
    let reakcjaOn = true;

    const On = "~made by Oliwier Parobczy";
    const Off = "~ made by Oliwier Parobczy";

    const addToBlacklist = (newWords) => {
        black = [...black, ...newWords];
    };
    
    const checkInputAndIncrement = (input, blacklist) => {
        const normalize = (text) => {
            const replacements = {
                '0': 'o',
                '1': ['i', 'l', 'j'], // '1' może być 'i', 'l', 'j'
                '2': 't',
                '3': 'e',
                '4': 'a',
                '5': 's',
                '7': 't',
                '@': ['a', 'o'],
                'l': ['i', 'j'],
                '!': ['i', 'l', 'j'],
                '$': 's',
                '^': 'a',
                '?': 'p',
                'i': 'j',
                'j': 'i'
            };
    
            return text
                .toLowerCase()
                .split('')
                .map(char => {
                    if (replacements[char]) {
                        if (Array.isArray(replacements[char])) {
                            return replacements[char];
                        }
                        return replacements[char];
                    }
                    return char;
                })
                .join('');
        };
    
        const containsWordWithSkippedChars = (input, word) => {
            const sanitizedInput = input.replace(/[^a-z0-9]/g, '');
            const sanitizedWord = word.replace(/[^a-z0-9]/g, '');
            return sanitizedInput.includes(sanitizedWord);
        };
    
        const getSimilarityPercentage = (str1, str2) => {
            let commonChars = 0;
            const length = Math.max(str1.length, str2.length);
    
            for (let i = 0; i < Math.min(str1.length, str2.length); i++) {
                if (str1[i] === str2[i]) {
                    commonChars++;
                }
            }
    
            return (commonChars / length) * 100;
        };
    
        const isSimilarWord = (input, word, threshold = 50) => {
            const similarity = getSimilarityPercentage(input, word);
            return similarity >= threshold;
        };
    
        const normalizedInput = normalize(input).replace(/[^a-z0-9]/g, '');
    
        for (let word of blacklist) {
            const normalizedWord = normalize(word).replace(/[^a-z0-9]/g, '');
            const reversedWord = normalizedWord.split('').reverse().join('');
    
        if (
                containsWordWithSkippedChars(normalizedInput, normalizedWord) ||
                containsWordWithSkippedChars(normalizedInput, reversedWord) ||
                normalizedInput.includes(normalizedWord) ||
                normalizedInput.includes(reversedWord) ||
                isSimilarWord(normalizedInput, normalizedWord)
         ) {
                blackCounter++;
                reakcja();
                return true; // Znaleziono słowo z listy
            }
    
            const similarityPercentage = getSimilarityPercentage(normalizedInput, normalizedWord);
    
            if (similarityPercentage >= 50 && similarityPercentage <= 55) {
                blackCounter++;
                reakcja();
                return true; // Znaleziono częściowe dopasowanie
            }
    
            if (isSimilarWord(normalizedInput, normalizedWord)) {
                blackCounter++;
                reakcja();
                return true;
            }
    
            if (
                normalizedInput.indexOf(normalizedWord) !== -1 ||
                normalizedInput.indexOf(reversedWord) !== -1
            ) {
                blackCounter++;
                reakcja();
                return true;
            }
        }
    
        return false;
    };
    
    card.addEventListener('click', (event) => {
        if (
            event.target === nameInput ||
            event.target === addNameButton ||
            event.target === checkbox ||
            event.target.parentElement === checkbox.parentElement ||
            event.target.closest('img')
        ) {
            return;
        }
        card.classList.toggle('flipped');
    });

    minimalCheckmark.addEventListener('click', (event) => {
        event.stopPropagation();
        checkbox.checked = !checkbox.checked;
    });

    label.addEventListener('click', (event) => {
        if (event.target !== minimalCheckmark) {
            event.preventDefault();
        }
    });

    const addName = (name) => {
        if (reakcjaOn && checkInputAndIncrement(name, black)) {
            return;
        }

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

        const allowRepeats = checkbox.checked;

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

        card.classList.remove('flipped'); // Obrót na przód
        if(reakcjaOn){
            if(checkInputAndIncrement(selectedName, black)){
                //blackCounter--;
                alert("Ojoj! Wylosowałeś zbanowane imię! \nSkontaktuj się z Oliwierem w celu pomocy")
                return;
            }
        }
        card.querySelector('.front').textContent = selectedName;
    });

    footer.addEventListener("click", () => {
        reakcjaOn = !reakcjaOn;
        document.getElementById("footer").innerHTML = reakcjaOn ? On : Off;
    });

    const reakcja = () => {
        if (blackCounter === 1) {
            alert("ACCESS DENIED");
        } else if (blackCounter > 1 && blackCounter <= 4) {
            let video = document.getElementById("video");
            if (!video) {
                video = document.createElement('video');
                video.src = 'access_denied.mp4';
                video.controls = false;
                video.autoplay = true;
                video.addEventListener('ended', () => {
                    container.innerHTML = '';
                });
                container.appendChild(video);
            }
        } else if (blackCounter > 4) {
            const createGif = () => {
                const gif = document.createElement('img');
                gif.src = 'rage.gif';
                gif.classList.add('gif');
                gifConteiner.appendChild(gif);
                gif.addEventListener('click', () => gif.remove());
                gifConteiner.classList.add('active');
            };

            if (blackCounter === 5) alert("AAAAAAAA!!!");
            createGif();
        }
    };
});
