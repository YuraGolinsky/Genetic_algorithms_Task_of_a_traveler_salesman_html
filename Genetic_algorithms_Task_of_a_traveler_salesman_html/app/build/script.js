'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

window.app = {};

var CreatePoint = function () {
	function CreatePoint(map) {
		_classCallCheck(this, CreatePoint);

		this.map = map;

		app.globalPoints = [];
	}

	_createClass(CreatePoint, [{
		key: 'getField',
		value: function getField() {
			var field = document.getElementById(this.map);
			return field;
		}
	}, {
		key: 'boundingClientRect',
		value: function boundingClientRect() {
			var boundingRect = this.getField().getBoundingClientRect();
			return boundingRect;
		}
	}, {
		key: 'createPoint',
		value: function createPoint(event) {
		// найти все точки
			var allPoint = document.getElementsByClassName('mx-point');
			var countPoints = 0;

			for (var i = 0; i <= allPoint.length; i++) {
				countPoints = i;
			}
// для подсчета кнопок
			if (countPoints === 2) {
				var button = document.getElementById('count');
				button.removeAttribute('disabled');
			}
// точка положения
			var posX = event.clientX - this.boundingClientRect().left;
			var posY = event.clientY - this.boundingClientRect().top;

			posX = parseInt(posX);
			posY = parseInt(posY);
// создать элемент
			var el = document.createElement('div');
			el.className = 'mx-point';
			el.style.left = posX + 'px';
			el.style.top = posY + 'px';

			el.setAttribute('data-number-element', countPoints);
			el.setAttribute('id', 'point_' + countPoints);
			el.setAttribute('data-x', posX);// точка Х
			el.setAttribute('data-y', posY);// точка Х

			this.getField().appendChild(el);

			// отправить в массив
			app.globalPoints.push(el);
		}
	}]);

	return CreatePoint;
}();

var ShowInfo = function () {
	function ShowInfo(idElement, orderNumber, distance) {
		_classCallCheck(this, ShowInfo);

		this.idElement = idElement;
		this.orderNumber = orderNumber;
		this.distance = distance;
	}

	_createClass(ShowInfo, [{
		key: 'createInfo',
		value: function createInfo() {
			// найти точку
			var point = document.getElementById(this.idElement);
// добавляем счетчик
			var counter = document.createElement('div');
			counter.className = 'mx_order_number';

			var _span = document.createElement('span');
			_span.innerHTML = this.orderNumber;

			counter.appendChild(_span);

			point.appendChild(counter);

// добавить расстояние
			var distanceToPoint = document.createElement('div');
			distanceToPoint.className = 'mx-distance';

			if (this.idElement !== 'point_0') {//количество точек считает 
				distanceToPoint.innerHTML = 'D: ' + (this.orderNumber - 1) + ' -> ' + this.orderNumber + ' = ' + this.distance + 'px';
			}

			point.appendChild(distanceToPoint);
		}
	}]);

	return ShowInfo;
}();

var CalculateRoute = function () {
	function CalculateRoute(button) {
		_classCallCheck(this, CalculateRoute);

		this.button = button;

		app.globalPointsChecked = [0];
		app.globalCountPointsTMP = [];
		app.globalStep = 0;
		app.globalLopKey = true;
		app.openMap = true;
		app.distanceCountKey = true;
	}

	_createClass(CalculateRoute, [{
		key: 'getButton',
		value: function getButton() {
			var button = document.getElementById(this.button);
			return button;
		}
	}, {
		key: 'findCoordinatesPointFirst',
		value: function findCoordinatesPointFirst(_pointFirst) {

			var posX = app.globalPoints[_pointFirst].getAttribute('data-x');
			var posY = app.globalPoints[_pointFirst].getAttribute('data-y');

			// posX = parseInt(posX);
			// posY = parseInt(posY);

			return {
				positionX: posX,
				positionY: posY
			};
		}
	}, {
		key: 'findCoordinatesPointSecond',
		value: function findCoordinatesPointSecond(_secondPoint) {

			var posX = app.globalPoints[_secondPoint].getAttribute('data-x');
			var posY = app.globalPoints[_secondPoint].getAttribute('data-y');

			// posX = parseInt(posX);
			// posY = parseInt(posY);

			return {
				positionX: posX,
				positionY: posY
			};
		}
	}, {
		key: 'minDistance',
		value: function minDistance() {

			var arrayDistances = [];
			var _arr = app.globalCountPointsTMP.map(function (el) {
				arrayDistances.push(el[1]);
			});

			var minDistance = Math.min.apply(null, arrayDistances);
			return minDistance;
		}
	}, {
		key: 'distanceToPoint',
		value: function distanceToPoint(firstPoint, secondPoint) {
// 1 шаг найти x и y
			var coordinatesFirstPoint = this.findCoordinatesPointFirst(firstPoint);
			var coordinatesSecondPoint = this.findCoordinatesPointSecond(secondPoint);

			// console.log(coordinatesFirstPoint);
			// console.log(coordinatesSecondPoint);

// считать расстояние
// разница Х
			var xFirstPoint = coordinatesFirstPoint.positionX;
			var xSecondPoint = coordinatesSecondPoint.positionX;
// найти катет 1
			var differenceX = xSecondPoint - xFirstPoint;
			differenceX = Math.abs(differenceX);

			var cathetus1 = Math.pow(differenceX, 2);
// разница Y
			var yFirstPoint = coordinatesFirstPoint.positionY;
			var ySecondPoint = coordinatesSecondPoint.positionY;
// найти катет 2
			var differenceY = ySecondPoint - yFirstPoint;
			differenceY = Math.abs(differenceY);

			var cathetus2 = Math.pow(differenceY, 2);

			// console.log(differenceX);
// расстояние до точки
			var dToPoint = cathetus1 + cathetus2;
			dToPoint = Math.sqrt(dToPoint);
			dToPoint = parseInt(dToPoint);
// отправить в массив
			app.globalCountPointsTMP.push([secondPoint, dToPoint]);
		}
	}, {
		key: 'dataNumberElement',
		value: function dataNumberElement() {
			var _index = app.globalPointsChecked.length - 1;
			var _number = app.globalPointsChecked[_index];

			return _number;
		}
	}, {
		key: 'distanceToNeighboringPoint',
		value: function distanceToNeighboringPoint() {

			if (app.distanceCountKey === true) {

				app.distanceCountKey = false;
				// ____________________

				// от данной точки идет измерение длины к следующим
				if (app.globalStep === app.globalPoints.length - 1) {
					app.globalStep = app.globalPoints.length;
					app.globalLopKey = false;
				} else {
// Рассчитываем расстояние до точек
					for (var i = 0; i < app.globalPoints.length; i++) {

						if (app.globalPointsChecked.indexOf(i) !== -1) {
							continue;
						} else {
							this.distanceToPoint(this.dataNumberElement(), i);
						}
					}
// минимальное расстояние
					var minDistance = this.minDistance();
					// console.log(minDistance);
// находим в массиве app.globalCountPointsTMP точку
					var numEl = 0;
					var _arr = app.globalCountPointsTMP.map(function (el) {

						if (el[1] === minDistance) {
							app.globalPointsChecked.push(el[0]);
							numEl = el[0];
						}
					});
// очищаем временной массив
					app.globalCountPointsTMP = [];

					// console.log(app.globalPointsChecked);
// следующий шаг
					app.globalStep++;
// показать информацию
					var showInfo = new ShowInfo('point_' + numEl, app.globalStep, minDistance);
					showInfo.createInfo();

					// ___________________
					app.distanceCountKey = true;
				}
			}
		}
	}]);

	return CalculateRoute;
}();

// ----------------------------------

var newPoint = new CreatePoint('map');

var arrPoint = new CalculateRoute('count');
// устанавливаем точки

newPoint.getField().onclick = function (event) {

	if (app.openMap === true) {
		newPoint.createPoint(event);
	}
};
// считать очки
var loop = '';
arrPoint.getButton().onclick = function () {
// отключенная кнопка
	this.setAttribute('disabled', 'disabled');
// закрытая карта
	app.openMap = false;
// показать информацию
	var showInfo = new ShowInfo('point_0', 0, 0); // ТОЧКА 0
	showInfo.createInfo();

	loop = setInterval(countPointsInterval, 1500);
};

function countPointsInterval() {

	arrPoint.distanceToNeighboringPoint();

	if (app.globalLopKey === false) {
		clearInterval(loop);
	}
}