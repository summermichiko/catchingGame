$(document).ready(function() {

	var app = $('.surveySurge'),
		canvas = document.getElementById('canvas'),
		context = canvas.getContext("2d"),

		// game variables
		startingScore = 0,
		continueAnimating = false,
		score,

		// x variables
		xArr = [],
		xWidth = 40,
		xHeight = 40,
		xIcon = {
			x: 300,
			y: 0,
			width: xWidth,
			height: xHeight
		},

		// wufooSaurus variables
		wufooSaurusWidth = 150,
		wufooSaurusHeight = 75,
		wufooSaurusSpeed = 10,
		wufooSaurus = {
			x: 50,
			y: canvas.height - wufooSaurusHeight,
			width: wufooSaurusWidth,
			height: wufooSaurusHeight,
			wufooSaurusSpeed: wufooSaurusSpeed
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
			resetSurvey: function(survey) {
				// randomly position survey near the top of canvas
				survey.x = Math.random() * (canvas.width - surveyWidth);
				survey.y = 40 + Math.random() * 30;
				survey.speed = (0.65 + Math.random()) * 0.9;
			},
			addX: function() {
				// draw the x
				function generateX() {
					var xMark = new Image();
					xMark.src = 'assets/x.png';
					function drawX() {
						console.log('draw x')
						context.drawImage(xMark, xIcon.x, xIcon.y, xIcon.width, xIcon.height);
						xArr.push(xMark);
						helper.checkMisses();
						console.log('xArr', xArr);
					}
					function init() {
						drawX();
					}
					init();
				}
				generateX();
			},
			checkMisses: function() {
				if (xArr.length == 3) {
					continueAnimating = false;
					$('#surveyModal').modal({
						// backdrop: 'static',
						// keyboard: false
					});
				}
			},
			animate: function() {
				// request another animation frame
				if (continueAnimating) {
					requestAnimationFrame(helper.animate);
				}
				// for each survey
				// (1) check for collisions
				// (2) advance the survey
				// (3) if the survey falls below the canvas, reset that survey
				for (var i = 0; i < surveys.length; i++) {
					var survey = surveys[i];
					// test for survey-wufooSaurus collision
					if (helper.isColliding(survey, wufooSaurus)) {
						var sound = new Audio("audio/coinSound.mp3");
						sound.play();
						score += 5;
						helper.resetSurvey(survey);
					}
					// advance the surveys
					survey.y += survey.speed;
					// if the survey is below the canvas,
					if (survey.y > canvas.height) {
						var sound = new Audio("audio/buzzerSound.mp3");
						sound.play();
						helper.addX();
						// if 3 x, stop game
						helper.resetSurvey(survey);
					}
				}
				// redraw everything
				helper.drawAll();
			},
			isColliding: function(a, b) {
				return !(b.x > a.x + a.width || b.x + b.width < a.x || b.y > a.y + a.height || b.y + b.height < a.y);
			},
			drawAll: function() {
				// clear the canvas
				context.clearRect(0, 0, canvas.width, canvas.height);
				// draw the background
				context.fillStyle = '#fff';
				context.fillRect(0, 0, canvas.width, canvas.height);
				// draw wufooSaurus
				var img = new Image();
				img.src = 'assets/wufooSaurusSmall.png';
				function drawDino() {
					context.drawImage(img, wufooSaurus.x, wufooSaurus.y-10);
				}
				function init() {
					drawDino();
				}
				init();

				// draw all surveys
				function generateSurvey() {
					var icon = new Image();
					icon.src = 'assets/surveyIcon.png';
					function drawSurvey() {
						context.drawImage(icon, survey.x, survey.y, survey.width, survey.height);
					}
					function init() {
						drawSurvey();
					}
					init();
				}
				for (var i = 0; i < surveys.length; i++) {
					var survey = surveys[i];
					generateSurvey();
				}

				// draw the score
				context.font = "14px 'Press Start 2P'";
				context.fillStyle = "#000";
				context.fillText("Score:" + score, 15, 30);
			}
		};

	//left and right keypush event handlers
	document.onkeydown = function (event) {
		// right arrow
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
	// button to start the game
	app.on('click', '#start', function() {
		var instructionView = $(this).closest('.surgeView');
		var nextView = app.find('.surveyGame');
		instructionView.hide();
		nextView.show();
		score = startingScore;
		wufooSaurus.x = 0;
		for (var i = 0; i < surveys.length; i++) {
			helper.resetSurvey(surveys[i]);
		}
		if (!continueAnimating) {
			continueAnimating = true;
			helper.animate();
		}
	});

	app.on('click', '.playAgainButton', function() {
		$('#surveyModal').modal('hide');
		score = startingScore;
		wufooSaurus.x = 0;
		xArr = [];
		for (var i = 0; i < surveys.length; i++) {
			helper.resetSurvey(surveys[i]);
		}
		if (!continueAnimating) {
			continueAnimating = true;
			helper.animate();
		}
	});
	app.on('click', '.toPortfolioButton', function() {
		window.open('http://summermcdonald.me/', '_blank');
	});

});