document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/devices')
        .then(response => response.json())
        .then(devices => {
            const list = document.getElementById('device-list');
            devices.forEach(dev => {
                const li = document.createElement('li');
                li.textContent = `${dev.id} - ${dev.status} - ${dev.value ?? 'N/A'}`;
                list.appendChild(li);
            });
        })
        .catch(err => {
            console.error('Failed to load devices:', err);
        });
});
