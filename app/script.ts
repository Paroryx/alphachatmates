import { Types } from "ably/promises";
import * as Ably from "ably/promises";

(async () => {
    const optionalClientId = "optionalClientId"; // When not provided in authUrl, a default will be used.
    const ably = new Ably.Realtime.Promise({ authUrl: `/api/ably-token-request?clientId=${optionalClientId}` });
    const channel = ably.channels.get("some-channel-name");

    const messages = document.getElementById("messages");
    const form = document.getElementById("form");
    const input = document.getElementById("input") as HTMLInputElement;
    const username = setUsername();

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
    
        // Füge eine eindeutige ID basierend auf der Nachrichten-ID hinzu
        messageElement.id = msg.id + "-message";
    
        if (msg.name === "welcome-message") {
            messageElement.innerHTML = `<span class="welcome-message">${msg.data}</span>`;
        } else {
            var date = new Date(msg.timestamp);
            var year = date.getFullYear();
            var month = ('0' + (date.getMonth() + 1)).slice(-2); // Monat beginnt bei 0, deshalb +1
            var day = ('0' + date.getDate()).slice(-2); // Füge eine führende Null hinzu, wenn der Tag einstellig ist
            var hours = ('0' + date.getHours()).slice(-2);
            var minutes = ('0' + date.getMinutes()).slice(-2);
            var seconds = ('0' + date.getSeconds()).slice(-2);
            var formattedDateTime = day + '.' + month + '.' + year + ' ' + hours + ':' + minutes + ':' + seconds;

            messageElement.textContent = formattedDateTime+" "+msg.data;
        }
    
        const messagesContainer = document.getElementById("messages");
        messagesContainer.appendChild(messageElement);
    });
    
    channel.publish("welcome-message",`${username} joined the chat`);

})();

export { };
