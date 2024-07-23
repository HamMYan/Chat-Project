document.querySelector('button').addEventListener('click', () => {
    const input = document.querySelector('input');
    if (input.value.trim()) {
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('message', 'sent');
        messageContainer.innerHTML = `<p>${input.value}</p>`;
        document.querySelector('.chat').appendChild(messageContainer);
        input.value = '';
    }
});
