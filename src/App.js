import React from 'react';
import axios from 'axios';
import logo from './images/soflne-text.png';
import './App.scss';

const config = require('./config');

class App extends React.Component {
	constructor(props, context) {
		super(props);
		this.default_prompt = {"id":0,"channel":"#soflne","username":"","prompt":"Waiting for prompt...","command":"","text":"","created_at":"","active":1}
		this.delay = config.refresh_delay;
		this.get = this.get.bind(this);

		this.state = {
			current_text: this.default_prompt.text,
			current_prompt: this.default_prompt.prompt,
		}
		
	}
	componentDidMount() {
		setInterval(()=>{
			this.get();
		}, this.delay);
	}
	get() {
		const self = this;
		
			axios.get(config.api_url, {}, {
				headers: {
					'Content-Type': 'application/json',
				}
			}).then((resp)=>{
				var data = resp.data.data.length>0?resp.data.data[0]:this.default_prompt
				var score_users = Object.keys(resp.data.scores).sort(function(a,b){return resp.data.scores[b]-resp.data.scores[a]})
				var scores = [];
				for(var i=0; i<5; i++) {
					scores.push({ "username":score_users[i], "score": resp.data.scores[score_users[i]]});
				}
				self.setState({
					text: data.text,
					prompt: data.prompt,
					scores: self.renderScores(scores)
				});
					
			}).catch(function (error) {
				console.log(error);
			});

	}
	renderScores(scores) {
		var html = []
		for(var i =0; i<scores.length; i++) {
			html.push(<tr>
				<td><div>#{i+1}</div></td>
				<td><div>{scores[i].username}</div></td>
				<td><div>{scores[i].score}</div></td>
			</tr>);
		}
		return html;

	}
	render() {
		return (
			<div className="App">
				<div className="container">
					<div className="row">
						<div className="col" id="sidebar">
							<div className="title">
								<img src={logo} alt="Soflne" />
							</div>
							<div id="chat"></div>
							<div id="misc"></div>
							<div id="scores">
								<h2>Scoreboard</h2>
								<table className="table" border={0} cellSpacing="0" cellPadding="0">
									<thead>
										<tr>
											<th>Rank</th>
											<th>User</th>
											<th>Score</th>
										</tr>
									</thead>
									<tbody>
										{this.state.scores}
										
									</tbody>
								</table>
							</div>
							
						</div>
						<div className="col" id="content">
							<div id="console-container">
								<div id="console">
									<h1 id="prompt">“{ this.state.prompt }”</h1>
									<div id="text">{ this.state.text }</div>
								</div>

							</div>
							<div id="info">
								Guess the next word using "<span>!guess (someword)</span>". Start a new prompt with "<soan>!prompt (whatever text you want)</soan>". https://github.com/salesforce/ctrl
							</div>
						</div>
					</div>
					
				</div>
			</div>
		);
	}
}

export default App;
