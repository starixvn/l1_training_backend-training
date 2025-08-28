import React from "react";
import Axios from "axios";
import Input from "../input.jsx";
import config from "../../../game-client-config.json";

export default class DeepLink extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);

        this.state = {
            name: "Deep Link",
            type: "text",
            options: []
        };
    }

    handleChange(data) {
        this.props.onChange(data);
    }

    componentDidMount() {
        Axios.get("/resource/deeplink")
            .then((data) => data.data)
            .then(({ value }) => this.props.onChange({ [this.props.id]: `${value}?uri=${config.connectSiteUrl}` }));
    }

    render() {
        const { value, id } = this.props;
        return <Input value={value} id={id} onChange={this.handleChange} />;
    }
}
