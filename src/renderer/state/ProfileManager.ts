export type Profile = {
    server: string,
    username: string,
    password: string,
    home: string
}

export namespace ProfileManager {
    let profile: Profile = {
        server: "",
        username: "",
        password: "",
        home: ""
    }

    listen()

    export function getProfile() {
        return profile
    }

    export function setProfile(newProfile: Profile) {
        profile = newProfile
        window.electron.ipcRenderer.sendMessage("profile.save", profile);
    }

    function listen() {
        window.electron.ipcRenderer.on("profile.read", (arg) => {
            profile = arg as Profile
        })
        window.electron.ipcRenderer.sendMessage("profile.read", null);
    }
}