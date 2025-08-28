import React from "react";
import Select from "./select.jsx";
import Axios from "axios";

export default class Partner extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);

    this.state = {
      name: "Partner",
      type: "text",
      options: [],
    };
  }

  handleChange(data) {
    const { id } = this.props;
    const value = data[id];
    const partnerData = this.state.options.find(
      (option) => option.value === value
    )?.data;

    this.props.onChange(partnerData);
  }

  componentDidMount() {
    Axios.get("/resource/partner")
      .then((data) => data.data)
      .then((options) => {
        this.setState({ options });

        options.length &&
          this.handleChange({ [this.props.id]: options[0].value });
      });
  }

  render() {
    const { value, id } = this.props;

    return (
      <Select
        {...this.state}
        id={id}
        value={value}
        onChange={this.handleChange}
      />
    );
  }
}
