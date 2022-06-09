const tiles = document.querySelector(".tiles")
const keyboard = document.querySelector(".keyboard");
const messageDisplay = document.querySelector(".game-message")

let currentRow = 0;
let currentTile = 0;
let isGameOver = false;
let port = 3000 

let wordle;

const getWordle = () => {
    fetch(`https://wardle-app.herokuapp.com/word`)
        .then(response => response.json())
        .then(json => {
            wordle = json.toUpperCase()
        })
        .catch(err => console.log(err))
}

getWordle()

const keys = [
    'Q',
    'W',
    'E',
    'R',
    'T',
    'Y',
    'U',
    'I',
    'O',
    'P',
    'A',
    'S',
    'D',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    'ENTER',
    'Z',
    'X',
    'C',
    'V',
    'B',
    'N',
    'M',
    'DEL',
]

// Add another row and column here for 6 or 7 letter word game of Wordle
const guessTiles = [
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""]
]

//Adding tiles to the board in the form of divs and setting each tile with a unique class
guessTiles.forEach((guessRow, guessRowIndex) => {
    const rowElement = document.createElement('div')
    rowElement.setAttribute('id', "guessRow-" + guessRowIndex)
    guessRow.forEach((guess, guessIndex) => {
        const tileElement = document.createElement('div')
        tileElement.setAttribute('id', 'guessRow-' + guessRowIndex + '-tile-' + guessIndex);
        tileElement.classList.add('tile')
        rowElement.append(tileElement);
    })
    tiles.append(rowElement)
})

// Keys for the keyboard as buttons with event listener
keys.forEach(key => {
    const buttonElement = document.createElement('button');
    buttonElement.innerHTML = key;
    buttonElement.setAttribute("id", key)
    buttonElement.addEventListener("click", () => handleClick(key))
    keyboard.append(buttonElement);
})

//Adding a letter clicked from the keyboard to the tile display
const handleClick = (key) => {
    if (!isGameOver) {
        if (key === "DEL") {
            deleteLetter()
            return
        }
        if (key === "ENTER") {
            checkRow()
            return
        }
        addLetter(key)

    }
}

//Adds letter to the tiles, currentTile ++ to move to the next tile
//If statement to check that there are still tiles that letters can be added to 
const addLetter = (letter) => {
    if (currentTile < 5 && currentRow < 6) {
        const tile = document.getElementById('guessRow-' + currentRow + "-tile-" + currentTile)
        tile.textContent = letter;
        guessTiles[currentRow][currentTile] = letter
        tile.setAttribute('data', letter)
        currentTile++;
    }
}

// Function to delete a letter from the row
const deleteLetter = () => {
    if (currentTile > 0) {
        currentTile--;
        const tile = document.getElementById('guessRow-' + currentRow + "-tile-" + currentTile)
        tile.innerHTML = ''
        guessTiles[currentRow][currentTile] = ''
        tile.setAttribute('data', '')
    }
}

// Executed after clicking ENTER, checks the word aaginst Dictionary API and the wordle answer
const checkRow = () => {
    const guess = guessTiles[currentRow].join("")

    if (currentTile > 4) {
        fetch(`http://localhost:3000/check/?word=${guess}`)
            .then(response => response.json())
            .then(json => {
                if (json == 'Entry word not found') {
                    showMessage("Word is invalid! Please try again")
                    return
                } else {
                    console.log("guess is " + guess, "wordle is " + wordle)
                    wordGuess()
                    if (wordle === guess) {
                        showMessage("Congratulations you guessed the right word! Refresh the page to play again")
                        isGameOver = true;
                        return
                    } else {
                        if (currentRow >= 5) {
                            isGameOver = true;
                            showMessage("Game Over! You have ran out of guesses");
                            return
                        } else if (currentRow < 5) {
                            currentRow++;
                            currentTile = 0;
                        }
                    }

                }
            }).catch(err => console.log(err))
    }
}

// Function to display game messages
const showMessage = (message) => {
    const gameMessage = document.querySelector(".game-message")
    gameMessage.style.backgroundColor = "rgb(185, 180, 180)";
    gameMessage.innerHTML = message
    messageElement.textContent = message
    messageDisplay.append(messageElement)
}

//changes color of the keyboard keys
const addColorToKey = (keyLetter, color) => {
    const key = document.getElementById(keyLetter)
    key.classList.add(color)
    key.style.color = "white"
}

//Checks the word and displays the tiles colors corresponding to their positions and colors the keyboard
const wordGuess = () => {
    const rowTiles = document.querySelector('#guessRow-' + currentRow).childNodes
    let checkWordle = wordle
    const guess = []

    rowTiles.forEach(tile => {
        guess.push({ letter: tile.getAttribute('data'), color: 'grey-tile' })
    })

    guess.forEach((guess, index) => {
        if (guess.letter == wordle[index]) {
            guess.color = 'green-tile'
            checkWordle = checkWordle.replace(guess.letter, '')
        }
    })

    guess.forEach(guess => {
        if (checkWordle.includes(guess.letter)) {
            guess.color = 'yellow-tile'
            checkWordle = checkWordle.replace(guess.letter, '')
        }
    })

    rowTiles.forEach((tile, index) => {
        setTimeout(() => {
            tile.classList.add('flip')
            tile.classList.add(guess[index].color)
            addColorToKey(guess[index].letter, guess[index].color)
        }, 500 * index)
    })
}