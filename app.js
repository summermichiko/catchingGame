$(document).ready(function() {

	var app = $('.surveySurge'),
		canvas = document.getElementById('canvas'),
		context = canvas.getContext("2d"),

		// game variables
		startingScore = 0,
		continueAnimating = false,
		score,
		int,

		// wufooSaurus variables
		wufooSaurus = {
			width: 145,
			height: 158,
			x: 30,
			y: canvas.height - 158,
			wufooSaurusSpeed: 13
		},

		// survey variables
		surveyWidth = 45,
		surveyHeight = 65,
		totalSurveys = 7,
		surveys = [],

		helper = {
			addSurvey: function() {
				var survey = {
					width: surveyWidth,
					height: surveyHeight
				};
				helper.resetSurvey(survey);
				surveys.push(survey);
			},
			animate: function() {
				var sound;
				if (continueAnimating) {
					requestAnimationFrame(helper.animate);
				}
				helper.trackFallingSurveys();
				helper.drawAll();
			},
			bindClick: function(selector) {
				$(selector).on('click', function() {
					var instructionView = $(this).closest('.surgeView'),
						nextView;
					instructionView.hide();
					if ((selector.substring(0, 1)) == '#') {
						nextView = app.find('.surveyGame');
						nextView.show();
						helper.setGame();
						app.find('.mobileButtonWrapper').show();
					} else {
						var slicedStr = parseInt(selector.slice(selector.length-1));
						nextView = app.find('.instruction' + (slicedStr + 1));
						nextView.show();
					}
				});
			},
			drawAll: function() {
				helper.drawCanvas();
				helper.drawBackground();
				helper.drawWufooSaurus();
				helper.drawScore();
				helper.drawSurveys();
			},
			drawBackground: function() {
				context.fillStyle = '#fff';
				context.fillRect(0, 0, canvas.width, canvas.height);
			},
			drawCanvas: function() {
				context.clearRect(0, 0, canvas.width, canvas.height);
			},
			drawWufooSaurus: function() {
				var img = new Image();
				img.src = 'assets/wufooSaurus.png';
				function drawDino() {
					context.drawImage(img, wufooSaurus.x, wufooSaurus.y-10);
				}
				function init() {
					drawDino();
				}
				init();
			},
			drawScore: function() {
				if($(window).width > 768) {
					context.font = "14px 'Press Start 2P'";
					context.fillStyle = "#000";
					context.fillText("Score:" + score, 15, 30);
				} else {
					context.font = "24px 'Press Start 2P'";
					context.fillStyle = "#000";
					context.fillText("Score:" + score, 25, 40);
				}
			},
			drawSurveys: function() {
				for (var i = 0; i < surveys.length; i++) {
					var survey = surveys[i];
					helper.generateSurvey(survey);
				}
			},
			generateSurvey: function(survey) {
				var icon = new Image();
				icon.src = 'assets/surveyIcon.png';
				function drawOneSurvey() {
					context.drawImage(icon, survey.x, survey.y, survey.width, survey.height);
				}
				function init() {
					drawOneSurvey();
				}
				init();
			},
			isColliding: function(a, b) {
				return !(b.x > a.x + a.width || b.x + b.width < a.x || b.y > a.y + a.height || b.y + b.height < a.y);
			},
			logMiss: function() {
				continueAnimating = false;
				$('#surveyModal').modal({
					// backdrop: 'static',
					// keyboard: false
				});
			},
			moveLeft: function() {
				wufooSaurus.x -= wufooSaurus.wufooSaurusSpeed;
				if (wufooSaurus.x <= 0) {
					wufooSaurus.x = 0;
				}
			},
			moveRight: function() {
				wufooSaurus.x += wufooSaurus.wufooSaurusSpeed;
				var widthAmount = canvas.width - wufooSaurus.width;
				if (wufooSaurus.x >= widthAmount) {
					wufooSaurus.x = widthAmount;
				}
			},
			resetSurvey: function(survey) {
				survey.x = Math.random() * (canvas.width - surveyWidth);
				survey.y = 40 + Math.random() * 30;
				survey.speed = (0.55 + Math.random()) * 0.9;
			},
			setGame: function() {
				score = startingScore;
				wufooSaurus.x = 30;
				xArr = [];
				for (var i = 0; i < surveys.length; i++) {
					helper.resetSurvey(surveys[i]);
				}
				if (!continueAnimating) {
					continueAnimating = true;
					helper.animate();
				}
			},
			trackFallingSurveys: function() {
				for (var i = 0; i < surveys.length; i++) {
					var survey = surveys[i];
					if (helper.isColliding(survey, wufooSaurus)) {
						sound = new Audio("audio/coinSound.mp3");
						sound.play();
						score += 5;
						helper.resetSurvey(survey);
					}
					survey.y += survey.speed;
					// if the survey is below the canvas,
					if (survey.y > canvas.height) {
						sound = new Audio("audio/buzzerSound.mp3");
						sound.play();
						helper.logMiss();
					}
				}
			}
		};

	app.find('.instruction1').show();
	app.find('.mobileButtonWrapper').hide();

	for (var i = 0; i < totalSurveys; i++) {
		helper.addSurvey();
	}

	helper.bindClick('.button1');
	helper.bindClick('.button2');
	helper.bindClick('#start');

	// arrows for desktop
	document.onkeydown = function (event) {
		if (event.keyCode == 39) {
			helper.moveRight();
		} else if (event.keyCode == 37) {
			helper.moveLeft();
		}
	};

	// buttons for mobile
	app.find('.mobileRight').on('touchstart mousedown', function(e) {
		e.preventDefault();
		int = setInterval(helper.moveRight, 100);
	}).bind('mouseup', function() {
		clearInterval(int);
	});
	app.find('.mobileLeft').on('touchstart mousedown', function(e) {
		e.preventDefault();
		int = setInterval(helper.moveLeft, 100);
	}).bind('mouseup', function() {
		clearInterval(int);
	});

	app.on('click', '.playAgainButton', function() {
		$('#surveyModal').modal('hide');
		helper.setGame();
	});

	app.on('click', '.toPortfolioButton', function() {
		window.open('http://summermcdonald.me/', '_blank');
	});
});