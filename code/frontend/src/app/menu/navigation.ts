import { useTranslation } from "react-i18next";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventNoteIcon from "@mui/icons-material/EventNote";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import DevicesIcon from "@mui/icons-material/Devices";
import BarChartIcon from "@mui/icons-material/BarChart";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

const Navigation = () => {
  const { t } = useTranslation();

  return [
    {
      title: t("menu.dashboard"),
      icon: DashboardIcon,
      path: "/dashboard",
    },
    {
      title: t("menu.reservations"),
      icon: EventNoteIcon,
      path: "/dashboard/reservations",
    },
    {
      title: t("menu.rooms"),
      icon: MeetingRoomIcon,
      path: "/dashboard/rooms",
    },
    {
      title: t("menu.equipment"),
      icon: DevicesIcon,
      path: "/dashboard/equipements",
    },
    {
      title: t("menu.statistics"),
      icon: BarChartIcon,
      path: "/statistics",
    },
    {
      title: t("menu.administration"),
      icon: AdminPanelSettingsIcon,
      path: "/dashboard/administration",
    },
  ];
};

export default Navigation;