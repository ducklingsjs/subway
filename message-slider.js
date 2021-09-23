const animationInterval = 15000;

setInterval(() => {
    addMessage('New message added dynamically');
}, animationInterval);

function addMessage(message) {
    const list = document.getElementById('message-list');
    const listItem = document.createElement('li');
    listItem.appendChild(document.createTextNode(message));
    list.appendChild(listItem);
}
