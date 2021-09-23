function addMessage(message) {
    const list = document.getElementById('message-list');
    const listItem = document.createElement('li');
    listItem.appendChild(document.createTextNode(message));
    list.appendChild(listItem);
}
