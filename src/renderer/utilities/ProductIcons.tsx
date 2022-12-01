import chat from "../../../assets/products/chat.png";
import serv from "../../../assets/products/serv.png";
import d2dv from "../../../assets/products/d2dv.png";
import d2xp from "../../../assets/products/d2xp.png";
import drtl from "../../../assets/products/drtl.png";
import jstr from "../../../assets/products/jstr.png";
import sexp from "../../../assets/products/sexp.png";
import star from "../../../assets/products/star.png";
import w2bn from "../../../assets/products/w2bn.png";
import w3xp from "../../../assets/products/w3xp.png";
import war3 from "../../../assets/products/war3.png";
import wcht from "../../../assets/products/wcht.png";

export namespace ProductIcons {

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

    export const getByClient = (client: string) => {
        return icons.get(client)
    }
}