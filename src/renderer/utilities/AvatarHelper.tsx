import React, {ReactElement} from "react";
import Avatar from "@mui/material/Avatar"
import BoringAvatar from "boring-avatars"
import {ProductIcons} from "./ProductIcons";
import {UserFlags} from "./UserFlags";
import {References} from "@knightsofglory/warlibrary/lib/References";
import {User} from "@knightsofglory/warlibrary/lib/state/UserManager";

export namespace AvatarHelper {

    export function getAvatar(user: User): ReactElement {
        let icon = ProductIcons.getByClient(user.client.trim(), user.flags as string)
        let special =
            References.profileManager.getProfile().init6 ?
                UserFlags.Init6.isAdministrator(user.flags) ||
                UserFlags.Init6.isOperator(user.flags)
            :
                UserFlags.isAdministrator(user.flags) ||
                UserFlags.isOperator(user.flags)
        let useBoring =
            !user.bot &&
            user.client == "[CHAT]" &&
            !special

        return useBoring ? (
            <BoringAvatar
                name={user.name}
                variant="beam"
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
