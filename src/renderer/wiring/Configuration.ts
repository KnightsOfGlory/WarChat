import {IpcMessageBus} from "./IpcMessageBus";
import {References} from "@knightsofglory/warlibrary/lib/References";
import {SettingsManager} from "@knightsofglory/warlibrary/lib/state/SettingsManager";
import {ProfileManager} from "@knightsofglory/warlibrary/lib/state/ProfileManager";
import {AppManager} from "@knightsofglory/warlibrary/lib/state/AppManager";
import {ConnectionManager} from "@knightsofglory/warlibrary/lib/state/ConnectionManager";
import {UserManager} from "@knightsofglory/warlibrary/lib/state/UserManager";
import {ChannelManager} from "@knightsofglory/warlibrary/lib/state/ChannelManager";
import {ChatManager} from "@knightsofglory/warlibrary/lib/state/ChatManager";

export namespace Configuration {

    export function inject() {
        References.messageBus = new IpcMessageBus()

        References.settingsManager = new SettingsManager()
        References.profileManager = new ProfileManager()
        References.appManager = new AppManager()

        References.connectionManager = new ConnectionManager()
        References.userManager = new UserManager()
        References.channelManager = new ChannelManager()
        References.chatManager = new ChatManager()

        References.settingsManager.initialize()
        References.profileManager.initialize()
        References.appManager.initialize()

        References.connectionManager.initialize()
        References.userManager.initialize()
        References.channelManager.initialize()
        References.chatManager.initialize()
    }
}
