import { createElement } from "react";
import { LayoutGrid, GraduationCap, Users, ClipboardCheck } from "lucide-react";
import { SidebarItem } from "./interface";

export const sidebarItems: SidebarItem[] = [
    {
        icon: createElement(LayoutGrid, { className: "w-4 h-4" }),
        label: "Overview",
        href: "/dashboard",
    },
    {
        icon: createElement(GraduationCap, { className: "w-4 h-4" }),
        label: "Training",
        href: "/dashboard/training",
    },
    {
        icon: createElement(Users, { className: "w-4 h-4" }),
        label: "Employees",
        href: "/dashboard/employees",
    },
    {
        icon: createElement(ClipboardCheck, { className: "w-4 h-4" }),
        label: "Proof of work",
        href: "/dashboard/proof-of-work",
    },
];
