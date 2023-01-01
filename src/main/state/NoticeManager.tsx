import { net } from "electron";

export namespace NoticeManager {

    export function initialize() {
        setInterval(() => {
            latestMessage()
        }, 1*60*1000)
    }

    function latestMessage() {
        const request = net.request({
            method: 'GET',
            protocol: 'https:',
            hostname: 'github.com',
            port: 443,
            path: '/'
        })
        request.on('response', (response) => {
            console.log(`STATUS: ${response.statusCode}`);
            console.log(`HEADERS: ${JSON.stringify(response.headers)}`);

            response.on('data', (chunk) => {
                console.log(`BODY: ${chunk}`)
            });
        });
        request.setHeader('Content-Type', 'application/json');
        request.end();
    }
}
