import React from 'react';
import axios from 'axios';
import logo from './images/logo-with-skull.png';
import './App.scss';

const config = require('./config');

class App extends React.Component {
	constructor(props, context) {
		super(props);
		this.default_prompt = {"id":0,"channel":"#soflne","username":"","prompt":"Waiting for prompt...","command":"","text":"","created_at":"","active":1}
		this.delay = config.refresh_delay;
		this.get = this.get.bind(this);

		this.state = {
			text: this.default_prompt.text,
			prompt: this.default_prompt.prompt,
			guesses: this.renderGuesses({})
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
				var data = resp.data.data.length>0?resp.data.data[0]:this.default_prompt,
					guess = resp.data.data.length>0?resp.data.data[0].guess:"{}",
					score_users = Object.keys(resp.data.scores).sort(function(a,b){return resp.data.scores[b]-resp.data.scores[a]}),
					scores = [];
				for(var i=0; i<5; i++) {
					scores.push({ "username":score_users[i], "score": resp.data.scores[score_users[i]]});
				}
				self.setState({
					text: data.text,
					prompt: data.prompt,
					word: data.word,
					guesses: self.renderGuesses(JSON.parse(guess)),
					scores: self.renderScores(scores)
				});
				//console.log(self.state)
					
			}).catch(function (error) {
				console.log(error);
			});

	}
	renderScores(scores) {
		var html = []
		for(var i =0; i<scores.length; i++) {
			html.push(<tr key={i}>
				<td><div>#{i+1}</div></td>
				<td><div>{scores[i].score}</div></td>
				<td><div>{scores[i].username}</div></td>
			</tr>);
		}
		return html;

	}
	renderGuesses(guesses) {
		if(!guesses || guesses=="") {
			guesses = {}
		}
		
		var html = []
		if(Object.keys(guesses).length>0) {
			for(var username in guesses) {
				html.push(<div key={username} className="guess--item">
						<div>{username}</div>
						<div>{guesses[username]}</div>
					</div>
				);
			}
		}
		else {
			html.push(<div key="none" id="none">No Guesses Yet</div>)
		}
		
		/*
		for(var i =0; i<guesses.length; i++) {
			
		}
		*/
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
							<div id="misc">
								<div className="section--title">
									<h2>Instructions</h2>
								</div>
								<div className="misc--content">
									<p>Guess the next word using <span>!guess (someword)</span> or start a new prompt with
									 <span>!prompt (whatever text you want)</span>.</p>

								</div>
							</div>
							<div id="scores">
								<div className="section--title">
									<h2>Scoreboard</h2>
								</div>
								<table className="table" border={0} cellSpacing="0" cellPadding="0">
									<thead>
										<tr>
											<th>Rank</th>
											<th>Score</th>
											<th>User</th>
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
									
									<div id="text"><span className="text-prompt">{ this.state.prompt }</span> { this.state.text.substring(this.state.prompt.length+1) }</div>
								</div>

							</div>
							<div id="info">
							<h1 id="prompt">“{ this.state.prompt }”</h1>
								<div className="row">
									<div id="guesses">
										<div className="section--title">
											<h2>Guesses</h2>
										</div>
										<div className="guess--container">
											{this.state.guesses}
											
										</div>
									</div>
									<div>
										<div className="section--title">
											<h2>Correct Word</h2>
										</div>
										<div id="correct_word">
											{typeof this.state.word!="undefined"&&this.state.word!=""?"“"+this.state.word+"”":""}
										</div>
									</div>
									
								</div>
								
								
								
							</div>
						</div>
					</div>
					
				</div>
			</div>
		);
	}
}

export default App;
