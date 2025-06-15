
import {FaAddressBook, FaPenSquare, FaUser, FaBuilding, FaStarHalfAlt, FaMoneyBill, FaChartBar } from "react-icons/fa";

export const navbarLinks = [
    {
        title:"DAILY OPERATIONS",
        links: [
            {
                label:"FrontDesk",
                icon: FaAddressBook,
                path:"/"
            },
            {
                label:"Reservations",
                icon: FaPenSquare,
                path:"/Reservations"
            },
            {
                label:"Guests",
                icon: FaUser,
                path:"/Guests"
            },
            {
                label:"Rooms",
                icon: FaBuilding,
                path:"/Rooms",
            },
            {
                label:"Service",
                icon: FaStarHalfAlt,
                path:"/Service",
            }
        ],
    },
    {
        title:"MANAGEMENTS",
        links: [
            {
                label: "Prices",
                icon: FaMoneyBill,
                path: "/Prices"
            },
            {
                label: "Report",
                icon: FaChartBar,
                path: "/Report"
            }
        ]
    }
]