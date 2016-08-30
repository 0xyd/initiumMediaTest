(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LineGraph = function () {
	function LineGraph() {
		_classCallCheck(this, LineGraph);

		this.g = d3.select('#VIZLAYER').select('svg');

		this.dotTip = d3.tip().offset([-12, 0]).attr('class', 'd3-tip').attr('id', 'Tip').attr('height', 100).attr('width', 100);

		this.svgTip = d3.select('body').append('div').attr('id', 'SVGTip');

		this.lineGenerator = null;

		this.rowCols = null;

		/* About the chart size */
		this.height = 0;
		this.width = 0;
		this.svgLeftPadding = 60;
		this.svgRightPadding = 20;

		/* Scale functions */
		this.xScale = null;
		this.yScale = null;

		/* Axes functions */
		this.xAxis = null;
		this.yAxis = null;

		/* About the data */
		this.jsonData = null;

		/* Promise object for asychronous process control */
		this.dataImportP = null;

		this.dataImportPs = [];

		this.xAxisP = null;
		this.yAxisP = null;

		// The ticks on x direction
		this.xTicks = null;
		this.xPoses = null;

		// Store the old data
		this.oldData = [];

		this.dotsOnPReExp = /[ML]\d+.{0,1}\d*,\d+.{0,1}\d*/g;
	}

	_createClass(LineGraph, [{
		key: 'setHeight',
		value: function setHeight(h) {
			this.height = h;
			return this;
		}
	}, {
		key: 'setWidth',
		value: function setWidth(w) {
			this.width = w;
			return this;
		}
	}, {
		key: 'setTipFormat',
		value: function setTipFormat(command) {
			var _this = this;

			this.dotTip.html(function (gd) {

				console.log(gd);

				var text = "";

				text += '<div>' + (gd.nation ? '<span>國家:' + gd.nation + '</span>' : "<span>總數</span>") + '</div>';

				if (command === 'total') {

					var currentValue = _this._sumup(gd.data);
					var pathData = _this.g.select('g.line-group > path[data-nation=總數]').nodes()[0].__data__;
					var prevValue = gd.idx !== 0 ? _this._sumup(pathData.data[gd.idx - 1]) : 0;

					text += '<div><span>總額: </span><span> ' + currentValue + '千美元</span></div>';
					text += '<div><span>較上月的變化:</span><span>' + ((currentValue - prevValue) / prevValue * 100).toFixed(2) + '%</span></div>';
				} else if (command === 'total&China&percentage') {

					var totalValue = null,
					    chinaValue = null;

					var totalData = _this.g.select('g.line-group > path:first-child').nodes()[0].__data__;

					var chinaData = _this.g.select('g.line-group > path[data-nation=中國]').nodes()[0].__data__;

					d3.select('#Tip').append('svg').attr('height', '50px').attr('width', '80px');

					if (gd.nation === '中國') {

						chinaValue = _this._sumup(gd.data);
						totalValue = _this._sumup(totalData.data[gd.idx]);
					} else {

						totalValue = _this._sumup(gd.data);
						chinaValue = _this._sumup(chinaData.data[gd.idx]);
					}

					text += '<div><span>總額: </span><span> ' + (gd.nation === '中國' ? chinaValue : totalValue) + '千美元</span></div>';
					text += '<div><span>中國佔總額比例: </span><span> ' + (chinaValue / totalValue * 100).toFixed(2) + '%</span></div>';
				} else if (command === 'allCountries') {

					var _totalData = JSON.parse(document.querySelector('body').dataset.totalTradeData),
					    totalTradeValue = _this._sumup(_totalData.data[gd.idx]),
					    otherData = [{
						// Use for doing comparsion with other countries
						nation: gd.nation,
						value: _this._sumup(gd.data)
					}],
					    rank = 0; // Taiwan Export Rank of the country

					/* Calculate Taiwan's export to the chosen country */
					text += '<div><span>出口額: ' + otherData[0].value + '千美元</span></div>' + '<div><span>佔總出口比例: ' + (otherData[0].value / totalTradeValue * 100).toFixed(2) + '% </span></div>';

					var paths = d3.selectAll('g.line-group > path').nodes();

					var _iteratorNormalCompletion = true;
					var _didIteratorError = false;
					var _iteratorError = undefined;

					try {
						for (var _iterator = paths[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
							var path = _step.value;


							var countryName = d3.select(path).attr('data-nation');

							if (countryName !== gd.nation) {
								otherData.push({
									nation: countryName,
									value: _this._sumup(path.__data__.data[gd.idx])
								});
							}
						}

						/* Calculate Taiwan export to other countries. */
					} catch (err) {
						_didIteratorError = true;
						_iteratorError = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion && _iterator.return) {
								_iterator.return();
							}
						} finally {
							if (_didIteratorError) {
								throw _iteratorError;
							}
						}
					}

					var comparedResults = [];
					var _iteratorNormalCompletion2 = true;
					var _didIteratorError2 = false;
					var _iteratorError2 = undefined;

					try {
						for (var _iterator2 = otherData[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
							var od = _step2.value;

							od['pct'] = od.value / totalTradeValue;
							comparedResults.push(od);
						}
					} catch (err) {
						_didIteratorError2 = true;
						_iteratorError2 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion2 && _iterator2.return) {
								_iterator2.return();
							}
						} finally {
							if (_didIteratorError2) {
								throw _iteratorError2;
							}
						}
					}

					comparedResults = comparedResults.sort(function (a, b) {
						return b['pct'] - a['pct'];
					}).filter(function (d, i) {
						if (d.nation === gd.nation) rank = i + 1;
						return i < 5;
					}); // Out put the top 5.

					text += '<div><span>台灣第' + rank + '大出口國</span></div>';

					text += '前五大台灣出口國(地區)';

					var _iteratorNormalCompletion3 = true;
					var _didIteratorError3 = false;
					var _iteratorError3 = undefined;

					try {
						for (var _iterator3 = comparedResults[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
							var c = _step3.value;

							text += '<div><span>國家: ' + c.nation + '</span></div>' + '<div><span>出口額: ' + c.value + '千美元</span></div>' + '<div><span>佔總出口比例: ' + (c.pct * 100).toFixed(2) + '% </span></div>';
						}
					} catch (err) {
						_didIteratorError3 = true;
						_iteratorError3 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion3 && _iterator3.return) {
								_iterator3.return();
							}
						} finally {
							if (_didIteratorError3) {
								throw _iteratorError3;
							}
						}
					}
				}

				return text;
			});

			this.g.call(this.dotTip);

			return this;
		}
	}, {
		key: 'storeOldData',
		value: function storeOldData() {

			/* Store data of the existing paths */
			var paths = this.g.select('g.line-group').selectAll('path');

			if (!paths.empty()) {
				var _iteratorNormalCompletion4 = true;
				var _didIteratorError4 = false;
				var _iteratorError4 = undefined;

				try {

					for (var _iterator4 = paths.nodes()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
						var path = _step4.value;


						// Temp storing
						var _ = path.__data__;
						_ = {
							nation: _.nation ? _.nation : '總數',
							data: _
						};

						this.oldData.push(_);
					}
				} catch (err) {
					_didIteratorError4 = true;
					_iteratorError4 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion4 && _iterator4.return) {
							_iterator4.return();
						}
					} finally {
						if (_didIteratorError4) {
							throw _iteratorError4;
						}
					}
				}
			}
			return this;
		}

		/* Delete the previous data */

	}, {
		key: 'notInclude',
		value: function notInclude(dataIndices) {
			var _this2 = this;

			var newOldData = null;

			var _iteratorNormalCompletion5 = true;
			var _didIteratorError5 = false;
			var _iteratorError5 = undefined;

			try {
				var _loop = function _loop() {
					var idx = _step5.value;


					newOldData = _this2.oldData.filter(function (d, i) {
						return i !== idx;
					});

					_this2.g.select('g.line-group > path:nth-child(' + (idx + 1) + ')').remove();
				};

				for (var _iterator5 = dataIndices[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
					_loop();
				}
			} catch (err) {
				_didIteratorError5 = true;
				_iteratorError5 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion5 && _iterator5.return) {
						_iterator5.return();
					}
				} finally {
					if (_didIteratorError5) {
						throw _iteratorError5;
					}
				}
			}

			this.oldData = newOldData;

			return this;
		}
	}, {
		key: 'addLine',
		value: function addLine(dataSource) {

			this.storeOldData();
			return this.import(dataSource);
		}
	}, {
		key: 'addMultiLines',
		value: function addMultiLines(dataSources) {

			this.storeOldData();
			return this.parallelImport(dataSources);
		}
	}, {
		key: 'readJson',
		value: function readJson(dataSource, resolved) {
			var _this3 = this;

			d3.json(dataSource, function (err, jsonData) {

				if (err) console.log(err.currentTarget.status);else {

					_this3.rowCols = Object.keys(jsonData[0].data[0]).filter(function (col) {
						return col !== 'mon' && col !== 'yr';
					});

					resolved(jsonData);
				}
			});
		}
	}, {
		key: 'import',
		value: function _import(dataSource) {
			var _this4 = this;

			this.dataImportP = new Promise(function (resolved, rejected) {

				_this4.readJson(dataSource, resolved);
			});

			return this;
		}

		/* Import multiple dataset in the same time */

	}, {
		key: 'parallelImport',
		value: function parallelImport(dataSources) {
			var _this5 = this;

			var _iteratorNormalCompletion6 = true;
			var _didIteratorError6 = false;
			var _iteratorError6 = undefined;

			try {
				var _loop2 = function _loop2() {
					var ds = _step6.value;

					var p = new Promise(function (resolved, rejected) {
						_this5.readJson(ds, resolved);
					});

					_this5.dataImportPs.push(p);
				};

				for (var _iterator6 = dataSources[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
					_loop2();
				}
			} catch (err) {
				_didIteratorError6 = true;
				_iteratorError6 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion6 && _iterator6.return) {
						_iterator6.return();
					}
				} finally {
					if (_didIteratorError6) {
						throw _iteratorError6;
					}
				}
			}

			return this;
		}
	}, {
		key: 'pAllXAxis',
		value: function pAllXAxis() {
			var _this6 = this;

			var isXOrdinal = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];


			Promise.all(this.dataImportPs).then(function (results) {
				_this6._getXTicks(isXOrdinal, results[0][0]);
			});
			return this;
		}
	}, {
		key: 'pAllYAxis',
		value: function pAllYAxis() {
			var _this7 = this;

			var sumAll = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
			var combined = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];


			Promise.all(this.dataImportPs).then(function (results) {

				// Transformed the results into d[0].data format
				var _ = function (r) {

					var s = [];

					var _iteratorNormalCompletion7 = true;
					var _didIteratorError7 = false;
					var _iteratorError7 = undefined;

					try {
						for (var _iterator7 = r[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
							var _r = _step7.value;

							s = s.concat(_r[0].data);
						}
					} catch (err) {
						_didIteratorError7 = true;
						_iteratorError7 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion7 && _iterator7.return) {
								_iterator7.return();
							}
						} finally {
							if (_didIteratorError7) {
								throw _iteratorError7;
							}
						}
					}

					return [{ data: s }];
				}(results);

				_this7._updateYAxis(_, sumAll, combined);
			});
			return this;
		}
	}, {
		key: 'pAllDrawLines',
		value: function pAllDrawLines(sumAll, illustrators, illustratorsIdxExcepts) {
			var _this8 = this;

			Promise.all(this.dataImportPs).then(function (results) {
				_this8._drawMultLines(results, sumAll, illustrators, illustratorsIdxExcepts);
			});

			return this;
		}

		/* Must stick to import function */

	}, {
		key: 'setXAxis',
		value: function setXAxis() {
			var _this9 = this;

			var isXOrdinal = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];


			this.dataImportP.then(function (d) {

				if (isXOrdinal) {

					// Ticks on x axis.
					_this9.xTicks = d[0].data.map(function (d) {
						return d.yr + '年' + d.mon + '月';
					});

					_this9.xPoses = _this9._calXPoses();

					_this9.xScale = d3.scaleOrdinal(_this9.xPoses).domain(_this9.xTicks);
					_this9.xAxis = d3.axisBottom(_this9.xScale);

					_this9.g.append('g').classed('x-axis', true).call(_this9.xAxis);

					// Abjust the x axis position
					_this9.g.select('g.x-axis').attr('transform', 'translate(0, ' + (_this9.height - 50) + ')');

					// Mark asynchronous x axis process as completed
					_this9.xAxisP = Promise.resolve();
				}
			});

			return this;
		}
	}, {
		key: 'getXTicks',
		value: function getXTicks() {
			var _this10 = this;

			var isXOrdinal = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];


			this.dataImportP.then(function (d) {
				_this10._getXTicks(isXOrdinal, d);
			});

			return this;
		}

		/* Map the x positions */

	}, {
		key: 'mapXPoses',
		value: function mapXPoses() {
			var _this11 = this;

			this.xPoses = function () {

				var _ = _this11.g.selectAll('g.x-axis .tick').nodes().map(function (node) {
					return d3.select(node).attr('transform').replace('translate(', '').replace(',0)', '');
				});
				return _;
			}();

			return this;
		}
	}, {
		key: '_getXTicks',
		value: function _getXTicks(isXOrdinal, d) {

			if (isXOrdinal) {

				// Ticks on x axis.
				if (d[0]) {

					this.xTicks = d[0].data.map(function (d) {
						return d.yr + '年' + d.mon + '月';
					});
				} else {

					this.xTicks = d.data.map(function (d) {
						return d.yr + '年' + d.mon + '月';
					});
				}
				this.xPoses = this._calXPoses();
			}
		}
	}, {
		key: '_calXPoses',
		value: function _calXPoses() {

			// The gap between each tick
			var xDelta = (this.width - (this.svgLeftPadding + this.svgRightPadding)) / (this.xTicks.length - 1);

			var _ = [];
			for (var i = 0; i < this.xTicks.length; i++) {
				_.push(xDelta * i);
			}return _;
		}

		/* Set up the axes */

	}, {
		key: 'setYAxis',
		value: function setYAxis(sumAll) {
			var _this12 = this;

			this.dataImportP.then(function (d) {

				if (sumAll) {
					_this12.yScale = d3.scaleLinear().domain([_this12._calMinDomain(d[0].data, _this12._sumup.bind(_this12)), _this12._calMaxDomain(d[0].data, _this12._sumup.bind(_this12))]).range([_this12.height - 50, 50]);
				}

				_this12.yAxis = d3.axisLeft(_this12.yScale);
				_this12.g.append('g').classed('y-axis', true).call(_this12.yAxis);

				_this12.g.select('g.y-axis').append('text').attr('transform', 'translate(-10,40)').attr('fill', '#000').text('千美元');

				// Mark asynchronous y axis process as completed
				_this12.yAxisP = Promise.resolve();
			});

			return this;
		}

		/*
  	combined: Combine the total value of every row data of multiple lines
  */

	}, {
		key: 'updateYAxis',
		value: function updateYAxis() {
			var _this13 = this;

			var sumAll = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
			var combined = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];


			this.dataImportP.then(function (d) {

				_this13._updateYAxis(d, sumAll, combined);
			});
			return this;
		}
	}, {
		key: 'updateYAxisWithOption',
		value: function updateYAxisWithOption(option) {

			this._updateYAxis(null, false, true, option);
			return this;
		}
	}, {
		key: '_updateYAxis',
		value: function _updateYAxis(d, sumAll, combined, option) {

			if (sumAll) {

				this.yScale = d3.scaleLinear().domain([this._calMinDomain(d[0].data, this._sumup.bind(this)), this._calMaxDomain(d[0].data, this._sumup.bind(this))]).range([this.height - 50, 50]);
			}

			if (combined) {

				var combinedData = this._flattenOldData(this.oldData).concat(d ? d[0].data : []);

				if (option) {

					this.yScale = d3.scaleLinear().domain([d3.min(combinedData, function (d, i) {
						return parseFloat(d[option].value);
					}), d3.max(combinedData, function (d, i) {
						return parseFloat(d[option].value);
					})]).range([this.height - 50, 50]);
				} else {
					this.yScale = d3.scaleLinear().domain([this._calMinDomain(combinedData, this._sumup.bind(this)), this._calMaxDomain(combinedData, this._sumup.bind(this))]).range([this.height - 50, 50]);
				}
			}

			this.yAxis = d3.axisLeft(this.yScale);

			this.g.select('g.y-axis').transition().duration(1000).call(this.yAxis);
		}

		/* Set up line generator */

	}, {
		key: '_setLineGenerator',
		value: function _setLineGenerator(sumAll, optName) {

			var self = this;

			this.lineGenerator = d3.line().x(function (d, i) {

				return self.xPoses[i];
			}).y(function (d, i) {
				return sumAll ? self.yScale(parseFloat(self._sumup(d))) : self.yScale(parseFloat(d[optName].value));
			});
		}

		/* Draw the line chart */

	}, {
		key: 'drawLine',
		value: function drawLine() {
			var sumAll = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

			var _this14 = this;

			var lineColor = arguments[1];
			var optName = arguments[2];


			var self = this;

			this.dataImportP.then(function (d) {

				// When axis y and axis x are finished, it's time to draw the line.
				Promise.all([_this14.xAxisP, _this14.yAxisP]).then(function () {

					_this14._setLineGenerator(sumAll);

					_this14.g.append('g').classed('line-group', true).append('path').attr('d', _this14.lineGenerator(d[0].data)).attr('stroke', lineColor).attr('stroke-width', '3px').attr('fill', 'transparent').attr('opacity', 0.6).attr('data-nation', d[0].nation ? d[0].nation : "總數").datum({ // Binding the data to the path
						name: d[0].nation ? d[0].nation : "總數",
						data: d[0].data
					}).on('mouseenter', function (d, i, node) {
						d3.select(node[0]).attr('opacity', 1);
					}).on('mouseleave', function (d, i, node) {
						d3.select(node[0]).attr('opacity', 0.3);
					}).call(function (selection) {

						/* Mark the points */
						// let pts = this.parsePathDToDots(selection.attr('d'));
						var pts = _this14.bindDataOnDots(d[0], sumAll);
						// console.log(pts);
						_this14.appendPts(pts, lineColor);
					});
				});
			});

			return this;
		}
	}, {
		key: 'drawMultiLines',
		value: function drawMultiLines(sumAll, illustrators, illustratorsIdxExcepts) {
			var _this15 = this;

			this.dataImportP.then(function (d) {
				_this15._drawMultLines(d, sumAll, illustrators, illustratorsIdxExcepts);
			});
			return this;
		}
	}, {
		key: '_drawMultLines',
		value: function _drawMultLines(d, sumAll, illustrators, illustratorsIdxExcepts, option) {
			var _this16 = this;

			// Copy original line
			var originPathD = this.g.select('g.line-group > path').attr('d');

			// Create new lines with previous setting
			for (var _i = 0; _i < illustrators.length; _i++) {

				if (!illustratorsIdxExcepts.has(_i)) {

					this.g.select('g.line-group').append('path').attr('d', originPathD).attr('stroke', illustrators[_i].color).attr('stroke-width', 3).attr('data-color', illustrators[_i].color).attr('fill', 'transparent').attr('opacity', 0.3).attr('data-nation', illustrators[_i].nation).on('mouseenter', function (d, i, node) {
						d3.select(node[0]).attr('opacity', 1);
					}).on('mouseleave', function (d, i, node) {
						d3.select(node[0]).attr('opacity', 0.6);
					});;
				}
			}

			// Set up the line generator
			this._setLineGenerator(sumAll);

			var paths = this.g.select('g.line-group').selectAll('path').nodes();

			var dataSeq = function (cd, od) {

				var _ = [];

				var _iteratorNormalCompletion8 = true;
				var _didIteratorError8 = false;
				var _iteratorError8 = undefined;

				try {
					for (var _iterator8 = od[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
						var o = _step8.value;

						_.push(o.data);
					}
				} catch (err) {
					_didIteratorError8 = true;
					_iteratorError8 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion8 && _iterator8.return) {
							_iterator8.return();
						}
					} finally {
						if (_didIteratorError8) {
							throw _iteratorError8;
						}
					}
				}

				if (cd.length <= 1) return [].concat(_).concat(cd);else {
					var t = [];
					var _iteratorNormalCompletion9 = true;
					var _didIteratorError9 = false;
					var _iteratorError9 = undefined;

					try {
						for (var _iterator9 = cd[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
							var _cd = _step9.value;

							t.push(_cd[0]);
						}
					} catch (err) {
						_didIteratorError9 = true;
						_iteratorError9 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion9 && _iterator9.return) {
								_iterator9.return();
							}
						} finally {
							if (_didIteratorError9) {
								throw _iteratorError9;
							}
						}
					}

					return [].concat(_).concat(t);
				}
			}(d, this.oldData);

			var i = 0;
			var _iteratorNormalCompletion10 = true;
			var _didIteratorError10 = false;
			var _iteratorError10 = undefined;

			try {
				for (var _iterator10 = paths[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
					var path = _step10.value;

					console.log('path: ', path);
					d3.select(path).attr('data-nation', dataSeq[i].nation).datum(dataSeq[i]).transition().duration(1000).attr('d', this.lineGenerator(dataSeq[i].data)).on('end', function (data, index, nodes) {
						var nodeSelection = d3.select(nodes[0]),
						    pts = _this16.bindDataOnDots(data, sumAll, option);

						_this16.appendPts(pts, nodeSelection.attr('data-color'), nodeSelection.attr('data-nation'));
					});

					i++;
				}
			} catch (err) {
				_didIteratorError10 = true;
				_iteratorError10 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion10 && _iterator10.return) {
						_iterator10.return();
					}
				} finally {
					if (_didIteratorError10) {
						throw _iteratorError10;
					}
				}
			}
		}
	}, {
		key: 'reMapLines',
		value: function reMapLines(option) {
			var _this17 = this;

			// Set up the line generator
			this._setLineGenerator(false, option);

			var paths = this.g.select('g.line-group').selectAll('path').nodes();

			var dataSeq = function (cd, od) {

				var _ = [];

				var _iteratorNormalCompletion11 = true;
				var _didIteratorError11 = false;
				var _iteratorError11 = undefined;

				try {
					for (var _iterator11 = od[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
						var o = _step11.value;

						_.push(o.data);
					}
				} catch (err) {
					_didIteratorError11 = true;
					_iteratorError11 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion11 && _iterator11.return) {
							_iterator11.return();
						}
					} finally {
						if (_didIteratorError11) {
							throw _iteratorError11;
						}
					}
				}

				if (cd.length <= 1) return [].concat(_).concat(cd);else {
					var t = [];
					var _iteratorNormalCompletion12 = true;
					var _didIteratorError12 = false;
					var _iteratorError12 = undefined;

					try {
						for (var _iterator12 = cd[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
							var _cd = _step12.value;

							t.push(_cd[0]);
						}
					} catch (err) {
						_didIteratorError12 = true;
						_iteratorError12 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion12 && _iterator12.return) {
								_iterator12.return();
							}
						} finally {
							if (_didIteratorError12) {
								throw _iteratorError12;
							}
						}
					}

					return [].concat(_).concat(t);
				}
			}([], this.oldData);

			var i = 0;
			var _iteratorNormalCompletion13 = true;
			var _didIteratorError13 = false;
			var _iteratorError13 = undefined;

			try {
				for (var _iterator13 = paths[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
					var path = _step13.value;

					d3.select(path).datum(dataSeq[i]).transition().duration(1000).attr('d', this.lineGenerator(dataSeq[i].data, option)).attr('data-nation', dataSeq[i].nation).on('end', function (data, index, nodes) {

						var nodeSelection = d3.select(nodes[0]),
						    pts = _this17.bindDataOnDots(data, false, option);
						_this17.appendPts(pts, nodeSelection.attr('data-color'));
					});
					i++;
				}
			} catch (err) {
				_didIteratorError13 = true;
				_iteratorError13 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion13 && _iterator13.return) {
						_iterator13.return();
					}
				} finally {
					if (_didIteratorError13) {
						throw _iteratorError13;
					}
				}
			}

			return this;
		}

		// Binding data on dots

	}, {
		key: 'bindDataOnDots',
		value: function bindDataOnDots(data, sumAll, option) {

			var i = 0,
			    pts = [];

			if (option) {
				var _iteratorNormalCompletion14 = true;
				var _didIteratorError14 = false;
				var _iteratorError14 = undefined;

				try {

					for (var _iterator14 = data.data[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
						var d = _step14.value;


						pts.push({
							nation: data.nation ? data.nation : '總數',
							data: d,
							idx: i,
							x: this.xPoses[i],
							y: this.yScale(d[option].value)
						});
						i++;
					}
				} catch (err) {
					_didIteratorError14 = true;
					_iteratorError14 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion14 && _iterator14.return) {
							_iterator14.return();
						}
					} finally {
						if (_didIteratorError14) {
							throw _iteratorError14;
						}
					}
				}
			} else if (sumAll) {
				var _iteratorNormalCompletion15 = true;
				var _didIteratorError15 = false;
				var _iteratorError15 = undefined;

				try {

					for (var _iterator15 = data.data[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
						var _d = _step15.value;


						pts.push({
							nation: data.nation ? data.nation : '總數',
							data: _d,
							idx: i,
							x: this.xPoses[i],
							y: this.yScale(this._sumup(_d))
						});
						i++;
					}
				} catch (err) {
					_didIteratorError15 = true;
					_iteratorError15 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion15 && _iterator15.return) {
							_iterator15.return();
						}
					} finally {
						if (_didIteratorError15) {
							throw _iteratorError15;
						}
					}
				}
			}
			return pts;
		}
	}, {
		key: 'dumpTip',
		value: function dumpTip() {

			d3.select('#Tip').remove();

			return this;
		}
	}, {
		key: 'removePts',
		value: function removePts() {
			this.g.selectAll('g.circle-group').remove();
			return this;
		}
	}, {
		key: 'appendPts',
		value: function appendPts(dataBindPts, color, nation) {
			var _this18 = this;

			this.g.append('g').classed('circle-group', true).attr('data-nation', nation).selectAll('circle').data(dataBindPts).enter().append('circle').attr('r', 2.5).attr('fill', color).attr('cx', function (d) {
				return d.x;
			}).attr('cy', function (d) {
				return d.y;
			}).on('mouseenter', function (d) {
				_this18.dotTip.show(d);
			}).on('mouseleave', function (d) {
				_this18.dotTip.hide();
			});
		}
	}, {
		key: '_flattenOldData',
		value: function _flattenOldData(oldData) {

			var flattenOldData = [];

			var _iteratorNormalCompletion16 = true;
			var _didIteratorError16 = false;
			var _iteratorError16 = undefined;

			try {
				for (var _iterator16 = oldData[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
					var od = _step16.value;
					var _iteratorNormalCompletion17 = true;
					var _didIteratorError17 = false;
					var _iteratorError17 = undefined;

					try {
						for (var _iterator17 = od.data.data[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
							var d = _step17.value;

							flattenOldData.push(d);
						}
					} catch (err) {
						_didIteratorError17 = true;
						_iteratorError17 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion17 && _iterator17.return) {
								_iterator17.return();
							}
						} finally {
							if (_didIteratorError17) {
								throw _iteratorError17;
							}
						}
					}
				}
			} catch (err) {
				_didIteratorError16 = true;
				_iteratorError16 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion16 && _iterator16.return) {
						_iterator16.return();
					}
				} finally {
					if (_didIteratorError16) {
						throw _iteratorError16;
					}
				}
			}

			return flattenOldData;
		}

		// Calculate the minimum of domain
		// Minus 5% to make chart not so crowded

	}, {
		key: '_calMinDomain',
		value: function _calMinDomain(data, f) {
			var _ = d3.min(data, function (d) {
				return parseFloat(f(d));
			});
			return _ - 0.05 * _;
		}

		// Calculate the maximum of domain.
		// Add 5% to make chart not so crowded

	}, {
		key: '_calMaxDomain',
		value: function _calMaxDomain(data, f) {
			var _ = d3.max(data, function (d) {
				return parseFloat(f(d));
			});
			return _ + 0.05 * _;
		}

		/* Sump up the whole properties */

	}, {
		key: '_sumup',
		value: function _sumup(d) {

			var s = 0;

			if (_typeof(d[this.rowCols[0]]) === 'object') for (var i = 0; i < this.rowCols.length; i++) {
				s += parseFloat(d[this.rowCols[i]].value);
			} else for (var i = 0; i < this.rowCols.length; i++) {
				s += parseFloat(d[this.rowCols[i]]);
			}return s;
		}
	}]);

	return LineGraph;
}();

exports.default = LineGraph;

},{}],2:[function(require,module,exports){
"use strict";

var _lineGraph = require("../modules/lineGraph");

var _lineGraph2 = _interopRequireDefault(_lineGraph);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var storyIdx = 0; // Modules import


var illustrators = [{
	"name": "總數",
	"shape": "rect",
	"color": "#08c"
}, {
	"name": "中國",
	"shape": "rect",
	"color": "#C44536"
}, {
	"name": "美國",
	"shape": "rect",
	"color": "#197278"
}, {
	"name": "日本",
	"shape": "rect",
	"color": "#F49D37"
}, {
	"name": "以色列",
	"shape": "rect",
	"color": "#85C7DE"
}, {
	"name": "伊朗",
	"shape": "rect",
	"color": "#A288A6"
}, {
	"name": "俄羅斯",
	"shape": "rect",
	"color": "#CCBCBC"
}, {
	"name": "加拿大",
	"shape": "rect",
	"color": "#EF6461"
}, {
	"name": "匈牙利",
	"shape": "rect",
	"color": "#E4B363"
}, {
	"name": "南非",
	"shape": "rect",
	"color": "#E0DFD5"
}, {
	"name": "印尼",
	"shape": "rect",
	"color": "#C6D8AF"
}, {
	"name": "印度",
	"shape": "rect",
	"color": "#685369"
}, {
	"name": "土耳其",
	"shape": "rect",
	"color": "#FCC8B2"
}, {
	"name": "埃及",
	"shape": "rect",
	"color": "#EFA48B"
}, {
	"name": "墨西哥",
	"shape": "rect",
	"color": "#FF9B42"
}, {
	"name": "孟加拉",
	"shape": "rect",
	"color": "#00A7E1"
}, {
	"name": "巴基斯坦",
	"shape": "rect",
	"color": "#3B413C"
}, {
	"name": "巴西",
	"shape": "rect",
	"color": "#94D1BE"
}, {
	"name": "德國",
	"shape": "rect",
	"color": "#8B5FBF"
}, {
	"name": "斯里蘭卡",
	"shape": "rect",
	"color": "#D183C9"
}, {
	"name": "新加坡",
	"shape": "rect",
	"color": "#643A71"
}, {
	"name": "柬埔寨",
	"shape": "rect",
	"color": "#D64550"
}, {
	"name": "比利時",
	"shape": "rect",
	"color": "#DAEFB3"
}, {
	"name": "沙烏地阿拉伯",
	"shape": "rect",
	"color": "#CA5310"
}, {
	"name": "法國",
	"shape": "rect",
	"color": "#EA9E8D"
}, {
	"name": "波蘭",
	"shape": "rect",
	"color": "#691E06"
}, {
	"name": "泰國",
	"shape": "rect",
	"color": "#FBBA72"
}, {
	"name": "澳大利亞",
	"shape": "rect",
	"color": "#8F250C"
}, {
	"name": "瑞典",
	"shape": "rect",
	"color": "#B4656F"
}, {
	"name": "瑞士",
	"shape": "rect",
	"color": "#948392"
}, {
	"name": "紐西蘭",
	"shape": "rect",
	"color": "#4E937A"
}, {
	"name": "義大利",
	"shape": "rect",
	"color": "#849483"
}, {
	"name": "英國",
	"shape": "rect",
	"color": "#FFE19C"
}, {
	"name": "荷蘭",
	"shape": "rect",
	"color": "#FF784F"
}, {
	"name": "菲律賓",
	"shape": "rect",
	"color": "#3A3042"
}, {
	"name": "西班牙",
	"shape": "rect",
	"color": "#6B9080"
}, {
	"name": "越南",
	"shape": "rect",
	"color": "#A4C3B2"
}, {
	"name": "阿拉伯聯合大公國",
	"shape": "rect",
	"color": "#CCE3DE"
}, {
	"name": "韓國",
	"shape": "rect",
	"color": "#EE5622"
}, {
	"name": "香港",
	"shape": "rect",
	"color": "#ECA72C"
}, {
	"name": "馬來西亞",
	"shape": "rect",
	"color": "#31263E"
}];

/* Get the story data */
var storyData = [{
	"title": "台灣對外的貿易",
	"paragraphs": ["台灣從民國90年7月到105年7月，這十五年間，出口額度從6,912,455仟美元，上升至15,804,549仟美元，增加近130%。凸顯國際貿易對台灣的重要性以及台灣以出口為導向的市場。", ""],
	"dataSource": "./data/HS/json/總數.json",
	"illustrators": [{
		"name": "總數",
		"shape": "rect",
		"color": "#08c"
	}]
}, {
	"title": "中國佔台灣出口的貿易總額",
	"paragraphs": ["1989年，因著天安門事件，中國受到國際的經濟制裁，經濟發展停滯。是故在民國90年初期，我國出口大陸市場的總值僅佔3個百分點。", "因著大陸極具潛力的勞動力與消費性的市場，許多外籍企業包括台灣將無數的資金與技術帶入中國，造就中國往後15年的經濟榮景。", "中國經濟的崛起，儼然使之成為台灣最主要的貿易夥伴，如今台灣出口至中國大陸貿易額已超過百分之二十。"],
	"dataSource": "./data/HS/json/中國.json",
	"actions": [{
		"name": "importChinaDataset"
	}],
	"illustrators": [{
		"name": "總數",
		"shape": "rect",
		"color": "#08c"
	}, {
		"name": "中國",
		"shape": "rect",
		"color": "#C44536"
	}]
}, {
	"title": "台灣的主要出口國家(地區)",
	"paragraphs": ["民國90年初以出口為導向的台灣，最主要的市場為歐美日等成熟的經濟體。在民國91年，台灣出口至大陸的貿易產值驟升，15年後對中國大陸與香港的總出口高達6,487,645仟美元，佔台灣整體出口高達41個百分點。", "然而台灣與大陸雙方特殊的政治關係，台灣高度依賴大陸市場的經濟結構令許多人擔憂，促使當今的台灣政府展開南向政策，減少對單一市場的依賴。"],
	"dataSources": ["./data/HS/json/美國.json", "./data/HS/json/日本.json", "./data/HS/json/以色列.json", "./data/HS/json/伊朗.json", "./data/HS/json/俄羅斯.json", "./data/HS/json/加拿大.json", "./data/HS/json/匈牙利.json", "./data/HS/json/南非.json", "./data/HS/json/印尼.json", "./data/HS/json/印度.json", "./data/HS/json/土耳其.json", "./data/HS/json/埃及.json", "./data/HS/json/墨西哥.json", "./data/HS/json/孟加拉.json", "./data/HS/json/巴基斯坦.json", "./data/HS/json/巴西.json", "./data/HS/json/德國.json", "./data/HS/json/斯里蘭卡.json", "./data/HS/json/新加坡.json", "./data/HS/json/柬埔寨.json", "./data/HS/json/比利時.json", "./data/HS/json/沙烏地阿拉伯.json", "./data/HS/json/法國.json", "./data/HS/json/波蘭.json", "./data/HS/json/泰國.json", "./data/HS/json/澳大利亞.json", "./data/HS/json/瑞典.json", "./data/HS/json/瑞士.json", "./data/HS/json/紐西蘭.json", "./data/HS/json/義大利.json", "./data/HS/json/英國.json", "./data/HS/json/荷蘭.json", "./data/HS/json/菲律賓.json", "./data/HS/json/西班牙.json", "./data/HS/json/越南.json", "./data/HS/json/阿拉伯聯合大公國.json", "./data/HS/json/韓國.json", "./data/HS/json/香港.json", "./data/HS/json/馬來西亞.json"],
	"actions": [{
		"name": "importMultiNewDatasets"
	}],
	"illustrators": illustrators
}, {
	"title": "HS制的64個貿易品項",
	"paragraphs": ["", ""],
	"dataSource": "",
	"actions": [{
		"name": "selectItemInHS"
	}],
	"illustrators": illustrators
}];

var Indicator = React.createClass({
	displayName: "Indicator",
	render: function render() {
		return React.createElement(
			"div",
			{ className: "indicator" },
			React.createElement("span", { className: "ver-helper" }),
			React.createElement("div", { className: this.props.index === storyIdx ? "button active" : "button" })
		);
	}
});

var RightIndicatorHub = React.createClass({
	displayName: "RightIndicatorHub",
	incrementIndiIdx: function incrementIndiIdx() {
		this.props.nextStory();
	},
	render: function render() {

		var indics = [];

		for (var i = 0; i < storyData.length; i++) {
			indics.push(React.createElement(Indicator, { key: i, index: i }));
		}return React.createElement(
			"div",
			{ id: "Indicators" },
			indics,
			React.createElement(Next, { incrementIndiIdx: this.incrementIndiIdx })
		);
	}
});

var Next = React.createClass({
	displayName: "Next",
	next: function next() {
		this.props.incrementIndiIdx();
	},
	render: function render() {
		return React.createElement(
			"div",
			{ id: "Next", className: "indicator", onClick: this.next },
			React.createElement("span", { className: "bar" }),
			React.createElement("span", { className: "bar" })
		);
	}
});

var InfoLayer = React.createClass({
	displayName: "InfoLayer",
	render: function render() {

		var ps = storyData[storyIdx].paragraphs,
		    paragraphs = [];

		var i = 0;
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = ps[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var _ps = _step.value;

				paragraphs.push(React.createElement(
					"p",
					{ key: i },
					_ps
				));
				i++;
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator.return) {
					_iterator.return();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}

		return React.createElement(
			"section",
			{ id: "INFO_LAYER" },
			React.createElement(
				"h2",
				null,
				storyData[storyIdx].title
			),
			paragraphs
		);
	}
});

var IllustratorItem = React.createClass({
	displayName: "IllustratorItem",
	render: function render() {
		return React.createElement(
			"li",
			{ className: "item" },
			React.createElement("span", { className: "ver-helper" }),
			React.createElement(
				"svg",
				{ className: "icn" },
				this.props.shape === "rect" ? React.createElement("rect", { className: "", fill: this.props.color }) : null
			),
			React.createElement(
				"span",
				{ className: "txt" },
				this.props.name
			)
		);
	}
});

var IllustratorLayer = React.createClass({
	displayName: "IllustratorLayer",
	render: function render() {

		var i = 0,
		    illustratorArray = [];

		if (this.props.illustrators.length < 5) {
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = this.props.illustrators[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var illustrator = _step2.value;

					illustratorArray.push(React.createElement(IllustratorItem, {
						key: i,
						name: illustrator.name,
						shape: illustrator.shape,
						color: illustrator.color }));
					i++;
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}
		}

		return React.createElement(
			"div",
			{ id: "Illustrator" },
			React.createElement(
				"ul",
				{ className: "ullist" },
				illustratorArray
			)
		);
	}
});

var ItemSelectOption = React.createClass({
	displayName: "ItemSelectOption",


	// selectAction(e) {
	// 	console.log(e);
	// 	this.props.selectItem();
	// },

	render: function render() {
		return React.createElement(
			"option",
			{ value: this.props.itemName },
			this.props.itemName
		);
	}
});

var ItemSelector = React.createClass({
	displayName: "ItemSelector",
	changeItem: function changeItem(e) {
		this.props.selectItem(e.target.value);
	},
	render: function render() {

		var itemNames = ['鮮冷凍之動物肉類及食用雜碎', '活魚，生鮮或冷藏魚，冷凍魚等', '活、生鮮、冷藏、冷凍乾、鹹或浸鹹甲殼類及軟體類動物', '已調製或保藏之魚類、魚子醬及由魚卵調製之魚子醬代替品', '原油以外之石油及提自瀝青之油類', '聚合製品及共聚合製品', '人造樹脂及塑膠材料製品', '橡膠輪胎', '旅行用品，手提袋及類似容器', '合板，單板，貼面板及類似集成材', '其他木製品', '人造纖維絲製之線紗，再生纖維紗', '合成纖維絲紗梭織物，再生纖維絲紗梭織物', '棉梭織物', '未初梳未精梳或未另行處理以供紡製用之合成纖維棉及再生織維棉', '非供零售用之合成纖維棉紗及再生纖維棉紗', '合成纖維棉梭織物', '用塑膠浸漬塗佈被覆或黏合之紡織物', '針織或鉤針織圈絨織物', '針織或鉤織製內衣', '針織或鉤織外衣及其他製品', '男用或男童用外衣', '女用或女童用外衣', '外底及鞋面以橡膠或塑膠製之鞋靴', '外底以橡膠塑膠皮或組合皮製之鞋靴，而鞋面以皮或紡織材料製者', '其他鞋靴', '雨傘及陽傘', '陶瓷塑像及其他裝飾瓷製品', '其他陶瓷製品', '仿首飾', '鋼鐵製螺釘，螺栓，螺帽及類似製品', '其他鋼鐵製品', '銼及木銼，鉗，手用板手及板鉗等手工具', '未列名之手工具', '未列名之燈具及照明配件及零件', '縫紉機', '金屬或金屬碳化物工作用工具機', '計算器，會計機，收銀機，郵資機，售票機等', '自動資料處理機及其附屬單元等', '專用或主要用於第８４６９至８４７１節機器之零件及附件', '第８４章未列名之機器及機械用具', '電動機及發電機等各種電力機械', '家用電動用具附裝電動機者', '電話機，包括手機及無線網路電話；耳機', '微音器及其座；揚聲器等', '無線電廣播或電視之傳輸器具、數位相機、雷達及無線電導航', '固定，可變或可預先調整之電容器', '電阻器，印刷電路，電話開關，保護電路用之電器具等', '熱冷陰極管及光陰極管二極體，電晶體等', '絕緣電線電纜及其他?緣電導體', '第８７０１至８７０５節機動車輛所用之零件及附件', '非動力之二輪腳踏車及其他腳踏車', '第８７１１至８７１３節所列車輛之零件及附件', '供載客或載貨用船舶；漁船；遊艇', '眼鏡，護目鏡及類似供矯正助保護眼睛或其他用途者', '照相機', '唱盤，電唱機，卡式放音機，錄音機，錄放影器具', '第８５１９至８５２１節所列機器之零件及附件', '座物不論是否可轉換成床者；及其零件', '其他傢俱及其零件', '其他玩具', '遊樂會，桌上或室內遊戲品', '慶典，狂歡節或其他遊藝用品', '體操競技比賽其他運動或戶外遊戲用物品及設備'],
		    options = [];

		var i = 0;
		var _iteratorNormalCompletion3 = true;
		var _didIteratorError3 = false;
		var _iteratorError3 = undefined;

		try {
			for (var _iterator3 = itemNames[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
				var itemName = _step3.value;

				options.push(React.createElement(ItemSelectOption, {
					key: i, itemName: itemName,
					selectItem: this.props.changeItem }));
				i++;
			}
		} catch (err) {
			_didIteratorError3 = true;
			_iteratorError3 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion3 && _iterator3.return) {
					_iterator3.return();
				}
			} finally {
				if (_didIteratorError3) {
					throw _iteratorError3;
				}
			}
		}

		return React.createElement(
			"select",
			{ id: "ItemSelector", onChange: this.changeItem },
			options
		);
	}
});

var VizLayer = React.createClass({
	displayName: "VizLayer",
	initVizObjects: function initVizObjects() {
		return {
			lg: new _lineGraph2.default()

		};
	},
	selectItem: function selectItem(itemName) {
		this.setState({ 'currentItem': itemName });
	},
	getInitialState: function getInitialState() {
		return {
			currentItem: '鮮冷凍之動物肉類及食用雜碎'
		};
	},
	componentDidUpdate: function componentDidUpdate() {

		var lg = this.initVizObjects().lg.mapXPoses().removePts().dumpTip().setHeight(window.innerHeight).setWidth(window.innerWidth);

		var actions = storyData[storyIdx].actions;

		var _iteratorNormalCompletion4 = true;
		var _didIteratorError4 = false;
		var _iteratorError4 = undefined;

		try {
			for (var _iterator4 = actions[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
				var act = _step4.value;


				if (act.name === 'importChinaDataset') {
					lg.addLine(storyData[storyIdx].dataSource).getXTicks(true).updateYAxis(false, true).drawMultiLines(true, storyData[storyIdx].illustrators, new Set([0])).setTipFormat('total&China&percentage');
				} else if (act.name === 'importMultiNewDatasets') {

					// Save total trade data in other places.
					document.querySelector('body').dataset.totalTradeData = JSON.stringify(d3.select('g.line-group > path:first-child').nodes()[0].__data__);

					lg.addMultiLines(storyData[storyIdx].dataSources).notInclude([0]).pAllXAxis(true).pAllYAxis(true, true).pAllDrawLines(true, storyData[storyIdx].illustrators, new Set([0, 1])).setTipFormat('allCountries');
				} else if (act.name === 'selectItemInHS') {

					var newSelectedItem = this.state['currentItem'];

					lg.storeOldData().mapXPoses().updateYAxisWithOption(newSelectedItem).reMapLines(newSelectedItem);
				}
			}
		} catch (err) {
			_didIteratorError4 = true;
			_iteratorError4 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion4 && _iterator4.return) {
					_iterator4.return();
				}
			} finally {
				if (_didIteratorError4) {
					throw _iteratorError4;
				}
			}
		}
	},
	componentDidMount: function componentDidMount() {

		// Initial a svg for painting.
		d3.select('#VIZLAYER').append('svg');

		this.initVizObjects().lg.setHeight(window.innerHeight).setWidth(window.innerWidth).import('./data/HS/json/總數.json').setXAxis(true).setYAxis(true).drawLine(true, storyData[storyIdx].illustrators[0].color).setTipFormat('total');
	},
	render: function render() {

		return React.createElement(
			"div",
			{ id: "VIZLAYER" },
			storyIdx === 3 ? React.createElement(ItemSelector, { selectItem: this.selectItem }) : null
		);
	}
});

var App = React.createClass({
	displayName: "App",
	getInitialState: function getInitialState() {
		return {
			storyIndex: 0
		};
	},
	nextStory: function nextStory() {
		storyIdx++;
		this.setState({ storyIndex: this.state['storyIndex'] + 1 });
	},
	render: function render() {

		var icns = storyData[storyIdx].illustrators;

		return React.createElement(
			"article",
			null,
			React.createElement(InfoLayer, null),
			React.createElement(VizLayer, null),
			React.createElement(RightIndicatorHub, { nextStory: this.nextStory }),
			React.createElement(IllustratorLayer, { illustrators: storyData[storyIdx].illustrators })
		);
	}
});

ReactDOM.render(React.createElement(App, null), document.querySelector('#CONTAINER'));

},{"../modules/lineGraph":1}]},{},[2]);
