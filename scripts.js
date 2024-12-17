(() => {
    'use strict';

    const board = document.getElementById("game-board");
    const scoreBoard = document.getElementById("score-board");
    const restartButton = document.getElementById("restart-button");

    const initialGridSize = 20; // 초기 맵 크기
    const maxGridSize = 50; // 최대 맵 크기 제한
    const cellSize = 20; // 셀 크기(px)
    const initialSpeed = 300; // 초기 속도(ms)
    let snake = [];
    let food = [];
    let direction = { x: 0, y: 0 }; // 초기 방향
    let nextDirection = { x: 0, y: 0 }; // 키 입력 방향
    let gameInterval;
    let gridSize;
    let speed;
    let score;

    // 점수 업데이트
    function updateScore() {
        scoreBoard.textContent = `점수: ${score}`;
    }

    // 게임 보드 크기 설정
    function setGridSize(size) {
        gridSize = size;
        board.style.gridTemplateRows = `repeat(${gridSize}, ${cellSize}px)`;
        board.style.gridTemplateColumns = `repeat(${gridSize}, ${cellSize}px)`;
    }

    // 점수에 따른 맵 크기 증가
    function increaseGridSize() {
        if (gridSize < maxGridSize) {
            gridSize = Math.min(maxGridSize, gridSize + 10); // 10x10씩 증가
            setGridSize(gridSize);
        }
    }

    // 음식 생성
    function generateFood() {
        while (food.length < 2) {
            const newFood = {
                x: Math.floor(Math.random() * gridSize) + 1,
                y: Math.floor(Math.random() * gridSize) + 1
            };

            if (!snake.some(s => s.x === newFood.x && s.y === newFood.y)) {
                food.push(newFood);
            }
        }
    }

    // 음식 렌더링
    function renderFood() {
        food.forEach(f => {
            const foodElement = document.createElement("div");
            foodElement.style.gridRowStart = f.y;
            foodElement.style.gridColumnStart = f.x;
            foodElement.classList.add("food");
            board.appendChild(foodElement);
        });
    }

    // 뱀 렌더링
    function renderSnake() {
        snake.forEach(segment => {
            const snakeElement = document.createElement("div");
            snakeElement.style.gridRowStart = segment.y;
            snakeElement.style.gridColumnStart = segment.x;
            snakeElement.classList.add("snake");
            board.appendChild(snakeElement);
        });
    }

    // 뱀 이동
    function moveSnake() {
        direction = { ...nextDirection };
        const head = snake[0];
        const newHead = { x: head.x + direction.x, y: head.y + direction.y };

        snake.unshift(newHead);

        // 음식 먹기
        const foodIndex = food.findIndex(f => f.x === newHead.x && f.y === newHead.y);
        if (foodIndex >= 0) {
            score += 10;
            updateScore();
            food.splice(foodIndex, 1);
            generateFood();

            // 점수에 따른 속도 증가 및 맵 크기 증가
            if (score % 50 === 0) increaseGridSize(); // 점수 50 단위로 맵 크기 증가
            speed = Math.max(10, speed - 25); // 속도 증가
            restartGameLoop();
        } else {
            snake.pop();
        }

        // 충돌 확인
        if (checkCollision()) {
            clearInterval(gameInterval);
            restartButton.style.display = "block";
            alert("게임 오버!");
        }
    }

    // 충돌 검사
    function checkCollision() {
        const head = snake[0];
        // 벽 충돌
        if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) return true;
        // 몸과 충돌
        for (let i = 1; i < snake.length; i++) {
            if (snake[i].x === head.x && snake[i].y === head.y) return true;
        }
        return false;
    }

    // 키보드 방향 입력
    window.addEventListener("keydown", e => {
        switch (e.key) {
            case "w":
                if (direction.y !== 1) nextDirection = { x: 0, y: -1 };
                break;
            case "s":
                if (direction.y !== -1) nextDirection = { x: 0, y: 1 };
                break;
            case "a":
                if (direction.x !== 1) nextDirection = { x: -1, y: 0 };
                break;
            case "d":
                if (direction.x !== -1) nextDirection = { x: 1, y: 0 };
                break;
        }
    });

    // 게임 루프 재시작
    function restartGameLoop() {
        clearInterval(gameInterval);
        gameInterval = setInterval(() => {
            moveSnake();
            board.innerHTML = "";
            renderFood();
            renderSnake();
        }, speed);
    }

    // 게임 초기화 및 시작
    function startGame() {
        setGridSize(initialGridSize);
        snake = [{ x: initialGridSize / 2, y: initialGridSize / 2 }];
        food = [];
        direction = { x: 0, y: 0 };
        nextDirection = { x: 0, y: 0 };
        score = 0;
        speed = initialSpeed;
        updateScore();
        generateFood();
        restartButton.style.display = "none";
        restartGameLoop();
    }

    restartButton.addEventListener("click", startGame);
    startGame();
})();
