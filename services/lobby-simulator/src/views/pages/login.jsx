import Axios from "axios";
import React from "react";
import Input from "../components/input.jsx";
import { randomString, showAlert } from "../util.jsx";
import config from "../../game-client-config.json";
import Environment from "../components/select/environment.jsx";

const IsSystemTypeSC1 = () => {
    return config.systemType === "SC1";
};

function buildLocalStorageKey(key) {
    if (typeof window !== "undefined" && window.location && window.location.hostname) {
        return `${window.location.hostname}.${key}`;
    }

    return key;
}

const operatorMapper = {
    ONEworks1: "ow",
    ONEworksVGCash: "ow",
    SBO: "sbo"
};

const LocalStorageKeys = {
    username: buildLocalStorageKey("username"),
    rememberMe: buildLocalStorageKey("rememberme"),
}

const UserNameStorageKey = "username";

const getStorage = (key) => {
    return localStorage.getItem(key);
}

const setStorage = (key, value) => {
    localStorage.setItem(key, value);
}

export default class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
         username: '',
         password: "123456",
         setting: {},
         ip: "",
         rememberMe: false
        };
    }

    inputChangeHandle(update) {
        this.setState(update)
    }

    clickRememberHandle() {
        this.setState({...this.state, rememberMe: !this.state.rememberMe})
    }

    async componentDidMount() {
        const setting = await Axios.get("/setting/data").then((data) => data.data);
        const ip = await Axios.get("/signin/ip", { timeout: 10000 }).then((data) => data.data);
        const username = getStorage(LocalStorageKeys.username) ?? "";
        const rememberMe = getStorage(LocalStorageKeys.rememberMe) === "true" ? true : false;

        this.setState({...this.state,setting, ip,username, rememberMe})
    }

    async onSubmit(event) {
        event && event.preventDefault();

        const {username, setting, ip} = this.state;
        if(!username) {
            alert("Username are required")
            return;
        }

        if(this.state.rememberMe) {
            setStorage(LocalStorageKeys.username, this.state.username);
            setStorage(LocalStorageKeys.rememberMe,true);
        }
        else {
            setStorage(LocalStorageKeys.username, '');
            setStorage(LocalStorageKeys.rememberMe,false);
        }
        
        const request =  {
            playerId: username,
            playerName: randomString(8),
            language: "vi-VN",
            currency: IsSystemTypeSC1() ? "$US" : "INH",
            seq: "d,y,lumi",
            siteId: "4100300",
            siteName: "lumi",
            ip,
            browserUserAgent: navigator.userAgent,
            auth: {
                operatorId: IsSystemTypeSC1() ? "ONEworks1" : "ONEworksVGCash",
                operatorSecret: IsSystemTypeSC1() ? "ONEworks1@20luminet&" : "VG@SC123"
            },
            gameId: 0,
            domain: "example.com",
            appType: 1,
        };

        await Axios.post( 
            `${setting.owUrl}/SetDefaultBalance?playerId=${username}&operator=${
                operatorMapper[request.auth.operatorId]
            }&balance=${20000}&systemType=${config.systemType}`
        )

        Axios.post("/signin/sso", request)
            .then((data) => data.data)
            .then((data) => (data.error ? Promise.reject(data.error) : data))
            .then((data) => {
                location.href= data.redirectUrl;
            })
            .catch(showAlert);

    }

    render() {
        const {username, password} = this.state;

        return (
            <div className="login-form-container" style={{
                backgroundImage: `url("/images/background.jpg")`,
                backgroundRepeat: "repeat-x",
                backgroundSize: "100%",
                height: `${window.innerHeight }px`
                }}>
                <div style={{height: "50%",textAlign:"center", display:"flex"}}>
                    <img
                    src="/images/Logo_Saba.png"
                    alt="logo"
                    style={{
                        verticalAlign:"middle",
                        padding: "20px",
                        margin:"auto",
                        width: "70%",
                    }}
                    />
                </div>
            
                <form onSubmit={this.onSubmit.bind(this)} style={{borderRadius: "10px", verticalAlign: "bottom"}}>
                    <div style={{textAlign: "center"}}>
                        <Environment />
                    </div>
                    <div>
                        <Input 
                            type="text"
                            id="username"
                            name="Username (Player ID)"
                            value={username}
                            onChange={this.inputChangeHandle.bind(this)}
                        />
                    </div>
                    <div>
                        <Input 
                            type="password"
                            id="password"
                            name="Password"
                            value={password}
                            onChange={this.inputChangeHandle.bind(this)}
                        />
                    </div>
                    <div>
                    <div>
                        <input type="checkbox" id="rememberMe" value="rememberMe" onChange={this.clickRememberHandle.bind(this)} checked={this.state.rememberMe}></input>
                        <label htmlFor="rememberMe">Remember Me</label>
                    </div>    
                    </div>
                    <div style={{textAlign: "center"}}>
                        <input className="primary" type="submit" value="Login" style={{borderRadius: "5px", width:"40%"}}/>
                    </div>
                </form>
            </div>
        );
    }
}
