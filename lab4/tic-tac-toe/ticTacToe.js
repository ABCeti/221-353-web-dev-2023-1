document.addEventListener('DOMContentLoaded', function () {
    const board = document.getElementById('ticTacToeBoard');
    const resultMessage = document.getElementById('resultMessage');
    let currentPlayer = 'X';
    let boardState = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;

    // Создание ячеек игрового поля
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', handleCellClick);
        board.appendChild(cell);
    }

    function handleCellClick(event) {
        const clickedCell = event.target;
        const cellIndex = clickedCell.dataset.index;

        if (boardState[cellIndex] === '' && gameActive) {
            // Обновление состояния игрового поля
            boardState[cellIndex] = currentPlayer;
            clickedCell.textContent = currentPlayer;

            // Проверка на победителя
            if (checkWinner()) {
                resultMessage.textContent = `Игрок ${currentPlayer} победил!`;
                gameActive = false;
            } else if (checkDraw()) {
                resultMessage.textContent = 'Ничья!';
                gameActive = false;
            } else {
                // Смена текущего игрока
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            }
        }
    }

    function checkWinner() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Горизонтальные линии
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Вертикальные линии
            [0, 4, 8], [2, 4, 6]             // Диагонали
        ];

        return winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            return boardState[a] !== '' && boardState[a] === boardState[b] && boardState[b] === boardState[c];
        });
    }

    function checkDraw() {
        return boardState.every(cell => cell !== '');
    }
});
