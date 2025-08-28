import React from "react";
import Axios from "axios";
import { showAlert } from "../../util.jsx";
import Input from "../input.jsx";

export default class DeepLink extends React.Component {
    constructor() {
        super();

        this.state = {
            url: "",
            newURL: ""
        };

        this.onChangeValue = this.onChangeValue.bind(this);
    }

    componentDidMount() {
        Axios.get("/resource/deeplink")
            .then((data) => data.data)
            .then((data) => this.setState({ url: data.value }));
    }

    onChangeValue(data) {
        this.setState(data);
    }

    handleSubmit(event) {
        Axios.post("/resource/deeplink", { value: this.state.newURL })
            .then((data) => data.data)
            .then((data) => (data.error ? Promise.reject(data.error) : data))
            .then(({ value }) => this.setState({ url: value }))
            .catch(showAlert);

        event.preventDefault();
    }

    render() {
        return (
            <div className="section">
                <form onSubmit={(event) => this.handleSubmit(event)}>
                    <div className="row">
                        <div className="col-sm-12 col-md-6">
                            <fieldset className="container">
                                <legend>Deep Link</legend>
                                <Input type="text" id="newURL" name="URL" value={this.state.newURL} onChange={this.onChangeValue} />
                            </fieldset>
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <fieldset className="container">
                                <legend>Supported</legend>
                                <ul>{this.state.url}</ul>
                            </fieldset>
                        </div>
                    </div>
                    <input className="primary" type="submit" value="Update" />
                </form>
            </div>
        );
    }
}
