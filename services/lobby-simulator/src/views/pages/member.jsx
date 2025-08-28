import React from "react";

import Balance from "../components/member/balance.jsx";
import EndGame from "../components/member/end-game.jsx";
import NotifyLogin from "../components/member/notify-login.jsx";
import PlaceBet from "../components/member/place-bet.jsx";
import VoidGame from "../components/member/void-game.jsx";
import config from "../../game-client-config.json";
import HitJackpot from "../components/member/hit-jackpot.jsx";

class MemberPage extends React.Component {
  render() {
    return (
      <div className="container">
        <NotifyLogin />
        <Balance />
        <PlaceBet />
        <EndGame />
        <VoidGame />
        {config.systemType === "VG2" && <HitJackpot />}
      </div>
    );
  }
}

export default MemberPage;
