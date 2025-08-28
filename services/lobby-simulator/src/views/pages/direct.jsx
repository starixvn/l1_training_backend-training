import React, { Component } from "react";

function updateUrlWithQuery() {
    const hrefDecoded = decodeURIComponent(globalThis.location?.href);
    const [baseUrl, queryString] = hrefDecoded ? hrefDecoded.split("?") : ["", ""];
    const fullUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl;
    globalThis.history.pushState(null, "", fullUrl);
}

export default class Direct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isClassic: true
        };
    }

    toggleView = () => {
        this.setState((prevState) => ({ isClassic: !prevState.isClassic }));
    };

    render() {
        const REDIRECT_URL = "redirectUrl";
        const VERSION_MODE = {
            CLASSIC: "classic",
            COMPACT: "compact"
        };

        const { isClassic } = this.state;

        const params = new URLSearchParams(window.location.search);
        const iframeSrc = params.get(REDIRECT_URL);

        updateUrlWithQuery();
        return (
            <>
                <style>
                    {`
                        html, body, #app {
                            height: 100%;
                        }

                        .direct-container {
                            height: 100%;
                            display: flex;
                            flex-direction: column;
                            width: 100%;
                        }
                        .header {
                            background-color: #ccc;
                            flex: 0 0 ${isClassic ? "76px" : "36px"};
                        }
                        .direct {
                            flex: 1;
                            display: flex;
                        }
                        .footer {
                            background-color: #ccc;
                            flex: 0 0 48px;
                        }
                        .iframe {
                            width: 100% !important;
                            height: 100%;
                            border: none;
                        }
                        .toggle-button {
                            padding: 4px;
                            margin-top: 6px;
                            margin-left: 60px;
                            background-color: red;
                            color: white;
                            font-weight: bold;
                            text-transform: uppercase;
                        }
                    `}
                </style>
                <div className="direct-container">
                    <div className="header">Header</div>
                    <div className="direct">
                        <iframe className="iframe" title={`Game`} src={iframeSrc} allow="clipboard-read; clipboard-write *" />
                    </div>
                    <div className="footer">
                        <span>Footer {isClassic ? VERSION_MODE.CLASSIC : VERSION_MODE.COMPACT}</span>
                        <button className="toggle-button" onClick={this.toggleView}>
                            Switch to {isClassic ? VERSION_MODE.COMPACT : VERSION_MODE.CLASSIC}
                        </button>
                    </div>
                </div>
            </>
        );
    }
}
