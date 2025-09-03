const gameArea = document.getElementById('gameArea');
const startButton = document.getElementById('startButton');
const targetLetter = document.getElementById('targetLetter');
const messageDisplay = document.getElementById('message');
const gameOverScreen = document.getElementById('gameOverScreen');
const gameOverMessage = document.getElementById('gameOverMessage');
const restartButton = document.getElementById('restartButton');
const levelDisplay = document.getElementById('levelDisplay');
const lastReactionTimeDisplay = document.getElementById('lastReactionTime');

let gameStarted = false;
let timeoutId;
let reactionTimerStart;
let currentLevel = 1;
const baseReactionTime = 1000; // Başlangıç refleks süresi (ms)
const levelSpeedMultiplier = 0.9; // Her seviyede sürenin çarpılacağı oran

function getRandomLetter() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return alphabet[Math.floor(Math.random() * alphabet.length)];
}

function startGame() {
    gameStarted = true;
    currentLevel = 1;
    levelDisplay.textContent = currentLevel;
    lastReactionTimeDisplay.textContent = '0';
    startButton.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    messageDisplay.classList.remove('hidden'); // "Hazırlan..." mesajını göster
    targetLetter.classList.add('hidden');
    
    setTimeout(prepareRound, 2000); // 2 saniye sonra ilk raundu başlat
}

function prepareRound() {
    messageDisplay.classList.add('hidden'); // "Hazırlan..." mesajını gizle
    targetLetter.classList.remove('hidden');
    
    const letter = getRandomLetter();
    targetLetter.textContent = letter;
    
    // Tıklanacak harfi belirle ve tıklama olayını ekle
    targetLetter.dataset.letter = letter; // Hangi harf olduğunu kaydet
    targetLetter.onclick = playerShot; // Tıklama olayını bağla
    
    reactionTimerStart = Date.now();
    
    // Mevcut seviyeye göre refleks süresini hesapla
    const currentReactionTime = baseReactionTime * Math.pow(levelSpeedMultiplier, currentLevel - 1);
    
    timeoutId = setTimeout(cowboyShot, currentReactionTime); // Süre sonunda kovboy vurur
}

function playerShot() {
    if (!gameStarted || targetLetter.classList.contains('hidden')) return; // Oyun başlamadıysa veya harf gizliyse işlem yapma

    clearTimeout(timeoutId); // Kovboyun vurma zamanlayıcısını iptal et
    const reactionTime = Date.now() - reactionTimerStart;
    lastReactionTimeDisplay.textContent = reactionTime;

    targetLetter.classList.add('hidden');
    messageDisplay.textContent = 'SEN VURDUN!';
    messageDisplay.classList.remove('hidden');
    
    // Oyuncu kazandı, bir sonraki seviyeye geç
    currentLevel++;
    levelDisplay.textContent = currentLevel;

    setTimeout(() => {
        messageDisplay.classList.add('hidden');
        messageDisplay.textContent = 'Hazırlan...'; // Bir sonraki tur için mesajı sıfırla
        setTimeout(prepareRound, 1500); // Biraz bekleyip yeni turu başlat
    }, 1000); // "SEN VURDUN!" mesajını 1 saniye göster
}

function cowboyShot() {
    gameStarted = false;
    targetLetter.classList.add('hidden');
    messageDisplay.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
    gameOverMessage.textContent = `Kovboy seni vurdu! Seviye ${currentLevel}'de Game Over. Son refleks süren: ${lastReactionTimeDisplay.textContent} ms.`;
}

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

// Ekranın herhangi bir yerine tıklanınca Game Over olması (eğer harf görünmüyorsa)
gameArea.addEventListener('click', (event) => {
    if (gameStarted && !targetLetter.classList.contains('hidden') && event.target !== targetLetter) {
        // Eğer oyun başladıysa, harf görünüyorsa ama harfe değil de başka bir yere tıklandıysa
        clearTimeout(timeoutId);
        cowboyShot();
        gameOverMessage.textContent = `Yanlış yere tıkladın! Kovboy seni vurdu. Seviye ${currentLevel}'de Game Over.`;
    }
});

// Klavye tuşları ile oynama ekleme (isteğe bağlı ama refleks oyunu için iyi olur)
document.addEventListener('keydown', (event) => {
    if (gameStarted && !targetLetter.classList.contains('hidden') && event.key.toUpperCase() === targetLetter.dataset.letter) {
        playerShot();
    } else if (gameStarted && !targetLetter.classList.contains('hidden') && event.key.toUpperCase() !== targetLetter.dataset.letter) {
        // Yanlış tuşa basılırsa Game Over
        clearTimeout(timeoutId);
        cowboyShot();
        gameOverMessage.textContent = `Yanlış tuşa (${event.key.toUpperCase()}) bastın! Kovboy seni vurdu. Seviye ${currentLevel}'de Game Over.`;
    }
});