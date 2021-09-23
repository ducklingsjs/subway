setInterval(() => {
    const el = document.getElementsByTagName('li')[0];
    console.log(document.body.clientWidth);
    if (el) {
        console.log(el.getBoundingClientRect());
    }
}, 1000)

function addMessage(message) {
    const list = document.getElementById('message-list');
    const listItem = document.createElement('li');
    listItem.appendChild(document.createTextNode(message));
    list.appendChild(listItem);
}

function deleteMessage(message, elementLeftBound) {
    const firstMessage = document.getElementsByTagName('li')[0];

    if (firstMessage && firstMessage.getBoundingClientRect().left < 0) {

    }
}
