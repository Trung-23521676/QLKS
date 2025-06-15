import {Settings, Users, Home, Layers, Notebook } from "lucide-react";

export const navbarLinks = [
    {
        title:"DailyOperation",
        links: [
            {
                label:"FrontDesk",
                icon: Layers,
                path:"/"
            },
            {
                label:"Reservations",
                icon: Notebook,
                path:"/Reservations"
            },
            {
                label:"Guests",
                icon: Users,
                path:"/Guests"
            },
            {
                label:"Rooms",
                icon: Home,
                path:"/Rooms",
            },
            {
                label:"Service",
                icon: Settings,
                path:"/Service",
            }
        ]
    }
]