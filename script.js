document.querySelectorAll('.card').forEach((card) => {
    const dialog = card.querySelector('dialog');
    card.addEventListener('click', () => {
        if (!dialog.open) {
            dialog.showModal();
        }
    });
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) {
            dialog.close();
            e.stopPropagation();
        }
    });
});