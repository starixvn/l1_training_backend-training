import Select from "./select.jsx";
import React from "react";

const appSelectorConfig = {
    name: "AppType",
    type: "int",
    options: [
        { value: 1, name: "Saba.Club" },
        { value: 2, name: "Saba Mobi" },
        { value: 3, name: "Mini Saba.Club" },
        { value: 4, name: "Mega Keno" },
        { value: 6, name: "Desktop Direct" },
        { value: 7, name: "Mobile Direct" }
    ],
    instantModes: [
        { value: 1, name: "Portrait" },
        { value: 2, name: "Landscape" }
    ]
};

export default class AppType extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleInstantModeChange = this.handleInstantModeChange.bind(this);
    }

    handleChange(data) {
        this.props.onChange(data);
    }

    handleInstantModeChange(event) {
        this.props.onChange({ instantMode: parseInt(event.target.value) });
    }

    render() {
        const { value, id, instantMode, isOpenOnIframe } = this.props;

        return (
            <div className="input-group vertical">
                <label>App Type</label>
                <div>
                    {appSelectorConfig.options.map((option) => (
                        <div className="input-group">
                            <input
                                type="radio"
                                id={option.value}
                                name="appType"
                                value={option.value}
                                onChange={() => this.handleChange({ appType: option.value })}
                                checked={option.value === value}
                            />
                            <label htmlFor={option.value}>{option.name}</label>
                        </div>
                    ))}

                    <div>
                        {(value === 3 || isOpenOnIframe) &&
                            appSelectorConfig.instantModes.map((mode) => (
                                <div className="input-group">
                                    <input
                                        id={`${mode.value}${mode.name}`}
                                        type="radio"
                                        name="instant-mode"
                                        value={mode.value}
                                        onChange={this.handleInstantModeChange}
                                        checked={mode.value === instantMode}
                                    />
                                    <label htmlFor={`${mode.value}${mode.name}`}>{mode.name}</label>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        );
    }
}
