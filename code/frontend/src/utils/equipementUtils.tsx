import CastIcon from "@mui/icons-material/Cast"
import AcUnitIcon from "@mui/icons-material/AcUnit"
import BorderColorIcon from "@mui/icons-material/BorderColor"
import TvIcon from "@mui/icons-material/Tv"
import SpeakerIcon from "@mui/icons-material/Speaker"
import VideoCallIcon from "@mui/icons-material/VideoCall"
import PrintIcon from "@mui/icons-material/Print"
import MicIcon from "@mui/icons-material/Mic"
import DevicesOtherIcon from "@mui/icons-material/DevicesOther"

export function getEqIcon(type?: string, size: "small" | "medium" | "large" = "large") {
    const cls = "text-[#1c3298] mb-1"
    switch (type) {
        case "PROJECTEUR":       return <CastIcon fontSize={size} className={cls} />
        case "ECRAN_PROJECTEUR": return <CastIcon fontSize={size} className={cls} />
        case "CLIMATISATION":    return <AcUnitIcon fontSize={size} className={cls} />
        case "TABLEAU_BLANC":    return <BorderColorIcon fontSize={size} className={cls} />
        case "TELEVISEUR":       return <TvIcon fontSize={size} className={cls} />
        case "SYSTEME_AUDIO":    return <SpeakerIcon fontSize={size} className={cls} />
        case "VISIOCONFERENCE":  return <VideoCallIcon fontSize={size} className={cls} />
        case "MICROPHONE":       return <MicIcon fontSize={size} className={cls} />
        case "IMPRIMANTE":       return <PrintIcon fontSize={size} className={cls} />
        default:                 return <DevicesOtherIcon fontSize={size} className={cls} />
    }
}
