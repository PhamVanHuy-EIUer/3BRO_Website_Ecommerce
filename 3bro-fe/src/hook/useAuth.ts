// "use client";

// import Cookies from "js-cookie";
// import jwtDecode from "jwt-decode";
// import { AuthService } from "@/services/auth.service";

// export const useAuth = () => {
//     const login = async (email: string, password: string) => {
//         const res = await AuthService.login({ email, password });
//         const token = res.data.data.token;

//         Cookies.set("access_token", token);
//         return jwtDecode(token);
//     };

//     const logout = () => {
//         Cookies.remove("access_token");
//     };

//     return { login, logout };
// };
