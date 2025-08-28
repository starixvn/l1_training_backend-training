import Axios from "axios";
import React from "react";

import { showAlert } from "../../util.jsx";
import Input from "../input.jsx";
import LanguageSelect from "../select/language.jsx";

export default class HitJackpot extends React.Component {
  constructor() {
    super();

    this.state = {
      obCustId: (Math.random() * 10000000) >> 0,
      siteId: "4100300",
      gameRoundId: 1,
      gameTypeId: 1,
      winningAmount: (Math.random() * 100000) >> 0,
      languageCode: "vi-VN",
      result: null,
      resource: {
        game: [],
      },
    };

    this.changeValue = this.changeValue.bind(this);
  }

  changeValue(data) {
    this.setState(data);
  }

  handleChange(event) {
    const state = this.state;
    if (event.target.id === "gameTypeId") {
      state.choiceId = 1;
      state[event.target.id] = parseInt(event.target.value);
    } else {
      state[event.target.id] = event.target.value;
    }

    this.setState(state);
  }

  handleSubmit(event) {
    const request = Object.assign({}, this.state, {
      result: undefined,
      resource: undefined,
    });

    Axios.post("/member/hitJackpot", request)
      .then((data) => data.data)
      .then((data) => (data.error ? Promise.reject(data.error) : data))
      .then((result) => this.setState({ result }))
      .catch(showAlert);

    event.preventDefault();
  }

  componentDidMount() {
    Axios.get("/resource/currency")
      .then((data) => data.data)
      .then((currency) =>
        Axios.get("/resource/game")
          .then((data) => data.data)
          .then((game) => ({
            currency,
            game,
          }))
      )
      .then((resource) => this.setState({ resource }));
  }

  render() {
    return (
      <div className="section">
        <div className="row">
          <div className="col-sm-12 col-md-6">
            <form onSubmit={(event) => this.handleSubmit(event)}>
              <fieldset className="container">
                <legend>Jackpot</legend>
                <Input
                  type="int"
                  id="obCustId"
                  name="Member ID"
                  value={this.state.obCustId}
                  onChange={this.changeValue}
                />
                <Input
                  type="text"
                  id="siteId"
                  name="Site ID"
                  value={this.state.siteId}
                  onChange={this.changeValue}
                />
                <Input
                  type="int"
                  id="gameRoundId"
                  name="Game Round ID"
                  value={this.state.gameRoundId}
                  onChange={this.changeValue}
                />

                <div className="input-group vertical">
                  <label htmlFor="gameTypeId">Game</label>
                  <select
                    id="gameTypeId"
                    onChange={(event) => this.handleChange(event)}
                    value={this.state.gameId}
                  >
                    {this.state.resource.game.map((game) => (
                      <option value={game.id} key={game.id}>
                        {game.name}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  type="float"
                  id="winningAmount"
                  name="Winning Amount"
                  step="0.01"
                  value={this.state.amount}
                  onChange={this.changeValue}
                />

                <LanguageSelect
                  onChange={this.changeValue}
                  id="languageCode"
                  value={this.state.languageCode}
                />
                <input className="primary" type="submit" value="Bet" />
              </fieldset>
            </form>
          </div>
          <div className="col-sm-12 col-md-6">
            <fieldset className="container">
              <legend>Hit Jackpot Result</legend>
              <pre>{JSON.stringify(this.state.result, null, 2)}</pre>
            </fieldset>
          </div>
        </div>
      </div>
    );
  }
}
