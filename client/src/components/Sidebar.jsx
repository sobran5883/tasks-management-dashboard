import React from "react"
import {
    MdDashboard,
    MdOutlineAddTask,
    MdOutlinePendingActions,
    MdSettings,
    MdTaskAlt,
} from "react-icons/md"
import { FaTasks, FaTrashAlt, FaUsers } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { Link, useLocation } from "react-router-dom"
import { setOpenSidebar } from "../redux/slices/authSlice"
import clsx from "clsx"

const linkData = [
    {
        label: "Dashboard",
        link: "dashboard",
        icon: <MdDashboard />,
        adminOnly: true
    },
    {
        label: "Tasks",
        link: "tasks",
        icon: <FaTasks />,
        adminOnly: false
    },
    {
        label: "Completed",
        link: "completed/completed",
        icon: <MdTaskAlt />,
        adminOnly: false
    },
    {
        label: "In Progress",
        link: "in-progress/in progress",
        icon: <MdOutlinePendingActions />,
        adminOnly: false
    },
    {
        label: "To Do",
        link: "todo/todo",
        icon: <MdOutlinePendingActions />,
        adminOnly: false
    },
    {
        label: "User",
        link: "team",
        icon: <FaUsers />,
        adminOnly: true
    },
    {
        label: "Trash",
        link: "trashed",
        icon: <FaTrashAlt />,
        adminOnly: true
    },
]

const Sidebar = () => {
    const { user } = useSelector((state) => state.auth)

    const dispatch = useDispatch()
    const location = useLocation()

    const path = location.pathname.split("/")[1]

    // Filter links based on user role
    const sidebarLinks = linkData.filter(link => user?.isAdmin || !link.adminOnly)

    const closeSidebar = () => {
        dispatch(setOpenSidebar(false))
    }

    const NavLink = ({ el }) => {
        return (
            <Link
                to={el.link}
                onClick={closeSidebar}
                className={clsx(
                    "w-full lg:w-3/4 flex gap-2 px-3 py-2 rounded-full items-center text-gray-800 text-base hover:bg-[#2564ed2d]",
                    path === el.link.split("/")[0]
                        ? "bg-blue-700 text-neutral-100"
                        : ""
                )}
            >
                {el.icon}
                <span className="hover:text-[#2564ed]">{el.label}</span>
            </Link>
        )
    }
    return (
        <div className="w-full  h-full flex flex-col gap-6 p-5">
            <h1 className="flex gap-1 items-center">
                <span className="text-2xl font-bold text-black">📝 MyTask</span>
            </h1>

            <div className="flex-1 flex flex-col gap-y-5 py-8">
                {sidebarLinks.map((link) => (
                    <NavLink el={link} key={link.label} />
                ))}
            </div>

            <div className="">
                <button className="w-full flex gap-2 p-2 items-center text-lg text-gray-800">
                    <MdSettings />
                    <span>Settings</span>
                </button>
            </div>
        </div>
    )
}

export default Sidebar
