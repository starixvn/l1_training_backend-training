import SignInPage from "./pages/signin.jsx";
import MemberPage from "./pages/member.jsx";
import SettingPage from "./pages/setting.jsx";
import LoginPage from "./pages/login.jsx";
import DirectPage from "./pages/direct.jsx";

export default [
    {
        path: "/signin",
        component: SignInPage,
        name: "Sign-In Flow"
    },
    {
        path: "/member",
        component: MemberPage,
        name: "Member"
    },
    {
        path: "/setting",
        component: SettingPage,
        name: "Setting"
    },
    {
        path: "/login",
        component: LoginPage,
        name: "Login"
    },
    {
        path: "/direct",
        component: DirectPage,
        name: "Direct"
    }
];
