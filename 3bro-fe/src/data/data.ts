import { title } from "process";

export const quickMenu = [
    { id: 1, name: "Home", href: "/" },
    { id: 2, name: "Product", href: "/product" },
    { id: 3, name: "About", href: "/about" },
    { id: 4, name: "Contact", href: "/contact" },
    { id: 5, name: "Sign In", href: "/login" },
    { id: 6, name: "Account", href: "/user/account" },
];

export const support = [
    { id: 1, name: "Thu Dau Mot Ward, Ho Chi Minh City" },
    { id: 2, name: "3bro.sup.service@gmail.com" },
    { id: 3, name: "+84-2882-6789" },
];

export const Account = [
    { id: 1, name: "My Account", href: "/user/account" },
    { id: 2, name: "Login", href: "/login" },
    { id: 3, name: "Register", href: "/register" },
    { id: 4, name: "Cart", href: "/user/cart" },
    { id: 5, name: "My Order", href: "/user/order" },
];
export const categories = [
    { name: "Woman's Fashion", hasSubmenu: true },
    { name: "Men's Fashion", hasSubmenu: true },
    { name: "Electronics", hasSubmenu: false },
    { name: "Home & Lifestyle", hasSubmenu: false },
];
export const banners = [
    { id: 1, src: "/Carousel/Carousel 1.png" },
    { id: 2, src: "/Carousel/carosel_pic.png" },
    { id: 3, src: "/Carousel/carosel_pic2.png" },
    { id: 4, src: "/Carousel/carosel_pic3.png" },
    { id: 5, src: "/Carousel/carosel_pic4.png" },
];

export const discount = [
    { id: 1, img: "/Discount/Discount5.PNG", discount: 5 },
    { id: 2, img: "/Discount/Discount10.PNG", discount: 10 },
    { id: 3, img: "/Discount/Discount15.PNG", discount: 15 },
    { id: 4, img: "/Discount/Discount20.PNG", discount: 20 },
    { id: 5, img: "/Discount/Discount25.PNG", discount: 25 },
    { id: 6, img: "/Discount/Discount30.PNG", discount: 30 },
    { id: 7, img: "/Discount/Discount35.PNG", discount: 35 },
    { id: 8, img: "/Discount/Discount40.PNG", discount: 40 },
    { id: 9, img: "/Discount/Discount45.PNG", discount: 45 },
]


export type OrderStatus = "All" | "Pending" | "Confirmed" | "Paid" | "Completed" | "Cancelled";

export const ORDER_TABS: OrderStatus[] = ["All", "Pending", "Confirmed", "Paid", "Completed", "Cancelled"];

export const COLORS = {
    redColor: "text-[#DB4444]",
    bgRed: "bg-[#DB4444]",
};