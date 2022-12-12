import React, {ReactElement} from "react";
import {User} from "../state/UserManager"
import Avatar from "@mui/material/Avatar"
import BoringAvatar from "boring-avatars"
import {ProductIcons} from "./ProductIcons";
import {UserFlags} from "./UserFlags";

export namespace AvatarHelper {

    export function getAvatar(user: User): ReactElement {
        let icon = ProductIcons.getByClient(user.client.trim(), user.flags as string)
        let useBoring = user.client == "[CHAT]" && !UserFlags.Init6.isAdministrator(user.flags) && !UserFlags.Init6.isOperator(user.flags)

        return useBoring ? (
            <BoringAvatar
                name={user.name}
                variant="beam"
                // colors={["#F8F8D6", "#B3C67F", "#5D7E62", "#50595C", "#FA3E3E"]}
                // colors={["#1976D2", "#009DE6", "#00BED8", "#8DEE86", "#FA3E3E", "#F9F871"]}

                // colors={["#1976D2", "#92A9DE", "#E3F0FF", "#D8A31A"]}
                colors={["#1976D2", "#414756", "#A5ABBD", "#C94669"]}
            />
        ) : (
            <Avatar
                src={icon}
                variant="rounded"
            />
        )
    }
}