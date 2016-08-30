// Modules import
import LineGraph from '../modules/lineGraph'

let storyIdx = 0;

const illustrators = [
			{
				"name": "總數",
				"shape": "rect",
				"color": "#08c"
			},
			{
				"name": "中國",
				"shape": "rect",
				"color": "#C44536"
			},
			{
				"name": "美國",
				"shape": "rect",
				"color": "#197278"
			},
			{
				"name": "日本",
				"shape": "rect",
				"color": "#F49D37"
			},
			{
				"name":"以色列",
				"shape": "rect",
				"color": "#85C7DE"
			},
			{
				"name":"伊朗",
				"shape": "rect",
				"color": "#A288A6"
			},
			{
				"name": "俄羅斯",
				"shape": "rect",
				"color": "#CCBCBC"
			},
			{
				"name": "加拿大",
				"shape": "rect",
				"color": "#EF6461"
			},
			{
				"name": "匈牙利",
				"shape": "rect",
				"color": "#E4B363"
			},
			{
				"name": "南非",
				"shape": "rect",
				"color": "#E0DFD5"
			},
			{
				"name": "印尼",
				"shape": "rect",
				"color": "#C6D8AF"
			},
			{ 
				"name": "印度",
				"shape": "rect",
				"color": "#685369"
			},
			{ 
				"name": "土耳其",
				"shape": "rect",
				"color": "#FCC8B2"
			},
			{ 
				"name": "埃及",
				"shape": "rect",
				"color": "#EFA48B"
			},
			{ 
				"name": "墨西哥",
				"shape": "rect",
				"color": "#FF9B42"
			},
			{ 
				"name": "孟加拉",
				"shape": "rect",
				"color": "#00A7E1"
			},
			{ 
				"name": "巴基斯坦",
				"shape": "rect",
				"color": "#3B413C"
			},
			{ 
				"name": "巴西",
				"shape": "rect",
				"color": "#94D1BE"
			},
			{ 
				"name": "德國",
				"shape": "rect",
				"color": "#8B5FBF"
			},
			{
				"name":"斯里蘭卡",
				"shape": "rect",
				"color": "#D183C9"
			},
			{
				"name":"新加坡",
				"shape": "rect",
				"color": "#643A71"
			},
			{
				"name":"柬埔寨",
				"shape": "rect",
				"color": "#D64550"
			},
			{
				"name":"比利時",
				"shape": "rect",
				"color": "#DAEFB3"
			},
			{
				"name":"沙烏地阿拉伯",
				"shape": "rect",
				"color": "#CA5310"
			},
			{
				"name":"法國",
				"shape": "rect",
				"color": "#EA9E8D"
			},
			{
				"name":"波蘭",
				"shape": "rect",
				"color": "#691E06"
			},
			{
				"name":"泰國",
				"shape": "rect",
				"color": "#FBBA72"
			},
			{
				"name":"澳大利亞",
				"shape": "rect",
				"color": "#8F250C"
			},
			{
				"name":"瑞典",
				"shape": "rect",
				"color": "#B4656F"
			},
			{
				"name":"瑞士",
				"shape": "rect",
				"color": "#948392"
			},
			{
				"name":"紐西蘭",
				"shape": "rect",
				"color": "#4E937A"
			},
			{
				"name":"義大利",
				"shape": "rect",
				"color": "#849483"
			},
			{
				"name":"英國",
				"shape": "rect",
				"color": "#FFE19C"
			},
			{
				"name":"荷蘭",
				"shape": "rect",
				"color": "#FF784F"
			},
			{
				"name":"菲律賓",
				"shape": "rect",
				"color": "#3A3042"
			},
			{
				"name":"西班牙",
				"shape": "rect",
				"color": "#6B9080"
			},
			{
				"name":"越南",
				"shape": "rect",
				"color": "#A4C3B2"
			},
			{
				"name":"阿拉伯聯合大公國",
				"shape": "rect",
				"color": "#CCE3DE"
			},
			{
				"name":"韓國",
				"shape": "rect",
				"color": "#EE5622"
			},
			{
				"name":"香港",
				"shape": "rect",
				"color": "#ECA72C"
			},
			{
				"name":"馬來西亞",
				"shape": "rect",
				"color": "#31263E"
			}
		];


/* Get the story data */
const storyData = 
	[{
		"title": "台灣對外的貿易",
		"paragraphs": [
			"台灣從民國90年7月到105年7月，這十五年間，出口額度從6,912,455仟美元，上升至15,804,549仟美元，增加近130%。凸顯國際貿易對台灣的重要性以及台灣以出口為導向的市場。",
			""
		],
		"dataSource": "./data/HS/json/總數.json",
		"illustrators": [
			{
				"name": "總數",
				"shape": "rect",
				"color": "#08c"
			}
		]
	}, {
		"title": "中國佔台灣出口的貿易總額",
		"paragraphs": [
			"1989年，因著天安門事件，中國受到國際的經濟制裁，經濟發展停滯。是故在民國90年初期，我國出口大陸市場的總值僅佔3個百分點。",
			"因著大陸極具潛力的勞動力與消費性的市場，許多外籍企業包括台灣將無數的資金與技術帶入中國，造就中國往後15年的經濟榮景。",
			"中國經濟的崛起，儼然使之成為台灣最主要的貿易夥伴，如今台灣出口至中國大陸貿易額已超過百分之二十。"
		],
		"dataSource": "./data/HS/json/中國.json",
		"actions": [
			{
				"name": "importChinaDataset"
			}
		],
		"illustrators": [
			{
				"name": "總數",
				"shape": "rect",
				"color": "#08c"
			},
			{
				"name": "中國",
				"shape": "rect",
				"color": "#C44536"
			}
		]
	},
	{
		"title": "台灣的主要出口國家(地區)",
		"paragraphs": [
			"民國90年初以出口為導向的台灣，最主要的市場為歐美日等成熟的經濟體。在民國91年，台灣出口至大陸的貿易產值驟升，15年後對中國大陸與香港的總出口高達6,487,645仟美元，佔台灣整體出口高達41個百分點。",
			"然而台灣與大陸雙方特殊的政治關係，台灣高度依賴大陸市場的經濟結構令許多人擔憂，促使當今的台灣政府展開南向政策，減少對單一市場的依賴。"
		],
		"dataSources": [
			"./data/HS/json/美國.json",
			"./data/HS/json/日本.json",
			"./data/HS/json/以色列.json",
			"./data/HS/json/伊朗.json",
			"./data/HS/json/俄羅斯.json",
			"./data/HS/json/加拿大.json",
			"./data/HS/json/匈牙利.json",
			"./data/HS/json/南非.json",
			"./data/HS/json/印尼.json",
			"./data/HS/json/印度.json",
			"./data/HS/json/土耳其.json",
			"./data/HS/json/埃及.json",
			"./data/HS/json/墨西哥.json",
			"./data/HS/json/孟加拉.json",
			"./data/HS/json/巴基斯坦.json",
			"./data/HS/json/巴西.json",
			"./data/HS/json/德國.json",
			"./data/HS/json/斯里蘭卡.json",
			"./data/HS/json/新加坡.json",
			"./data/HS/json/柬埔寨.json",
			"./data/HS/json/比利時.json",
			"./data/HS/json/沙烏地阿拉伯.json",
			"./data/HS/json/法國.json",
			"./data/HS/json/波蘭.json",
			"./data/HS/json/泰國.json",
			"./data/HS/json/澳大利亞.json",
			"./data/HS/json/瑞典.json",
			"./data/HS/json/瑞士.json",
			"./data/HS/json/紐西蘭.json",
			"./data/HS/json/義大利.json",
			"./data/HS/json/英國.json",
			"./data/HS/json/荷蘭.json",
			"./data/HS/json/菲律賓.json",
			"./data/HS/json/西班牙.json",
			"./data/HS/json/越南.json",
			"./data/HS/json/阿拉伯聯合大公國.json",
			"./data/HS/json/韓國.json",
			"./data/HS/json/香港.json",
			"./data/HS/json/馬來西亞.json"
		],
		"actions": [
			{
				"name": "importMultiNewDatasets"
			}
		],
		"illustrators": illustrators
	},
	{
		"title": "HS制的64個貿易品項",
		"paragraphs": [
			"",
			""
		],
		"dataSource": "",
		"actions": [
			{
				"name": "selectItemInHS"
			}
		],
		"illustrators": illustrators
	}];

const Indicator = React.createClass({
	render() {
		return (
			<div className="indicator">
				<span className="ver-helper"></span>
				<div className={
					this.props.index === storyIdx ?
						"button active": "button"} >
				</div>
			</div>
		)
	}
});

const RightIndicatorHub = React.createClass({

	incrementIndiIdx() {
		this.props.nextStory();
	},

	render() {

		let indics = []; 

		for (let i = 0; i < storyData.length; i++) 
			indics.push(<Indicator key={i} index={i}/>);

		return (
			<div id="Indicators">
				{ indics }
				<Next incrementIndiIdx={ this.incrementIndiIdx } />
			</div>
			)
	}
});

const Next = React.createClass({

	next() {
		this.props.incrementIndiIdx();
	},

	render() {
		return (
			<div id="Next" className="indicator" onClick={ this.next }>
				<span className="bar"></span>
				<span className="bar"></span>
			</div>
			)
	}
});

const InfoLayer = React.createClass({

	render() {

		let ps = storyData[storyIdx].paragraphs,
			paragraphs = [];

		let i = 0;
		for (let _ps of ps) {
			paragraphs.push(<p key={i}>{ _ps }</p>);
			i++;
		}

		return (
			<section id="INFO_LAYER">
				<h2>{ storyData[storyIdx].title }</h2>
				{ paragraphs }
			</section>
			)
	}
});

const IllustratorItem = React.createClass({

	render() {
		return (
			<li className="item">
				<span className="ver-helper"></span>
				<svg className="icn">
					{ this.props.shape === "rect" ? 
						<rect className="" fill={this.props.color}></rect>: null
					}
				</svg>
				<span className="txt">{ this.props.name }</span>
			</li>
		)
	}
});


const IllustratorLayer = React.createClass({

	render() {

		let i = 0,
			illustratorArray = [];

		if ( this.props.illustrators.length < 5 ) {
			for ( let illustrator of this.props.illustrators ) {
				illustratorArray.push(
					<IllustratorItem 
						key = {i}
						name={ illustrator.name } 
						shape={ illustrator.shape } 
						color={ illustrator.color } />);
				i++;
			}
		}

		return (
			<div id="Illustrator">
				<ul className="ullist">
					{ illustratorArray }
				</ul>
			</div>
		)
	}
});


const ItemSelectOption = React.createClass({

	// selectAction(e) {
	// 	console.log(e);
	// 	this.props.selectItem();
	// },

	render() {
		return (
			<option value={ this.props.itemName }>{ this.props.itemName }</option>
		)
	}
});

const ItemSelector = React.createClass({

	changeItem(e) {
		this.props.selectItem(e.target.value);
	},

	render() {

		let itemNames = [
			'鮮冷凍之動物肉類及食用雜碎', 
			'活魚，生鮮或冷藏魚，冷凍魚等', 	
			'活、生鮮、冷藏、冷凍乾、鹹或浸鹹甲殼類及軟體類動物', 	
			'已調製或保藏之魚類、魚子醬及由魚卵調製之魚子醬代替品', 	
			'原油以外之石油及提自瀝青之油類', 	
			'聚合製品及共聚合製品', 	
			'人造樹脂及塑膠材料製品',
			'橡膠輪胎',
			'旅行用品，手提袋及類似容器',
			'合板，單板，貼面板及類似集成材',
			'其他木製品', 	
			'人造纖維絲製之線紗，再生纖維紗', 	
			'合成纖維絲紗梭織物，再生纖維絲紗梭織物', 
			'棉梭織物', 	
			'未初梳未精梳或未另行處理以供紡製用之合成纖維棉及再生織維棉', 	
			'非供零售用之合成纖維棉紗及再生纖維棉紗', 	'合成纖維棉梭織物', 	
			'用塑膠浸漬塗佈被覆或黏合之紡織物', 	'針織或鉤針織圈絨織物', 	
			'針織或鉤織製內衣', 	
			'針織或鉤織外衣及其他製品', 	
			'男用或男童用外衣', 	
			'女用或女童用外衣', 	
			'外底及鞋面以橡膠或塑膠製之鞋靴', 	
			'外底以橡膠塑膠皮或組合皮製之鞋靴，而鞋面以皮或紡織材料製者', 	
			'其他鞋靴', '雨傘及陽傘', 	'陶瓷塑像及其他裝飾瓷製品', 	
			'其他陶瓷製品', 	'仿首飾', 	'鋼鐵製螺釘，螺栓，螺帽及類似製品', 	
			'其他鋼鐵製品', 	'銼及木銼，鉗，手用板手及板鉗等手工具', 	
			'未列名之手工具', '未列名之燈具及照明配件及零件',  	
			'縫紉機', 	'金屬或金屬碳化物工作用工具機', 	
			'計算器，會計機，收銀機，郵資機，售票機等', 	
			'自動資料處理機及其附屬單元等', 	'專用或主要用於第８４６９至８４７１節機器之零件及附件',	
			'第８４章未列名之機器及機械用具','電動機及發電機等各種電力機械', '家用電動用具附裝電動機者',  	
			'電話機，包括手機及無線網路電話；耳機', 	'微音器及其座；揚聲器等', 	
			'無線電廣播或電視之傳輸器具、數位相機、雷達及無線電導航', 	
			'固定，可變或可預先調整之電容器', 	'電阻器，印刷電路，電話開關，保護電路用之電器具等', 	
			'熱冷陰極管及光陰極管二極體，電晶體等', 	'絕緣電線電纜及其他?緣電導體', 	
			'第８７０１至８７０５節機動車輛所用之零件及附件',	'非動力之二輪腳踏車及其他腳踏車', 	
			'第８７１１至８７１３節所列車輛之零件及附件',	'供載客或載貨用船舶；漁船；遊艇', 	
			'眼鏡，護目鏡及類似供矯正助保護眼睛或其他用途者', 	'照相機', 	
			'唱盤，電唱機，卡式放音機，錄音機，錄放影器具', 	
			'第８５１９至８５２１節所列機器之零件及附件',	
			'座物不論是否可轉換成床者；及其零件', 	'其他傢俱及其零件', 	
			'其他玩具', 	'遊樂會，桌上或室內遊戲品', 	'慶典，狂歡節或其他遊藝用品', 	
			'體操競技比賽其他運動或戶外遊戲用物品及設備' 
			],
			options = [];

		let i = 0;
		for (let itemName of itemNames) {
			options.push(
				<ItemSelectOption
					key={i} itemName={ itemName } 
					selectItem={ this.props.changeItem } />
				);
			i++;
		}

		return (
			<select id="ItemSelector" onChange={ this.changeItem }>
				{ options }
			</select>
		)	
	}
	
});


const VizLayer = React.createClass({

	initVizObjects() {
		return {
			lg: new LineGraph(),
			
		}
	},

	selectItem(itemName) {
		this.setState({'currentItem': itemName });
	},

	getInitialState() {
		return {
			currentItem: '鮮冷凍之動物肉類及食用雜碎'
		}
	},

	componentDidUpdate() {

		const lg = 
			this.initVizObjects().lg
				.mapXPoses()
				.removePts()
				.dumpTip()
				.setHeight(window.innerHeight).setWidth(window.innerWidth);

		let actions = storyData[storyIdx].actions;
		
		for ( let act of actions ) {

			if ( act.name === 'importChinaDataset') {
				lg.addLine(storyData[storyIdx].dataSource)
					.getXTicks(true).updateYAxis(false, true)
						.drawMultiLines(true, storyData[storyIdx].illustrators, new Set([0]))
						.setTipFormat('total&China&percentage');
			}

			else if ( act.name === 'importMultiNewDatasets') {

				// Save total trade data in other places.
				document.querySelector('body')
					.dataset.totalTradeData = 
						JSON.stringify(
							d3.select('g.line-group > path:first-child')
								.nodes()[0].__data__);


				lg.addMultiLines(storyData[storyIdx].dataSources)
					.notInclude([0])
					.pAllXAxis(true)
					.pAllYAxis(true, true)
						.pAllDrawLines(true, storyData[storyIdx].illustrators, new Set([0, 1]))
						.setTipFormat('allCountries');	
			}

			else if ( act.name === 'selectItemInHS') {
				
				let newSelectedItem = this.state['currentItem'];
				
				lg.storeOldData().mapXPoses()
					.updateYAxisWithOption(newSelectedItem)
						.reMapLines(newSelectedItem);

			}
		}
	},

	componentDidMount() {

		// Initial a svg for painting.
		d3.select('#VIZLAYER').append('svg');

		this.initVizObjects().lg
			.setHeight(window.innerHeight).setWidth(window.innerWidth)
				.import('./data/HS/json/總數.json')
				.setXAxis(true).setYAxis(true)
				.drawLine(true, storyData[storyIdx].illustrators[0].color)
				.setTipFormat('total');
	},

	render() {
		
		return (
			<div id="VIZLAYER">
				{ storyIdx === 3 ? <ItemSelector selectItem={ this.selectItem }/> : null}
			</div>
		)
	}
});

const App = React.createClass({

	getInitialState() {
		return {
			storyIndex: 0
		}
	},

	nextStory() {
		storyIdx ++;
		this.setState({storyIndex: this.state['storyIndex'] + 1});
	},

	render() {

		const icns = storyData[storyIdx].illustrators

		return (
			<article>
				<InfoLayer />
				<VizLayer />
				<RightIndicatorHub nextStory={ this.nextStory } />
				<IllustratorLayer illustrators={ storyData[storyIdx].illustrators }  />
			</article>
		)
	}
});

ReactDOM.render(
	<App />,
	document.querySelector('#CONTAINER')
	
);