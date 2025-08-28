import Axios from "axios";
import React from "react";
import QRCode from "react-qr-code";
import config from "../../game-client-config.json";
import Input from "../components/input.jsx";
import AppType from "../components/select/app-type.jsx";
import DeepLinkInput from "../components/select/deeplink.jsx";
import GameSelect from "../components/select/game.jsx";
import LanguageSelect from "../components/select/language.jsx";
import { SC1GameLobbyURLMapper, VG2GameLobbyURLMapper } from "../constants/lobby-url";
import { showAlert } from "../util.jsx";

const operatorMapper = {
    ONEworks1: "ow",
    ONEworksVGCash: "ow",
    SBO: "sbo",
    ONEworks_VG: "ow",
    PFF: "pff",
    ONEworksSeal888: "ow",
    SabaPlay: "sabaplay"
};
const IsSystemTypeSC1 = () => {
    return config.systemType === "SC1";
};

const IsSxDSystem = () => {
    return config.systemType === "GN";
};

export default class SignIn extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            playerId: props.playerId,
            playerName: `username_${props.playerId}`,
            language: "vi-VN",
            currency: IsSystemTypeSC1() ? "$US" : "INH",
            seq: "d,y,lumi",
            siteId: "4100300",
            siteName: "lumi",
            ip: "",
            browserUserAgent: navigator.userAgent,
            auth: {
                operatorId: IsSystemTypeSC1() ? "ONEworks1" : "ONEworksVGCash",
                operatorSecret: IsSystemTypeSC1() ? "ONEworks1@20luminet&" : "VG@SC123"
            },
            token: "",
            redirectUrl: "#",
            verifyResult: null,
            gameId: 0,
            setting: {
                owUrl: ""
            },
            domain: "example.com",
            localhost: false,
            isOpenOnIframe: false,
            appType: props.appType,
            isCash: true,
            partner: "1W",
            disableJackpotGames: false,
            expandAdvanceSetting: false,
            instantMode: 1,
            devIp: "",
            operatorToken: IsSystemTypeSC1() ? "ONEworks1Token" : "ONEworksVGCashToken",
            setDefaultBalance: false,
            ref: "",
            deeplink: "",
            isApp: false,
            returnUrl: "",
            isApp: false,
            disableAward: false
        };

        this.instantModeSize = {
            1: {
                width: "224px",
                height: "370px"
            },
            2: {
                width: "812px",
                height: "456px"
            }
        };

        this.instantModeSize = {
            1: {
                width: "224px",
                height: "370px"
            },
            2: {
                width: "812px",
                height: "456px"
            }
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleChangeAuth = this.handleChangeAuth.bind(this);
        this.handleReloadIframe = this.handleReloadIframe.bind(this);
        this.handleClickSetDefaultBalance = this.handleClickSetDefaultBalance.bind(this);

        this.instantRef = React.createRef();
        this.iFrameRef = React.createRef();
        this.timeout = null;
    }

    handleInputChange(data) {
        if (this.state.appType === 3 && data.instantMode && this.state.instantMode !== data.instantMode) {
            const iFrameElement = this.instantRef.current;
            iFrameElement.src = iFrameElement.src;
        }

        if (data.playerId || data.appType) {
            this.props.handleChangeInput(data);
            data.playerId && this.setState({ playerName: `username_${data.playerId}` });
        }

        this.setState(data);
    }

    handleChangeAuth(data) {
        const state = this.state;

        state.auth = Object.assign({}, state.auth, data);

        this.setState(state);
    }

    handleSubmit(event) {
        console.log("handleSubmit", this.state);
        const request = Object.assign({}, this.state, {
            token: null,
            verifyResult: null,
            resource: null,
            localhost: null,
            devIp: null
        });
        Axios.post("/signin/sso", request)
            .then((data) => data.data)
            .then((data) => (data.error ? Promise.reject(data.error) : data))
            .then((token) => {
                this.setState(token);
            })
            .catch(showAlert);

        event && event.preventDefault();
    }

    handleVerifyToken(event) {
        const request = Object.assign(
            {},
            {
                token: this.state.token,
                browserUserAgent: this.state.browserUserAgent,
                ip: this.state.ip
            }
        );

        Axios.post("/signin/verify", request)
            .then((data) => data.data)
            .then((data) => (data.error ? Promise.reject(data.error) : data))
            .then((verifyResult) => this.setState({ verifyResult }))
            .catch(showAlert);

        event.preventDefault();
    }

    handleClickSetDefaultBalance(value) {
        const { setting, playerId, auth, playerName, currency, siteId } = this.state;
        const balance = !isNaN(value) ? value : IsSystemTypeSC1() ? 2000 : 20000;
        Axios.post(
            `${setting.owUrl}/SetDefaultBalance?playerId=${encodeURIComponent(playerId)}&operator=${
                operatorMapper[auth.operatorId]
            }&balance=${balance}&systemType=${config.systemType}&username=${encodeURIComponent(
                playerName
            )}&currency=${currency}&siteId=${siteId}`
        )
            .then((data) => {
                this.setState({ setDefaultBalance: data.data }, () => {
                    this.timeout = setTimeout(() => {
                        this.setState({ setDefaultBalance: false });
                    }, 2000);
                });
            })
            .catch(showAlert);
    }

    redirectToInstantVersion() {
        const request = Object.assign({}, this.state, {
            token: null,
            verifyResult: null,
            resource: null,
            devIp: null,
            appType: 3
        });

        Axios.post("/signin/sso", request)
            .then((data) => data.data)
            .then((data) => (data.error ? Promise.reject(data.error) : data))
            .then((data) => {
                let redirectUrl = data.redirectUrl;
                if (this.state.localhost) {
                    redirectUrl = `${this.state.setting.localhost}?token=${data.token}&lang=${this.state.language}&gameId=${this.state.gameId}&instant=true&appType=3`;
                }

                window.open(redirectUrl, "_blank").focus();
            })
            .catch(showAlert);
    }

    openGamePopup(redirectUrl) {
        const encodedUrl = encodeURIComponent(redirectUrl);
        window.open(`/direct?redirectUrl=${encodedUrl}`, "_blank").focus();
    }

    async componentDidMount() {
        const data = await Axios.get("/setting/data").then((data) => data.data);
        const ip = await Axios.get("/signin/ip", { timeout: 10000 }).then((data) => data.data);
        this.setState({ setting: data, ip }, () => {
            this.iFrameRef.current.src = `${data.owUrl}/CreateCustomer?memId=${encodeURIComponent(this.state.playerId)}&siteId=${
                this.state.siteId
            }&operator=${operatorMapper[this.state.auth.operatorId]}&systemType=${config.systemType}`;
            this.handleSubmit();
            this.props.balance && this.handleClickSetDefaultBalance(this.props.balance);
        });
    }

    componentWillUnmount() {
        this.timeout && clearTimeout(this.timeout);
    }

    handleReloadIframe() {
        const { auth, setting, playerId, siteId } = this.state;
        this.iFrameRef.current.src = `${setting.owUrl}/CreateCustomer?memId=${encodeURIComponent(playerId)}&siteId=${siteId}&operator=${
            operatorMapper[auth.operatorId]
        }&systemType=${config.systemType}`;
    }

    render() {
        let redirectUrl = this.state.redirectUrl;
        const { localhost, token, instantMode, devIp, setting, setDefaultBalance, language } = this.state;
        const url = IsSystemTypeSC1() ? SC1GameLobbyURLMapper[setting.evn] : VG2GameLobbyURLMapper[setting.evn];
        const qrURL = `${url}/signin?obCustId=${this.state.playerId}`;

        if (token) {
            if (localhost) {
                redirectUrl =
                    this.state.appType === 2 || this.state.appType === 4
                        ? `${setting.mobileLocalhost}?token=${token}`
                        : `${setting.localhost}?token=${token}&lang=${language}&gameId=${this.state.gameId}&ref=${
                              this.state.ref
                          }&rurl=${window.btoa(this.state.returnUrl)}&op=SP`;
            }

            if (devIp) {
                redirectUrl = `http://${devIp}?token=${token}&appType=${this.state.appType}`;
            }

            if (
                redirectUrl &&
                !redirectUrl.includes("appType") &&
                (this.state.appType === 1 || this.state.appType === 5) &&
                this.state.isApp
            ) {
                redirectUrl = `${redirectUrl}&appType=5`;
            }

            if (redirectUrl && !redirectUrl.includes("appType")) {
                redirectUrl += `&appType=${this.state.appType}`;
            }
        }

        return (
            <div className="container">
                <div className="section">
                    <form onSubmit={(event) => this.handleSubmit(event)}>
                        <fieldset>
                            <legend>Basic</legend>
                            <div className="row">
                                <div className="col-sm-12 col-md-6">
                                    <div className="row">
                                        <div className="col-sm-10 col-md-11">
                                            <Input
                                                type="text"
                                                id="playerId"
                                                name="Player ID"
                                                value={this.state.playerId}
                                                onChange={this.handleInputChange}
                                            />
                                        </div>
                                        <div className="col-sm-2 col-md-1">
                                            <QRCode value={qrURL} size={75}></QRCode>
                                        </div>
                                    </div>
                                    <AppType
                                        onChange={this.handleInputChange}
                                        id="appType"
                                        value={this.state.appType}
                                        instantMode={this.state.instantMode}
                                        isOpenOnIframe={this.state.isOpenOnIframe}
                                    />
                                </div>
                                <div className="col-sm-12 col-md-6">
                                    <Input
                                        type="text"
                                        id="playerName"
                                        name="Player Username"
                                        value={this.state.playerName}
                                        onChange={this.handleInputChange}
                                    />
                                    <Input
                                        type="text"
                                        id="currency"
                                        name="Currency"
                                        value={this.state.currency}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                            </div>
                        </fieldset>
                        <fieldset>
                            <legend
                                onClick={() =>
                                    this.setState({
                                        expandAdvanceSetting: !this.state.expandAdvanceSetting
                                    })
                                }
                                style={{ cursor: "pointer" }}
                            >
                                Advance
                                <img
                                    src="/images/icon-expand.png"
                                    alt="landscape-icon"
                                    style={{
                                        width: "20px",
                                        "vertical-align": "middle",
                                        padding: "5px",
                                        transform: !this.state.expandAdvanceSetting ? "rotate(180deg)" : null
                                    }}
                                />
                            </legend>
                            <div
                                className="row"
                                style={{
                                    display: this.state.expandAdvanceSetting ? "flex" : "none"
                                }}
                            >
                                <div className="col-sm-12 col-md-6">
                                    <Input
                                        type="text"
                                        id="siteId"
                                        name="Site Id"
                                        value={this.state.siteId}
                                        onChange={this.handleInputChange}
                                    />
                                    <Input
                                        type="text"
                                        id="siteName"
                                        name="Site Name"
                                        value={this.state.siteName}
                                        onChange={this.handleInputChange}
                                    />
                                    <LanguageSelect onChange={this.handleInputChange} id="language" value={this.state.language} />

                                    <GameSelect onChange={this.handleInputChange} id="gameId" value={this.state.gameId} />
                                    <Input
                                        type="text"
                                        id="browserUserAgent"
                                        name="Browser User Agent"
                                        value={this.state.browserUserAgent}
                                        onChange={this.handleInputChange}
                                    />
                                    <Input type="text" id="ref" name="Ref" value={this.state.ref} onChange={this.handleInputChange} />
                                </div>
                                <div className="col-sm-12 col-md-6">
                                    <Input type="text" id="ip" name="IP" value={this.state.ip} onChange={this.handleInputChange} />
                                    <Input
                                        type="text"
                                        id="domain"
                                        name="Domain"
                                        value={this.state.domain}
                                        onChange={this.handleInputChange}
                                    />
                                    <Input
                                        type="text"
                                        id="operatorId"
                                        name="Operator Id"
                                        value={this.state.auth.operatorId}
                                        onChange={this.handleChangeAuth}
                                    />
                                    <Input
                                        type="text"
                                        id="operatorSecret"
                                        name="Operator Secret"
                                        value={this.state.auth.operatorSecret}
                                        onChange={this.handleChangeAuth}
                                    />
                                    <Input
                                        type="text"
                                        id="operatorToken"
                                        name="Operator Token"
                                        value={this.state.operatorToken}
                                        onChange={this.handleInputChange}
                                    />
                                    <Input
                                        type="text"
                                        id="returnUrl"
                                        name="Return Url"
                                        value={this.state.returnUrl}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                            </div>
                        </fieldset>

                        <div className="row">
                            <div className="col-md-12 row">
                                <div className="col-sm-3 col-md-2">
                                    <Input
                                        type="checkbox"
                                        id="localhost"
                                        name="Localhost"
                                        value={this.state.localhost}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                                <div className="col-sm-3 col-md-2">
                                    <Input
                                        type="checkbox"
                                        id="isOpenOnIframe"
                                        name="Load On Iframe"
                                        value={this.state.isOpenOnIframe}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                                <div className="col-sm-3 col-md-2">
                                    <Input
                                        type="checkbox"
                                        id="isApp"
                                        name="Is App"
                                        value={this.state.isApp}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                                <div className="col-sm-3">
                                    <Input
                                        type="checkbox"
                                        id="disableJackpotGames"
                                        name="Disable Jackpot Games"
                                        value={this.state.disableJackpotGames}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                                <div className="col-sm-3">
                                    <Input
                                        type="checkbox"
                                        id="disableAward"
                                        name="Disable Award"
                                        value={this.state.disableAward}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="col-sm-8">
                                    <Input
                                        type="text"
                                        id="devIp"
                                        name="Dev Machine IP"
                                        value={this.state.devIp}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                            </div>
                            <input className="primary" type="submit" value="Get Token" id="get-token" />
                            <label className="button secondary" for="modal-control" id="set-balance">
                                Set Balance
                            </label>
                            <input
                                type="checkbox"
                                id="modal-control"
                                class="modal"
                                onChange={(event) => event.target.checked && this.handleReloadIframe()}
                            />
                            <div role="dialog" aria-labelledby="dialog-title">
                                <div class="card" style={{ maxWidth: "800px", maxHeight: "800px" }}>
                                    <label for="modal-control" class="modal-close"></label>
                                    <h3 class="section">
                                        Set Balance
                                        <svg
                                            cursor="pointer"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            class="feather feather-refresh-cw"
                                            onClick={this.handleReloadIframe}
                                        >
                                            <polyline points="23 4 23 10 17 10"></polyline>
                                            <polyline points="1 20 1 14 7 14"></polyline>
                                            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                                        </svg>
                                    </h3>
                                    <div class="section">
                                        <iframe
                                            ref={this.iFrameRef}
                                            src=""
                                            width="800"
                                            height="500"
                                            frameborder="0"
                                            allowtransparency="true"
                                        />
                                    </div>
                                </div>
                            </div>
                            <input
                                type="button"
                                id="set-default-balance"
                                className="tertiary"
                                value="Set Default Balance"
                                onClick={this.handleClickSetDefaultBalance}
                            />
                            <input
                                type="button"
                                id="redirect-to-Game"
                                className="tertiary"
                                value="Redirect To Instant Version"
                                onClick={() => {
                                    this.redirectToInstantVersion();
                                }}
                            />
                            {this.state.appType === 7 && (
                                <input
                                    type="button"
                                    id="open-game-popup"
                                    className="tertiary"
                                    value="Open Game Popup"
                                    onClick={() => {
                                        this.openGamePopup(redirectUrl);
                                    }}
                                />
                            )}
                        </div>
                        {setDefaultBalance && <p style={{ color: "green", fontWeight: "bold" }}>Set balance successfully!</p>}
                    </form>
                    {(this.state.appType === 3 || this.state.isOpenOnIframe) && token && (
                        <iframe
                            ref={this.instantRef}
                            src={redirectUrl + (this.state.appType === 3 ? "&instant=true&appType=3" : "")}
                            style={this.instantModeSize[instantMode]}
                        />
                    )}
                </div>
                <div className="section">
                    <div className="row">
                        <div className="col-sm-12 col-md-6">
                            <form onSubmit={(event) => this.handleVerifyToken(event)}>
                                <fieldset className="container">
                                    <legend>Token</legend>
                                    <div className="input-group vertical">
                                        <label htmlFor="redirectUrl">
                                            Redirect:<div id="link-local"></div>
                                        </label>
                                        <a
                                            className="col-sm-12"
                                            style={{ color: "#0277bd" }}
                                            onClick={() => {
                                                const popupStyles = IsSxDSystem()
                                                    ? "width=950,height=906,left=200,top=100,resizable=no,"
                                                    : `width=${this.state.appType === 2 ? 1270 : 1523},height=884`;

                                                window.open(redirectUrl, "_blank", popupStyles);
                                            }}
                                            id="redirect"
                                        >
                                            {redirectUrl}
                                        </a>
                                    </div>
                                    <Input type="text" id="token" name="Token" value={this.state.token} onChange={this.handleInputChange} />
                                    <input className="primary" type="submit" value="Verify Token" />
                                </fieldset>
                            </form>
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <form>
                                <fieldset className="container">
                                    <legend>Deep Link</legend>
                                    <DeepLinkInput onChange={this.handleInputChange} id="deeplink" value={this.state.deeplink} />
                                    <QRCode value={this.state.deeplink} size={120} className="mt-2"></QRCode>
                                </fieldset>
                            </form>
                        </div>
                    </div>
                </div>
                {this.state.verifyResult && (
                    <div className="section">
                        <form>
                            <fieldset className="container">
                                <legend>Verify Result</legend>
                                <pre>{JSON.stringify(this.state.verifyResult, "<br/>", 2)}</pre>
                            </fieldset>
                        </form>
                    </div>
                )}
            </div>
        );
    }
}
