import React from "react";
import GameClient from "../components/setting/game-client.jsx";
import Language from "../components/setting/language.jsx";
import DeepLink from "../components/setting/deeplink.jsx";

class SettingPage extends React.Component {
    render() {
        return (
            <div className="container">
                <GameClient />
                <DeepLink />
                <Language />
            </div>
        );
    }
}

export default SettingPage;
