import chat from "../../../assets/products/chat.png"
import serv from "../../../assets/products/serv.png"
import d2dv from "../../../assets/products/d2dv.png"
import d2xp from "../../../assets/products/d2xp.png"
import drtl from "../../../assets/products/drtl.png"
import jstr from "../../../assets/products/jstr.png"
import sexp from "../../../assets/products/sexp.png"
import star from "../../../assets/products/star.png"
import w2bn from "../../../assets/products/w2bn.png"
import w3xp from "../../../assets/products/w3xp.png"
import war3 from "../../../assets/products/war3.png"
import wcht from "../../../assets/products/wcht.png"
import oper from "../../../assets/products/oper.png"
import bliz from "../../../assets/products/bliz.png"
import {UserFlags} from "./UserFlags"
import {References} from "@knightsofglory/warlibrary/lib/References";

export namespace ProductHelper {

    // (blizzard) 1001 USER gh0st 0011 [CHAT]
    // (ops)      1001 USER ~TG|{~xir|4 0012 [CHAT]

    let icons = new Map([
        ["[CHAT]", chat],
        ["[SERV]", serv],
        ["[D2DV]", d2dv],
        ["[D2XP]", d2xp],
        ["[DRTL]", drtl],
        ["[DSHR]", drtl],
        ["[JSTR]", jstr],
        ["[SEXP]", sexp],
        ["[STAR]", star],
        ["[SSHR]", star],
        ["[W2BN]", w2bn],
        ["[W3XP]", w3xp],
        ["[WAR3]", war3],
        ["[WCHT]", wcht],
    ])

    export const getIcon = (client: string, flags: string) => {
        if (flags == "") flags = References.profileManager.getProfile().init6 ? "0" : "0000"

        if (UserFlags.isAdministrator(flags)) return bliz
        if (UserFlags.isOperator(flags)) return oper

        if (References.profileManager.getProfile().init6 && UserFlags.Init6.isAdministrator(flags)) return bliz
        if (References.profileManager.getProfile().init6 && UserFlags.Init6.isOperator(flags)) return oper

        return icons.get(client)
    }

    let names = new Map([
        ["[CHAT]", "Telnet"],
        ["[D2DV]", "Diablo II"],
        ["[D2XP]", "Diablo II: Lord of Destruction"],
        ["[DRTL]", "Diablo"],
        ["[DSHR]", "Diablo"],
        ["[JSTR]", "Starcraft: Japan"],
        ["[SEXP]", "Starcraft: Broodwar"],
        ["[STAR]", "Starcraft"],
        ["[SSHR]", "Starcraft"],
        ["[W2BN]", "Warcraft II"],
        ["[W3XP]", "Warcraft III: The Frozen Throne"],
        ["[WAR3]", "Warcraft III"],
    ])

    export function getName(product: string) {
        return names.get(product)
    }
}
