import { Types } from "ably/promises";
import * as Ably from "ably/promises";

(async () => {
    const optionalClientId = "optionalClientId"; // When not provided in authUrl, a default will be used.
    const ably = new Ably.Realtime.Promise({ authUrl: `/api/ably-token-request?clientId=${optionalClientId}` });
    const channel = ably.channels.get("some-channel-name");

    const messages = document.getElementById("messages");
    const form = document.getElementById("form");
    const input = document.getElementById("input") as HTMLInputElement;

    form.addEventListener("submit", (e:SubmitEvent) => {
        e.preventDefault();

        channel.publish({name: "chat-message", data: input.value});
        input.value = "";
        input.focus();
    });
    
    await channel.subscribe((msg: Types.Message) => {
        console.log(msg);
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");
        if(msg.name === "welcome-message"){
            messageElement.content = "<font style='color:yellow'>"+msg.data+"</font>";
        }else{
            messageElement.textContent = msg.data; // Verwende textContent, um HTML-Injektion zu vermeiden
        }
        const messagesContainer = document.getElementById("messages");
        messagesContainer.appendChild(messageElement);
    });
    
    channel.publish("welcome-message","a new user joined the chat");

})();

export { };
