import { Types } from "ably/promises";
import * as Ably from "ably/promises";

(async () => {
    const optionalClientId = "optionalClientId"; // When not provided in authUrl, a default will be used.
    const ably = new Ably.Realtime.Promise({ authUrl: `/api/ably-token-request?clientId=${optionalClientId}` });
    const channel = ably.channels.get("some-channel-name");

    const messages = document.getElementById("messages");
    const form = document.getElementById("form");
    const input = document.getElementById("input") as HTMLInputElement;
    const username = setUsername().replace(/[^a-zA-Z0-9_-]/g, '');
    document.getElementById("username").textContent = username;
    
    form.addEventListener("submit", (e: SubmitEvent) => {
        e.preventDefault();
        if (input.value != "") {
            channel.publish({ name: "chat-message", data: username + " > " + input.value });
        }
        input.value = "";
        input.focus();
    });
    
    await channel.subscribe((msg: Types.Message) => {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");
        messageElement.id = msg.id + "-message";
    
        if (msg.name === "welcome-message") {
            messageElement.innerHTML = `<span class="welcome-message">${msg.data}</span>`;
        } else {
            var date = new Date(msg.timestamp);
            var hours = ('0' + date.getHours()).slice(-2);
            var minutes = ('0' + date.getMinutes()).slice(-2);
            var seconds = ('0' + date.getSeconds()).slice(-2);
            var formattedDateTime = hours + ':' + minutes + ':' + seconds;

            // Check if message is a GIF link
            if (msg.data.trim().match(/\.(gif)$/i)) {
                messageElement.innerHTML = `${formattedDateTime} ${msg.data.split('>')[0]} > <img src="${msg.data.split('>')[1].trim()}" class="message-image">`;
            } else {
                messageElement.textContent = formattedDateTime + " " + msg.data;
            }
        }
    
        const messagesContainer = document.getElementById("messages");
        messagesContainer.appendChild(messageElement);
    });

    let date = new Date(Date.now());
    let hours = ('0' + date.getHours()).slice(-2);
    let minutes = ('0' + date.getMinutes()).slice(-2);
    let seconds = ('0' + date.getSeconds()).slice(-2);
    let formattedDateTime = hours + ':' + minutes + ':' + seconds;
    channel.publish("welcome-message", `${formattedDateTime} - ${username} joined the chat`);
})();

export { };

function setUsername() {
    let username = prompt("Please enter a valid username");
    
    if (!username || username.trim() === "") {
        alert("Username cannot be empty");
        return setUsername();
    }
    return username;
}
