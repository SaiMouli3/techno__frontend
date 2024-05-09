import { BsKanban } from "react-icons/bs";
import { FiShoppingBag } from "react-icons/fi";
import { IoMdContacts } from "react-icons/io";
import { RiContactsLine } from "react-icons/ri";
import {
  AiOutlineCalendar,
  
  AiOutlineStock,
} from "react-icons/ai";
import { TbTools } from "react-icons/tb";
import { MdInventory } from "react-icons/md";
export const links = [
  {
    title: "Dashboard",
    links: [
      {
        name: "Homepage",
        icon: <FiShoppingBag />,
        link: "home",
        roles: ["Admin", "Supervisor", "Incharge"]
      },
    ],
  },
  {
    title: "Pages",
    links: [
      {
        name: "Daily Entry",
        icon: <IoMdContacts />,
        link: "dailyentry",
        roles: ["Admin", "Supervisor"]
      },
      {
        name: "Daily Entries",
        icon: <IoMdContacts />,
        link: "dailyentrytable",
        roles: ["Admin", "Supervisor"]
      },
      {
        name: "Daily Entry Efficiency",
        icon: <IoMdContacts />,
        link: "dailyentryefficiency",
        roles: ["Admin", "Supervisor"]
      },
      {
        name: "Employees",
        icon: <RiContactsLine />,
        link:"employees",
        roles: ["Admin", "Incharge"]
      },
      {
        name: "Machine",
        icon: <MdInventory />,
        link: "machines",
        roles: ["Admin", "Incharge", "Supervisor"]
      },
      {
        name: "Jobs",
        icon: <MdInventory />,
        link: "jobs",
        roles: ["Admin", "Incharge"]
      },
    ],
  },
  {
    title: "Overview",
    links: [
      {
        name: "Tools",
        icon: <TbTools />,
        link: "tools",
        roles: ["Admin", "Incharge"]
      },
      {
        name: "Breakdown",
        icon: <AiOutlineStock />,
        link: "breakdown",
        roles: ["Admin", "Incharge"]
      },
      {
        name: "Resolve",
        icon: <AiOutlineStock />,
        link: "resolve",
        roles: ["Admin", "Incharge"]
      },
    ],
  },
  {
    title: "Analytics",
    links: [
      {
        name: "Chart",
        icon: <AiOutlineCalendar />,
        link: "chart2",
        roles: ["Admin", "Supervisor"]
      },
      {
        name: "Toolchart",
        icon: <BsKanban />,
        link: "toolchart",
        roles: ["Admin", "Incharge"]
      },
    ],
  },
];
