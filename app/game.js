const LITTLE_PONNY = (function() {

    let instance;

    function LittlePonny() {

        const _game = {
            gameWidth: $("#game")[0].clientWidth,
            gameHeight: $("#game")[0].clientHeight,
            play: false,
            hitsForWin: 50,
            $hits: $("#hitsValue"),
            $lives: $("#livesValue"),
            $balls: $("#ballsValue")
        };

        const _player = {
            lives: 3,
            hits: 0,
        };

        const _gameKeys = {
            keyLeft: 37,
            keyRight: 39,
            keyUp: 38,
            keyDown: 40,
            keyMiddle: 32
        };

        const _balls = {
            ballsArr: ['first', 'second', 'third', 'fourth', 'fifth', 'sixth'],
            mainClass: 'ball',
            endClass: 'end',
            counter: 100,
            width: 0,
            height: 0,
            x: 0,
            y: 0,
            dom: 0
        };

        const _ponny = {
            width: 400,
            height: 400,
            firstX: -22,
            x: 0,
            y: 0,
            speed: 8,
            dom: $(".ponny"),
            upClass: 'up',
            middleClass: 'middle',
            downClass: 'down',
            mainClass: 'ponny',
            walkClass: 'walk',
            loseClass: 'lose',
            winClass: 'win'
        };

        const rules = `afffffffffff ffffffffffff ffffaaa aaaaaaaaaaaa`;

        let keyDownEvents = function(keyCode) {
            let ponny = _ponny.dom;

            if (keyCode === _gameKeys.keyUp) {
                ponny.removeClass()
                    .addClass(_ponny.mainClass)
                    .addClass(_ponny.upClass)
            }

            if (keyCode === _gameKeys.keyMiddle) {
                ponny.removeClass()
                    .addClass(_ponny.mainClass)
                    .addClass(_ponny.middleClass)
            }

            if (keyCode === _gameKeys.keyDown) {
                ponny.removeClass()
                    .addClass(_ponny.mainClass)
                    .addClass(_ponny.downClass)
            }

            if (keyCode === _gameKeys.keyLeft && ponny.position().left > _ponny.firstX) {
                _ponny.x -= _ponny.speed;
                ponny.css("left", (_ponny.x + 'px'));
            }

            if (keyCode === _gameKeys.keyRight && ponny.position().left + _ponny.width < $("#game")[0].clientWidth) {
                _ponny.x += _ponny.speed;
                ponny.css("left", (_ponny.x + 'px'));
            }

        }

        let keyUpEvents = function() {
            let ponny = _ponny.dom;
            ponny.removeClass()
                .addClass(_ponny.mainClass)
                .addClass(_ponny.walkClass)
        }

        let bindEvents = function() {
            $(document).keyup(function(event) {
                keyUpEvents();
            });

            $(document).keydown(function(event) {
                keyDownEvents(event.keyCode);
            });
        }

        let removeEvents = function() {

            $(document).off("keyup");

            $(document).off("keydown");
        }

        let getRandomBallClass = function() {
            let randomNumber = Math.floor(Math.random() * _balls.ballsArr.length);
            let randomClass = _balls.ballsArr[randomNumber];
            return randomClass;
        }

        let createBall = function() {
            let ball = $("<div></div>")
                .attr('id', 'ball')
                .addClass(getRandomBallClass())
                .addClass(_balls.mainClass)
                .appendTo("#game");
            return ball;
        }

        let randomBalls = function() {
            let intervalCreateBalls;

            if (intervalCreateBalls) {
                clearInterval(intervalCreateBalls);
            }

            intervalCreateBalls = setInterval(function() {
                if (!_game.play) {

                    return clearInterval(intervalCreateBalls);

                }

                _balls.counter--;
                let ball = createBall();

                $("#ball").animate({
                    left: 0,
                }, 1000);

            }, 3000);
        }

        let deleteBall = function() {
            let timeOut;
            let ball = $("#ball")[0]
            if (ball) {
                let ballPosition = $("#ball").position().left;
                if (ballPosition < 5) {
                    $("#ball").addClass(_balls.endClass);
                    if (timeOut) {
                        clearTimeout(timeOut);
                    }
                    timeOut = setTimeout(function() {
                        ball.remove();
                    }, 1000);
                }
            }
        }

        let updateInformation = function() {
            _game.$hits.html(_player.hits);
            _game.$lives.html(_player.lives);
            _game.$balls.html(_balls.counter);
        }

        let playAgain = function() {
            let timeOut
            if (timeOut) {
                clearTimeout(timeOut);
            }

            timeOut = setTimeout(function() {

                return location.reload();
            }, 5000);

        }

        let play = function() {
            $("#play").fadeOut();
            $("#playButton").fadeOut();
            $("#howToPlayButton").fadeOut();
            _game.play = true;
            gameLoop();
        }

        let removeRules = function() {
            if ($("#rules")) {
                $("#rules").remove();
            }
        }

        let howToPlay = function() {
            removeRules();
            div = $("<p></p>")
                .attr('id', 'rules')
                .html(rules)
                .click(function() {
                    removeRules();
                })
                .appendTo('#play');
        }

        let playScreen = function() {

            let background = $("<section></section>")
                .attr('id', 'play')
                .appendTo("body");

            let playButton = $("<input></input>")
                .attr('id', 'playButton')
                .attr('type', 'button')
                .val('play')
                .click(function() {
                    play();
                })
                .appendTo("body");

            let howToPlayButton = $("<input></input>")
                .attr('id', 'howToPlayButton')
                .attr('type', 'button')
                .val('how to play')
                .click(function() {
                    howToPlay();
                })
                .appendTo("body");
        }

        let win = function() {
            _balls.dom.remove();

            $("#game").addClass('win');

            _ponny.dom.removeClass()
                .addClass(_ponny.mainClass)
                .addClass(_ponny.winClass);
        }

        let lose = function() {
            _ponny.dom.removeClass()
                .addClass(_ponny.mainClass)
                .addClass(_ponny.loseClass);

            let section = $("<section></section>")
                .addClass('background')
                .addClass('lose')
                .appendTo('main');
        }

        let checkForWin = function() {
            let div;

            if (_player.hits <= _game.hitsForWin && (_balls.counter + _player.hits) < _game.hitsForWin) {

                div = $("<div></div>")
                    .attr('id', 'alert')
                    .html('Congratulations! \n You win')
                    .appendTo('#game');
                _game.play = false;
                return win();
            }

            if (_player.hits > _game.hitsForWin) {
                div = $("<div></div>")
                    .attr('id', 'alert')
                    .html('You lose! \n Maybe Next Time!')
                    .appendTo('#game');
                _game.play = false;
                return lose();
            }
        }

        let checkForCollision = function() {
            _balls.dom = $("#ball");
            _ponny.dom = $(".ponny");
            let interval;

            if (!_balls.dom[0]) {
                return false;
            }

            _ponny.x = _ponny.dom.offset().left;
            _ponny.y = _ponny.dom.offset().top;
            _ponny.height = _ponny.dom.outerHeight(true);
            _ponny.width = _ponny.dom.outerWidth(true);
            let ponnyHeight = _ponny.y + _ponny.height;
            let ponnyWidth = _ponny.x + _ponny.width;
            _balls.x = _balls.dom.offset().left;
            _balls.y = _balls.dom.offset().top;
            _balls.height = _balls.dom.outerHeight(true);
            _balls.width = _balls.dom.outerWidth(true);
            let ballHeight = _balls.y + _balls.height;
            let ballWidth = _balls.x + _balls.width;

            if (ponnyHeight < ballHeight || _ponny.y > ballHeight || ponnyWidth < _balls.x || _ponny.x > ballWidth || _balls.x <= 3) {
                return false;
            }
            _ponny.dom.fadeTo(100, 0.5);
            if (interval) {
                clearTimeout(interval);
            }

            interval = setTimeout(function() {
                _ponny.dom.fadeTo(100, 1);
            }, 200);
            _balls.dom.remove()
            _player.hits++;
        }

        let gameLoop = function() {
            deleteBall();
            updateInformation();
            checkForCollision();
            checkForWin();
            if (!_game.play) {
                removeEvents();
                playAgain();
            }
            if (_game.play) {
                requestAnimationFrame(gameLoop);
            }
        };

        return {
            init: function() {
                playScreen()
                bindEvents();
                randomBalls();
            }
        };
    }

    return {
        getInstance: function() {

            if (!instance) {
                instance = new LittlePonny();
            }

            return instance;
        }
    };

})();
