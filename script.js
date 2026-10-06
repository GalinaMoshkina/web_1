document.querySelectorAll('.card').forEach((card) => {
    const dialog   = card.querySelector('dialog');
    const closeBtn = card.querySelector('.close');
    card.addEventListener('click', () => {
        if (!dialog.open) {
            dialog.showModal();
        }
    });
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dialog.close();
    });
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) {
            dialog.close();
            e.stopPropagation();
        }
    });
});