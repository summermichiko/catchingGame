$(document).ready(function() {

	var app = $('.surveySurge'),
		canvas = document.getElementById('canvas'),
		context = canvas.getContext("2d"),

		// game variables
		startingScore = 0,
		continueAnimating = false,
		score,

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
				context.font = "14px 'Press Start 2P'";
				context.fillStyle = "#000";
				context.fillText("Score:" + score, 15, 30);
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
					backdrop: 'static',
					keyboard: false
				});
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

	//left and right keypush event handlers
	document.onkeydown = function (event) {
		if (event.keyCode == 39) {
			wufooSaurus.x += wufooSaurus.wufooSaurusSpeed;
			if (wufooSaurus.x >= canvas.width - wufooSaurus.width) {
				wufooSaurus.x = canvas.width - wufooSaurus.width;
			}
		} else if (event.keyCode == 37) {
			wufooSaurus.x -= wufooSaurus.wufooSaurusSpeed;
			if (wufooSaurus.x <= 0) {
				wufooSaurus.x = 0;
			}
		}
	};

	app.find('.instruction1').show();
	for (var i = 0; i < totalSurveys; i++) {
		helper.addSurvey();
	}

	app.on('click', '.button1', function() {
		var instructionView = $(this).closest('.surgeView');
		var nextView = app.find('.instruction2');
		instructionView.hide();
		nextView.show();
	});
	app.on('click', '.button2', function() {
		var instructionView = $(this).closest('.surgeView');
		var nextView = app.find('.instruction3');
		instructionView.hide();
		nextView.show();
	});

	app.on('click', '#start', function() {
		var instructionView = $(this).closest('.surgeView');
		var nextView = app.find('.surveyGame');
		instructionView.hide();
		nextView.show();
		helper.setGame();

	});

	app.on('click', '.playAgainButton', function() {
		$('#surveyModal').modal('hide');
		helper.setGame();
	});
	app.on('click', '.toPortfolioButton', function() {
		window.open('http://summermcdonald.me/', '_blank');
	});

});