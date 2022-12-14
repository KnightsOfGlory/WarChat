import React, {ReactElement} from "react";
import {User} from "../state/UserManager"
import Avatar from "@mui/material/Avatar"
import BoringAvatar from "boring-avatars"
import {ProductIcons} from "./ProductIcons";
import {UserFlags} from "./UserFlags";
import {ProfileManager} from "../state/ProfileManager";

export namespace AvatarHelper {

    export function getAvatar(user: User): ReactElement {
        let icon = ProductIcons.getByClient(user.client.trim(), user.flags as string)
        let special =
            ProfileManager.getProfile().init6 ?
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