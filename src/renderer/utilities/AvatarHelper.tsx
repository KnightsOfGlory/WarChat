import React, {ReactElement} from "react";
import Avatar from "@mui/material/Avatar"
import BoringAvatar from "boring-avatars"
import {ProductHelper} from "./ProductHelper";
import {UserFlags} from "./UserFlags";
import {References} from "@knightsofglory/warlibrary/lib/References";
import {User} from "@knightsofglory/warlibrary/lib/state/UserManager";
import Box from "@mui/material/Box";

export namespace AvatarHelper {

    export function getAvatar(user: User, small: boolean = false): ReactElement {
        let icon = ProductHelper.getIcon(user.client.trim(), user.flags as string)
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

        const size = small ? 20 : 40

        return useBoring ? (
            <BoringAvatar
                name={user.name}
                variant="beam"
                colors={["#1976D2", "#414756", "#A5ABBD", "#C94669"]}
                size={size}
                square={false}
            />
        ) : (
            <Box sx={{width: size, height: size, display: "inline-block"}}>
                <Avatar
                    src={icon}
                    variant="rounded"
                    sx={{ width: size, height: size }}
                />
            </Box>
        )
    }
}
