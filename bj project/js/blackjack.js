// messages
const headerEl = document.querySelector('.header')
const cardsEl = document.querySelector('.cards-el')
const sumEl = document.querySelector('.sum-el')
const gamerEl = document.querySelector('.gamer')

const dealerCards = document.querySelector('.dealer-cards')
const dealerSum = document.querySelector('.dealer-sum')

const betMessage = document.querySelector('.bet-message')

// INGAME BTNS
const startBtn = document.querySelector('.start')
const hitBtn = document.querySelector('.new-card')
const standBtn = document.querySelector('.finish-round')

//  enter
const form = document.querySelector('.form')
const saveInfo = document.querySelector('.save-info')

//   player info
const nameEl = document.querySelector('.player-name')
const surnameEl = document.querySelector('.player-surname')
const moneyEl = document.querySelector('.player-money')
const playerFullName = document.querySelector('.player-full-name')
const playerBank = document.querySelector('.player-bank')

//gamestart logic
const changeToRegister = document.querySelector('.gamestart-btn')
const loginForm = document.querySelector('.login-form')
const newGame = document.querySelector('.new-game')
const loadGame = document.querySelector('.load-game')

// bet btns
const valueBtn1 = document.querySelector('.bet-button-1')
const valueBtn2 = document.querySelector('.bet-button-2')
const valueBtn3 = document.querySelector('.bet-button-5')
const valueBtn4 = document.querySelector('.bet-button-10')
const valueBtn5 = document.querySelector('.bet-button-50')
const valueBtn6 = document.querySelector('.bet-button-100')
const valueBtn7 = document.querySelector('.bet-button-500')
const valueBtn8 = document.querySelector('.bet-button-1000')
const valueBtn9 = document.querySelector('.bet-button-5000')
const valueBtn10 = document.querySelector('.bet-button-10000')
const valueBtn11 = document.querySelector('.bet-button-50000')

let allCArds = []
let dealerAllCards = []
let cardSum = 0
let dealerCardSum = 0
let hasBlackjack = false
let isAlive = false
let dealerIsAlive = false

let standIsClicked = false
let gameOver = true
let standIsActive = true
let gameLost = false

let betSum = 0
let personalData = {}

//                     login  action
newGame.addEventListener('click', function () {
  changeToRegister.style.display = 'none'
  loginForm.style.display = 'flex'
})
function savePayerInfo() {
  let playerInfo = JSON.stringify(personalData)
  localStorage.setItem('player', playerInfo)
}

saveInfo.addEventListener('click', function () {
  if (nameEl.value === '' || surnameEl.value === '' || moneyEl.value === '') {
    alert('pleace fill all inuts')
  } else {
    form.style.display = 'none'
    personalData.name = nameEl.value
    personalData.surname = surnameEl.value
    personalData.money = moneyEl.value

    playerFullName.textContent = `${personalData.name} ${personalData.surname}`
    playerBank.textContent = `bank: ${personalData.money}$`
    savePayerInfo()
    checkMoney()
  }
})

loadGame.addEventListener('click', function () {
  if (localStorage.getItem('player')) {
    form.style.display = 'none'
    let playerInfo = localStorage.getItem('player')
    personalData = JSON.parse(playerInfo)

    playerFullName.textContent = `${personalData.name} ${personalData.surname}`
    playerBank.textContent = `bank: ${personalData.money}$`
    checkMoney()
  }
})

/////////  rand number
function getRandNumb() {
  let ricxvi = Math.floor(Math.random() * 13) + 1
  if (ricxvi === 1) {
    return 11
  } else if (ricxvi > 10) {
    return 10
  } else {
    return ricxvi
  }
}

/////////   check game status
function checkGameStatus() {
  if (cardSum < 21) {
    headerEl.textContent = 'still wanna new card?'
  } else if (cardSum === 21) {
    // headerEl.textContent = 'congratulations you have the blackjack'
    hasBlackjack = true
  } else {
    // headerEl.textContent = 'you loose'
    isAlive = false
  }
}

function game() {
  if (isAlive === false) {
    gameOver = true
  } else if (hasBlackjack) {
    gameOver = true
  } else if (standIsClicked) {
    gameOver = true
  }
}

//      RENDER  player
function rendergame() {
  let newCard = ''
  for (i = 0; i < allCArds.length; i++) {
    newCard += `${allCArds[i]}, `
  }
  cardsEl.textContent = `cards: ${newCard}`
  sumEl.textContent = `sum: ${cardSum}`
  checkGameStatus()
  game()
  winOrLoose()
}
////   render dealer
function renderdealer() {
  let dealerCard = ''
  for (i = 0; i < dealerAllCards.length; i++) {
    dealerCard += `${dealerAllCards[i]}, `
  }
  dealerCards.textContent = `cards: *, ${dealerCard}`
  dealerSum.textContent = `sum: ${dealerCardSum}`
}

//   START BTN
startBtn.addEventListener('click', function gameStart() {
  let personalMoney = Number(personalData.money)
  if (personalMoney <= 0) {
    alert(' you dont have enough money to play sell your house first')
  } else if (betSum <= 0) {
    alert('you must bet first')
  } else if (personalMoney < betSum) {
    headerEl.textContent = 'you dont have that much money'
    betSum = 0
    betMessage.textContent = `you bet: ${betSum}$`
  } else {
    if (gameOver === true) {
      gameOver = false
      standIsClicked = false
      standIsActive = true
      isAlive = true
      dealerIsAlive = true
      hasBlackjack = false

      let firsrCard = getRandNumb()
      let secondCard = getRandNumb()

      allCArds = [firsrCard, secondCard]
      cardSum = firsrCard + secondCard
      if (cardSum >= 21) {
        gameStart()
      }
      let dealerFCard = getRandNumb()
      dealerAllCards = [dealerFCard]
      dealerCardSum = dealerFCard
      rendergame()
      renderdealer()
    }
  }
  checkMoney()
})

//  HIT BTN
hitBtn.addEventListener('click', function () {
  if (isAlive && hasBlackjack === false && standIsClicked === false) {
    let newCard = getRandNumb()
    allCArds.push(newCard)
    cardSum += newCard
    rendergame()
  }
})

// STAND BTN
standBtn.addEventListener('click', function () {
  standIsClicked = true
  if (standIsActive && hasBlackjack === false && isAlive) {
    standIsActive = false

    addDealerScard()
    renderDealerGame()
    rendergame()
  }
})

/// dealers second card
function addDealerScard() {
  let dealerCard = ''
  dealerCardSum = 0
  const dealerSCard = getRandNumb()
  while (dealerAllCards.length < 2) {
    dealerAllCards.unshift(dealerSCard)
  }
  for (i = 0; i < dealerAllCards.length; i++) {
    dealerCard += dealerAllCards[i] + ', '
    dealerCardSum += dealerAllCards[i]
  }
  dealerCards.textContent = `cards: ${dealerCard}`
  dealerSum.textContent = `sum: ${dealerCardSum}`
}

//    dealers game

function renderDealerGame() {
  if (dealerCardSum < 15) {
    do {
      dealerAllCards.push(getRandNumb())
      dealerNewCard()
    } while (dealerCardSum < 15)
  } else {
    dealerNewCard()
  }
}
function dealerNewCard() {
  let dealerCard = ''
  dealerCardSum = 0
  for (i = 0; i < dealerAllCards.length; i++) {
    dealerCard += dealerAllCards[i] + ', '
    dealerCardSum += dealerAllCards[i]
  }
  dealerCards.textContent = `cards: ${dealerCard}`
  dealerSum.textContent = `sum: ${dealerCardSum}`
  if (dealerCardSum > 21) {
    dealerIsAlive = false
  }
}

//    winner or looser

function winOrLoose() {
  let money = Number(personalData.money)

  personalData.money = money
  localStorage.setItem('player', JSON.stringify(personalData))

  if (standIsClicked) {
    if (isAlive) {
      if (dealerIsAlive) {
        ///                                            wins thaw whos card sum is more
        if (cardSum > dealerCardSum) {
          headerEl.textContent = 'you won the game'
          money += betSum
          gameOver = true
        } else if (cardSum === dealerCardSum) {
          headerEl.textContent = 'Draw'
          gameOver = true
        } else {
          headerEl.textContent = 'dealer wins'
          money -= betSum
          gameOver = true
        }
      } else {
        headerEl.textContent = 'you won the game'
        money += betSum
        gameOver = true
      }
    }
  }
  /////////////   stand ended here
  if (isAlive === false && dealerIsAlive === false) {
    headerEl.textContent = 'Draw'
    gameOver = true
  }
  if (hasBlackjack) {
    headerEl.textContent = 'you won the game'
    money += betSum
    gameOver = true
  }
  if (isAlive === false) {
    if (dealerIsAlive) {
      headerEl.textContent = 'dealer wins'
      money -= betSum
      gameOver = true
    } else if (dealerIsAlive === false) {
      headerEl.textContent = 'Draw'
      gameOver = true
    }
  }

  if (gameOver) {
    addDealerScard()
    betSum = 0
    personalData.money = money
    localStorage.setItem('player', JSON.stringify(personalData))
    betMessage.textContent = `you bet: ${''}`
    playerBank.textContent = `bank: ${personalData.money}$`
  }
  checkMoney()
}

////    bet btns
//
function checkMoney() {
  let money = Number(personalData.money)

  console.log('checkmoney money =' + typeof money + money)
  if (money >= 50000 && money > 50000) {
    valueBtn1.style.display = 'block'
    valueBtn2.style.display = 'block'
    valueBtn3.style.display = 'block'
    valueBtn4.style.display = 'block'
    valueBtn5.style.display = 'block'
    valueBtn6.style.display = 'block'
    valueBtn7.style.display = 'block'
    valueBtn8.style.display = 'block'
    valueBtn9.style.display = 'block'
    valueBtn10.style.display = 'block'
    valueBtn11.style.display = 'block'
  } else if (money >= 10000 && money < 50000) {
    valueBtn1.style.display = 'block'
    valueBtn2.style.display = 'block'
    valueBtn3.style.display = 'block'
    valueBtn4.style.display = 'block'
    valueBtn5.style.display = 'block'
    valueBtn6.style.display = 'block'
    valueBtn7.style.display = 'block'
    valueBtn8.style.display = 'block'
    valueBtn9.style.display = 'block'
    valueBtn10.style.display = 'block'
    valueBtn11.style.display = 'none'
  } else if (money >= 5000 && money < 10000) {
    valueBtn1.style.display = 'block'
    valueBtn2.style.display = 'block'
    valueBtn3.style.display = 'block'
    valueBtn4.style.display = 'block'
    valueBtn5.style.display = 'block'
    valueBtn6.style.display = 'block'
    valueBtn7.style.display = 'block'
    valueBtn8.style.display = 'block'
    valueBtn9.style.display = 'block'
    valueBtn10.style.display = 'none'
    valueBtn11.style.display = 'none'
  } else if (money >= 1000 && money < 5000) {
    valueBtn1.style.display = 'block'
    valueBtn2.style.display = 'block'
    valueBtn3.style.display = 'block'
    valueBtn4.style.display = 'block'
    valueBtn5.style.display = 'block'
    valueBtn6.style.display = 'block'
    valueBtn7.style.display = 'block'
    valueBtn8.style.display = 'block'
    valueBtn9.style.display = 'none'
    valueBtn10.style.display = 'none'
    valueBtn11.style.display = 'none'
  } else if (money >= 500 && money < 1000) {
    valueBtn1.style.display = 'block'
    valueBtn2.style.display = 'block'
    valueBtn3.style.display = 'block'
    valueBtn4.style.display = 'block'
    valueBtn5.style.display = 'block'
    valueBtn6.style.display = 'block'
    valueBtn7.style.display = 'block'
    valueBtn8.style.display = 'none'
    valueBtn9.style.display = 'none'
    valueBtn10.style.display = 'none'
    valueBtn11.style.display = 'none'
  } else if (money >= 100 && money < 500) {
    valueBtn1.style.display = 'block'
    valueBtn2.style.display = 'block'
    valueBtn3.style.display = 'block'
    valueBtn4.style.display = 'block'
    valueBtn5.style.display = 'block'
    valueBtn6.style.display = 'block'
    valueBtn7.style.display = 'none'
    valueBtn8.style.display = 'none'
    valueBtn9.style.display = 'none'
    valueBtn10.style.display = 'none'
    valueBtn11.style.display = 'none'
  } else if (money >= 50 && money < 100) {
    valueBtn1.style.display = 'block'
    valueBtn2.style.display = 'block'
    valueBtn3.style.display = 'block'
    valueBtn4.style.display = 'block'
    valueBtn5.style.display = 'block'
    valueBtn6.style.display = 'none'
    valueBtn7.style.display = 'none'
    valueBtn8.style.display = 'none'
    valueBtn9.style.display = 'none'
    valueBtn10.style.display = 'none'
    valueBtn11.style.display = 'none'
  } else if (money >= 10 && money < 50) {
    valueBtn1.style.display = 'block'
    valueBtn2.style.display = 'block'
    valueBtn3.style.display = 'block'
    valueBtn4.style.display = 'block'
    valueBtn5.style.display = 'none'
    valueBtn6.style.display = 'none'
    valueBtn7.style.display = 'none'
    valueBtn8.style.display = 'none'
    valueBtn9.style.display = 'none'
    valueBtn10.style.display = 'none'
    valueBtn11.style.display = 'none'
  } else if (money >= 5 && money < 10) {
    valueBtn1.style.display = 'block'
    valueBtn2.style.display = 'block'
    valueBtn3.style.display = 'block'
    valueBtn4.style.display = 'none'
    valueBtn5.style.display = 'none'
    valueBtn6.style.display = 'none'
    valueBtn7.style.display = 'none'
    valueBtn8.style.display = 'none'
    valueBtn9.style.display = 'none'
    valueBtn10.style.display = 'none'
    valueBtn11.style.display = 'none'
  } else if (money >= 2 && money < 5) {
    valueBtn1.style.display = 'block'
    valueBtn2.style.display = 'block'
    valueBtn3.style.display = 'none'
    valueBtn4.style.display = 'none'
    valueBtn5.style.display = 'none'
    valueBtn6.style.display = 'none'
    valueBtn7.style.display = 'none'
    valueBtn8.style.display = 'none'
    valueBtn9.style.display = 'none'
    valueBtn10.style.display = 'none'
    valueBtn11.style.display = 'none'
  } else if (money >= 1 && money < 2) {
    valueBtn1.style.display = 'block'
    valueBtn2.style.display = 'none'
    valueBtn3.style.display = 'none'
    valueBtn4.style.display = 'none'
    valueBtn5.style.display = 'none'
    valueBtn6.style.display = 'none'
    valueBtn7.style.display = 'none'
    valueBtn8.style.display = 'none'
    valueBtn9.style.display = 'none'
    valueBtn10.style.display = 'none'
    valueBtn11.style.display = 'none'
  } else if (money < 1) {
    valueBtn1.style.display = 'none'
    valueBtn2.style.display = 'none'
    valueBtn3.style.display = 'none'
    valueBtn4.style.display = 'none'
    valueBtn5.style.display = 'none'
    valueBtn6.style.display = 'none'
    valueBtn7.style.display = 'none'
    valueBtn8.style.display = 'none'
    valueBtn9.style.display = 'none'
    valueBtn10.style.display = 'none'
    valueBtn11.style.display = 'none'
  }
}

//
//   betting system

function value1() {
  betSum += 1
  betMessage.textContent = `you bet: ${betSum}$`
}
function value2() {
  betSum += 2
  betMessage.textContent = `you bet: ${betSum}$`
}
function value3() {
  betSum += 5
  betMessage.textContent = `you bet: ${betSum}$`
}
function value4() {
  betSum += 10
  betMessage.textContent = `you bet: ${betSum}$`
}
function value5() {
  betSum += 50
  betMessage.textContent = `you bet: ${betSum}$`
}
function value6() {
  betSum += 100
  betMessage.textContent = `you bet: ${betSum}$`
}
function value7() {
  betSum += 500
  betMessage.textContent = `you bet: ${betSum}$`
}
function value8() {
  betSum += 1000
  betMessage.textContent = `you bet: ${betSum}$`
}
function value9() {
  betSum += 5000
  betMessage.textContent = `you bet: ${betSum}$`
}
function value10() {
  betSum += 10000
  betMessage.textContent = `you bet: ${betSum}$`
}
function value11() {
  betSum += 50000
  betMessage.textContent = `you bet: ${betSum}$`
}
