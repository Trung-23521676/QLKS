import { Sidebar } from "../layouts/sidebar";
import "../layouts/sidebar.css";
import { Header } from "../layouts/header";
import {cn} from "../utils/cn"
import { useMediaQuery } from "@uidotdev/usehooks"
import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import RealTimeClock from "../layouts/clock";
import {useClickOutside} from "../hooks/use-click-ouside"
import "./layout.css";

export default function Layout() {
  return (
    <div className={cn("page-container")}>
        <Sidebar/>
        <div className="main-content">
            <Header />
            <Outlet />
      </div>
    </div>
  );
}