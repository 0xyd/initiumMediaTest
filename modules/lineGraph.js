class LineGraph {

	constructor() {

		this.g = d3.select('#VIZLAYER').select('svg');

		this.dotTip = d3.tip()
			.offset([-12, 0])
			.attr('class', 'd3-tip')
			.attr('id', 'Tip')
			.attr('height', 100)
			.attr('width', 100);

		this.svgTip = 
			d3.select('body')
				.append('div')
					.attr('id', 'SVGTip');

		this.lineGenerator = null;

		this.rowCols = null;

		/* About the chart size */
		this.height = 0;
		this.width = 0;
		this.svgLeftPadding  = 60;
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

		this.dotsOnPReExp = /[ML]\d+.{0,1}\d*,\d+.{0,1}\d*/g

	}

	setHeight(h) {
		this.height = h;
		return this
	}

	setWidth(w) {
		this.width = w;
		return this
	}

	setTipFormat(command) {

		this.dotTip.html((gd) => {

			console.log(gd);

			let text = "";

			text += '<div>' + 
				(gd.nation ? '<span>國家:' + gd.nation + '</span>': 
					"<span>總數</span>") + '</div>';
			
			if (command === 'total') {

				let currentValue = 
					this._sumup(gd.data);
				let pathData = 
					this.g.select('g.line-group > path[data-nation=總數]')
						.nodes()[0].__data__;
				let prevValue = 
					(gd.idx !== 0 ? this._sumup(pathData.data[gd.idx-1]) : 0);


				text += '<div><span>總額: </span><span> ' + currentValue + '千美元</span></div>';
				text += (
					'<div><span>較上月的變化:</span><span>' + 
						( (currentValue - prevValue ) / prevValue*100).toFixed(2) 
							+ '%</span></div>');

			} else if (command === 'total&China&percentage') {

				let totalValue = null,
					chinaValue = null;

				let totalData = 
					this.g.select('g.line-group > path:first-child')
						.nodes()[0].__data__;

				let chinaData =
					this.g.select('g.line-group > path[data-nation=中國]')
						.nodes()[0].__data__;

				d3.select('#Tip').append('svg')
					.attr('height', '50px')
					.attr('width', '80px');

				if (gd.nation === '中國') {

					chinaValue = 
						this._sumup(gd.data);
					totalValue = 
						this._sumup(totalData.data[gd.idx]);	

				} else {

					totalValue = 
						this._sumup(gd.data);
					chinaValue = 
						this._sumup(chinaData.data[gd.idx]);

				}

				text += '<div><span>總額: </span><span> ' + 
						( gd.nation === '中國' ?  chinaValue : totalValue) 
							+ '千美元</span></div>';
				text += '<div><span>中國佔總額比例: </span><span> ' + 
						( chinaValue/totalValue * 100).toFixed(2) 
							+ '%</span></div>';

			} else if ( command === 'allCountries' ) {

				let totalData = 
					JSON.parse(document.querySelector('body')
						.dataset.totalTradeData),
					totalTradeValue = 
						this._sumup(totalData.data[gd.idx]),
					otherData = [
						{
							// Use for doing comparsion with other countries
							nation: gd.nation,
							value : this._sumup(gd.data)
						}
					],
					rank = 0; // Taiwan Export Rank of the country

				/* Calculate Taiwan's export to the chosen country */
				text += (
					'<div><span>出口額: ' + otherData[0].value + '千美元</span></div>' +
					'<div><span>佔總出口比例: ' + (otherData[0].value/totalTradeValue * 100).toFixed(2) + 
					'% </span></div>');
					
				const paths = d3.selectAll('g.line-group > path').nodes();

				for ( let path of paths ) {

					let countryName = 
						d3.select(path).attr('data-nation');

					if ( countryName !== gd.nation) {
						otherData.push({
							nation: countryName,
							value: this._sumup(path.__data__.data[gd.idx])
						});
					}
				}

				/* Calculate Taiwan export to other countries. */
				let comparedResults = [];
				for ( let od of otherData ) {
					od['pct'] = od.value / totalTradeValue
					comparedResults.push(od);
				}

				comparedResults = 
					comparedResults
						.sort((a, b) => { return b['pct'] - a['pct'] })
						.filter((d, i) => { 
							if (d.nation === gd.nation) rank = i + 1;
							return i < 5 
						}); // Out put the top 5.

				text += '<div><span>台灣第' + rank +'大出口國</span></div>';

				text += '前五大台灣出口國(地區)';

				for (let c of comparedResults) {
					text += (
						'<div><span>國家: ' + c.nation + '</span></div>' +
						'<div><span>出口額: ' + c.value + '千美元</span></div>' +
						'<div><span>佔總出口比例: ' + (c.pct*100).toFixed(2) + '% </span></div>'
					)
				}

			}

			return text
		});

		this.g.call(this.dotTip);

		return this
	}

	storeOldData() {

		/* Store data of the existing paths */
		let paths = this.g.select('g.line-group').selectAll('path');
		
		if(!paths.empty()) {
			
			for ( let path of paths.nodes() ) {

				// Temp storing
				let _ = path.__data__;
				_ = { 
					nation: _.nation ? _.nation : '總數',  
					data  : _
				};
				
				this.oldData.push(_);
			}
		}
		return this
	}

	/* Delete the previous data */
	notInclude(dataIndices) {

		let newOldData = null;

		for ( let idx of dataIndices ) {

			newOldData = 
				this.oldData.filter((d, i) => {
					return i !== idx
				});

			this.g.select('g.line-group > path:nth-child('+ (idx+1) +')' ).remove();
		}

		this.oldData = newOldData;

		return this

	}

	addLine(dataSource) {

		this.storeOldData();
		return this.import(dataSource)
	}

	addMultiLines(dataSources) {

		this.storeOldData();
		return this.parallelImport(dataSources)
	}

	readJson(dataSource, resolved) {

		d3.json(dataSource, (err, jsonData) => {

			if (err) console.log(err.currentTarget.status)
			else {

				this.rowCols = 
					Object.keys(jsonData[0].data[0])
						.filter((col) => {
							return col !== 'mon' && col !== 'yr' 
						});
					
				resolved(jsonData);
			}
				
		});
	}

	import(dataSource) {

		this.dataImportP = new Promise((resolved, rejected) => {

			this.readJson(dataSource, resolved);
		});

		return this
	}

	/* Import multiple dataset in the same time */
	parallelImport(dataSources) {

		for ( let ds of dataSources ) {
			let p = new Promise((resolved, rejected) => {
				this.readJson(ds, resolved)
			});

			this.dataImportPs.push(p);
		}
		return this
	}

	pAllXAxis(isXOrdinal=false) {

		Promise.all(this.dataImportPs).then((results) => {
			this._getXTicks(isXOrdinal, results[0][0]);

		});
		return this
	}

	pAllYAxis(sumAll=false, combined=false) {

		Promise.all(this.dataImportPs).then((results) => {

			// Transformed the results into d[0].data format
			let _ = ((r) => {

				let s = [];

				for (let _r of r) {
					s = s.concat(_r[0].data);
				}

				return [ { data: s} ]

			})(results);

			this._updateYAxis(_, sumAll, combined);
		});
		return this
	}

	pAllDrawLines(sumAll, illustrators, illustratorsIdxExcepts) {

		Promise.all(this.dataImportPs).then((results) => {
			this._drawMultLines(results, sumAll, illustrators, illustratorsIdxExcepts);
		});

		return this
	}

	/* Must stick to import function */
	setXAxis(isXOrdinal=false) {

		this.dataImportP.then((d) => {

			if (isXOrdinal) {

				// Ticks on x axis.
				this.xTicks = d[0].data
					.map((d) => { return d.yr + '年' + d.mon + '月' });	
				
				this.xPoses = this._calXPoses();

				this.xScale = d3.scaleOrdinal(this.xPoses).domain(this.xTicks);
				this.xAxis = d3.axisBottom(this.xScale);

				this.g.append('g').classed('x-axis', true).call(this.xAxis);

				// Abjust the x axis position
				this.g.select('g.x-axis')
					.attr('transform', 'translate(0, ' + (this.height-50) + ')');

				// Mark asynchronous x axis process as completed
				this.xAxisP = Promise.resolve();
			}
		});

		return this
	}


	getXTicks(isXOrdinal=false) {

		this.dataImportP.then((d) => {
			this._getXTicks(isXOrdinal, d);
		});

		return this
	}

	/* Map the x positions */
	mapXPoses() {

		this.xPoses = (() => {
			
			let _ =
				this.g.selectAll('g.x-axis .tick')
					.nodes().map((node) => {
						return (
							d3.select(node).attr('transform')
								.replace('translate(', '').replace(',0)', '')
						)
					});
			return _
		})();

		return this
	}

	_getXTicks(isXOrdinal, d) {

		if (isXOrdinal) {
			
			// Ticks on x axis.
			if (d[0]) {
				
				this.xTicks = d[0].data
					.map((d) => { return d.yr + '年' + d.mon + '月' });
			} else {

				this.xTicks = d.data
					.map((d) => { return d.yr + '年' + d.mon + '月' });
			}
			this.xPoses = this._calXPoses();
		}
	}

	_calXPoses() {

		// The gap between each tick
		let xDelta = 
			(this.width - 
				(this.svgLeftPadding + this.svgRightPadding)) / (this.xTicks.length - 1);

		var _ = [];
		for (var i = 0; i < this.xTicks.length; i++)
			_.push(xDelta * i);

		return _
	}

	/* Set up the axes */
	setYAxis(sumAll) {

		this.dataImportP.then((d) => {

			if (sumAll) {
				this.yScale = 
					d3.scaleLinear()
						.domain([
							this._calMinDomain(d[0].data, this._sumup.bind(this)),
							this._calMaxDomain(d[0].data, this._sumup.bind(this))
						])
						.range([this.height-50, 50]);
			}

			this.yAxis = d3.axisLeft(this.yScale);
			this.g.append('g').classed('y-axis', true).call(this.yAxis);

			this.g.select('g.y-axis').append('text')
				.attr('transform', 'translate(-10,40)')
				.attr('fill', '#000')
				.text('千美元');

			// Mark asynchronous y axis process as completed
			this.yAxisP = Promise.resolve();
				
		});

		return this
	}


	/*
		combined: Combine the total value of every row data of multiple lines
	*/
	updateYAxis(sumAll=false, combined=false) {

		this.dataImportP.then((d) => {

			this._updateYAxis(d, sumAll, combined);

		});	
		return this	
	}

	updateYAxisWithOption(option) {

		this._updateYAxis(null, false, true, option);
		return this

	}

	_updateYAxis(d, sumAll, combined, option) {

		if (sumAll) {

			this.yScale = 
				d3.scaleLinear()
					.domain([
						this._calMinDomain(d[0].data, this._sumup.bind(this)),
						this._calMaxDomain(d[0].data, this._sumup.bind(this))
					])
					.range([this.height-50, 50]);
		}

		if (combined) {

			let combinedData = 
				this._flattenOldData(this.oldData)
					.concat(d ? d[0].data : []);

			if (option) {

				this.yScale = 
					d3.scaleLinear()
						.domain([
							d3.min(combinedData, (d, i) => { 
								return parseFloat(d[option].value) }),
							d3.max(combinedData, (d, i) => { 
								return parseFloat(d[option].value) })
						])
						.range([this.height-50, 50]);
			} else {
				this.yScale =
					d3.scaleLinear()
						.domain([
							this._calMinDomain(
								combinedData, 
								this._sumup.bind(this)),
							this._calMaxDomain(
								combinedData, 
								this._sumup.bind(this))
						])
						.range([this.height-50, 50]);
			}
		}

		this.yAxis = d3.axisLeft(this.yScale);

		this.g.select('g.y-axis')
			.transition()
				.duration(1000).call(this.yAxis);
	}

	/* Set up line generator */
	_setLineGenerator(sumAll, optName) {

		const self = this;

		this.lineGenerator = 
			d3.line()
				.x(function(d, i) {
					
					return self.xPoses[i]
				})
				.y(function(d, i) {
					return sumAll ? 
						self.yScale(parseFloat(self._sumup(d))) :
							self.yScale(parseFloat(d[optName].value))
				});

	}

	/* Draw the line chart */
	drawLine(sumAll=false, lineColor, optName) {

		const self = this;

		this.dataImportP.then((d) => {

			// When axis y and axis x are finished, it's time to draw the line.
			Promise.all([this.xAxisP, this.yAxisP]).then(() => {

				this._setLineGenerator(sumAll);

				this.g.append('g').classed('line-group', true)
					.append('path').attr('d', this.lineGenerator(d[0].data))
					.attr('stroke', lineColor)
					.attr('stroke-width', '3px')
					.attr('fill', 'transparent')
					.attr('opacity', 0.6)
					.attr('data-nation', d[0].nation ? d[0].nation : "總數")
					.datum({ // Binding the data to the path
						name: d[0].nation ? d[0].nation : "總數",
						data: d[0].data
					})
					.on('mouseenter', (d, i, node) => {
						d3.select(node[0]).attr('opacity', 1);
					})
					.on('mouseleave', (d, i, node) => {
						d3.select(node[0]).attr('opacity', 0.3);
					})
					.call((selection) => {

						/* Mark the points */
						// let pts = this.parsePathDToDots(selection.attr('d'));
						let pts = this.bindDataOnDots(d[0], sumAll);
						// console.log(pts);
						this.appendPts(pts, lineColor);
					}); 
			});
		});

		return this
	}

	drawMultiLines(sumAll, illustrators, illustratorsIdxExcepts) {

		this.dataImportP.then((d) => {
			this._drawMultLines(d, sumAll, illustrators, illustratorsIdxExcepts);
		});
		return this
	}

	_drawMultLines(d, sumAll, illustrators, illustratorsIdxExcepts, option) {

		// Copy original line
			const originPathD = 
				this.g.select('g.line-group > path').attr('d');
			
			// Create new lines with previous setting
			for ( let i = 0; i < illustrators.length; i++ ) {

				if(!illustratorsIdxExcepts.has(i)) {
					
					this.g.select('g.line-group')
						.append('path')
							.attr('d', originPathD)
							.attr('stroke', illustrators[i].color)
							.attr('stroke-width', 3)
							.attr('data-color', illustrators[i].color)
							.attr('fill', 'transparent')
							.attr('opacity', 0.3)
							.attr('data-nation', illustrators[i].nation)
							.on('mouseenter', (d, i, node) => {
								d3.select(node[0]).attr('opacity', 1);
							})
							.on('mouseleave', (d, i, node) => {
								d3.select(node[0]).attr('opacity', 0.6);
							});;
				}
			}

			// Set up the line generator
			this._setLineGenerator(sumAll);

			const paths =
				this.g.select('g.line-group').selectAll('path').nodes();

			const dataSeq = ((cd, od) => {

				let _ = [];

				for ( let o of od ) 
					_.push(o.data)
				

				if (cd.length <= 1)
					return [].concat(_).concat(cd)
				else {
					let t = [];
					for (let _cd of cd ) {
						t.push(_cd[0]);
					}
					return [].concat(_).concat(t)
				}
			

			})(d, this.oldData);

			let i = 0;
			for ( let path of paths ) {
				console.log('path: ', path);
				d3.select(path)
					.attr('data-nation', dataSeq[i].nation)
					.datum(dataSeq[i])
					.transition().duration(1000)
						.attr('d', this.lineGenerator(dataSeq[i].data))
						
						.on('end', (data, index, nodes) => {
							let nodeSelection = d3.select(nodes[0]),
								pts = this.bindDataOnDots(data , sumAll, option);

							this.appendPts(pts, 
								nodeSelection.attr('data-color'), 
								nodeSelection.attr('data-nation'));

						})
						
				i++;
			}
		
	}

	reMapLines(option) {

		// Set up the line generator
		this._setLineGenerator(false, option);

		const paths =
				this.g.select('g.line-group').selectAll('path').nodes();

		const dataSeq = ((cd, od) => {

			let _ = [];

			for ( let o of od ) 
				_.push(o.data)
				

			if (cd.length <= 1)
				return [].concat(_).concat(cd)
			else {
				let t = [];
				for (let _cd of cd ) {
					t.push(_cd[0]);
				}
				return [].concat(_).concat(t)
			}
			

		})([], this.oldData);
		
		let i = 0;
		for ( let path of paths ) {
			d3.select(path).datum(dataSeq[i])
				.transition().duration(1000)
					.attr('d', this.lineGenerator(dataSeq[i].data, option))
					.attr('data-nation', dataSeq[i].nation)
					.on('end', (data, index, nodes) => {
						
						let nodeSelection = d3.select(nodes[0]),
							pts = this.bindDataOnDots(data, false, option);
						this.appendPts(pts, nodeSelection.attr('data-color'));
					});
				i++;
		}		

		return this
	}


	// Binding data on dots
	bindDataOnDots(data, sumAll, option) {
		
		let i = 0,
			pts = [];

		if (option) {

			for (let d of data.data) {

				pts.push({
					nation: data.nation ? data.nation : '總數',
					data  : d,
					idx   : i,
					x     : this.xPoses[i],
					y     : this.yScale(d[option].value)
				});
				i++;
			}

		} else if (sumAll) {

			for (let d of data.data) {

				pts.push({
					nation: data.nation ? data.nation : '總數',
					data  : d,
					idx   : i,
					x     : this.xPoses[i],
					y     : this.yScale(this._sumup(d))
				});
				i++;
			}
		}
		return pts

	}

	dumpTip() {
		
		d3.select('#Tip').remove();

		return this
	}

	removePts() {
		this.g.selectAll('g.circle-group').remove();
		return this
	}

	appendPts(dataBindPts, color, nation) {
		
		this.g.append('g').classed('circle-group', true)
			.attr('data-nation', nation)
			.selectAll('circle')
				.data(dataBindPts).enter()
					.append('circle')
					.attr('r', 2.5)
					.attr('fill', color)
					.attr('cx', function(d) { return d.x })
					.attr('cy', function(d) { return d.y })
					.on('mouseenter', (d) => {
						this.dotTip.show(d);
					})
					.on('mouseleave', (d) => {
						this.dotTip.hide();
					});
	}

	_flattenOldData(oldData) {
		
		let flattenOldData = [];

		for (let od of oldData) {
			for ( let d of od.data.data ) 
				flattenOldData.push(d);
		} 
			
		return flattenOldData

	}

	// Calculate the minimum of domain
	// Minus 5% to make chart not so crowded
	_calMinDomain(data, f) {
		let _ = d3.min(data, function(d) { return parseFloat(f(d)) })
		return _ - 0.05*_
	}

	// Calculate the maximum of domain.
	// Add 5% to make chart not so crowded
	_calMaxDomain(data, f) {
		let _ = d3.max(data, function(d) { return parseFloat(f(d)) })
		return _ + 0.05*_
	}

	/* Sump up the whole properties */
	_sumup(d) {

		let s = 0;
		
		if (typeof d[this.rowCols[0]] === 'object')
			for (var i = 0; i < this.rowCols.length; i++)  {
				s += parseFloat(d[this.rowCols[i]].value);
			}
			
		else
			for (var i = 0; i < this.rowCols.length; i++) 
				s += parseFloat(d[this.rowCols[i]]);
		
		return s
	}

}

export default LineGraph