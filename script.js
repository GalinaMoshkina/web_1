const STORAGE_KEY = 'cart';

let cart = loadCart();

function loadCart() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
        return [];
    }
}

function saveCart() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function addToCart(product) {
    const existing = cart.find(i => i.id === product.id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    saveCart();
    renderCart();
}

function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        cart = cart.filter(i => i.id !== id);
    }
    saveCart();
    renderCart();
}

function removeItem(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    renderCart();
}

function getTotal() {
    return cart.reduce((sum, i) => sum + i.price * i.qty, 0);
}

function getCount() {
    return cart.reduce((sum, i) => sum + i.qty, 0);
}

const CartList = document.getElementById('CartList');
const CartTotal = document.getElementById('CartTotal');
const CartCount = document.getElementById('CartCount');
const MessageDialog = document.getElementById('MessageDialog');
const MessageText = document.getElementById('MessageText');
const closeMessageBtn = document.getElementById('closeMessageBtn');

function showMessage(text) {
    MessageText.textContent = text;
    MessageDialog.showModal();
}

closeMessageBtn.addEventListener('click', () => MessageDialog.close());
MessageDialog.addEventListener('click', (e) => {
    if (e.target === MessageDialog) MessageDialog.close();
});

function renderCart() {
    CartList.replaceChildren();
    if (cart.length === 0) {
        const li = document.createElement('li');
        li.className = 'CartEmpty';
        li.textContent = 'cart is empty';
        CartList.appendChild(li);
    } else {
        cart.forEach(item => {
            const li = document.createElement('li');
            li.className = 'CartItem';
            const titleSpan = document.createElement('span');
            titleSpan.className = 'CartItemTitle';
            titleSpan.textContent = item.title;
            const controlsDiv = document.createElement('div');
            controlsDiv.className = 'CartItemControls';
            const btnDec = document.createElement('button');
            btnDec.type = 'button';
            btnDec.textContent = '−';
            btnDec.dataset.action = 'dec';
            btnDec.dataset.id = item.id;
            const qtySpan = document.createElement('span');
            qtySpan.textContent = item.qty;
            const btnInc = document.createElement('button');
            btnInc.type = 'button';
            btnInc.textContent = '+';
            btnInc.dataset.action = 'inc';
            btnInc.dataset.id = item.id;
            const btnRemove = document.createElement('button');
            btnRemove.type = 'button';
            btnRemove.textContent = '✕';
            btnRemove.dataset.action = 'remove';
            btnRemove.dataset.id = item.id;
            controlsDiv.append(btnDec, qtySpan, btnInc, btnRemove);
            const sumSpan = document.createElement('span');
            sumSpan.className = 'CartItemSum';
            sumSpan.textContent = `${item.price * item.qty} €`;
            li.append(titleSpan, controlsDiv, sumSpan);
            CartList.appendChild(li);
        });
    }
    CartTotal.textContent = getTotal();
    CartCount.textContent = getCount();
}
CartList.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const id = Number(btn.dataset.id);
    const action = btn.dataset.action;

    if (action === 'inc') changeQty(id, +1);
    if (action === 'dec') changeQty(id, -1);
    if (action === 'remove') removeItem(id);
});


document.querySelectorAll('.card').forEach((card) => {
    const dialog = card.querySelector('dialog');
    const addBtn = card.querySelector('.DialogAdd');
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
    addBtn.addEventListener('click', (e) => {
        e.stopPropagation();

        addToCart({
            id: Number(card.getAttribute('dataid')),
            title: card.getAttribute('datatitle'),
            price: Number(card.getAttribute('dataprice')),
        });
        dialog.close();
    });
});


const CartDialog = document.getElementById('CartDialog');
const openCartBtn = document.getElementById('openCartButton');
const closeCartBtn = document.getElementById('closeCartButton');

openCartBtn.addEventListener('click', () => CartDialog.showModal());
closeCartBtn.addEventListener('click', () => CartDialog.close());

CartDialog.addEventListener('click', (e) => {
    if (e.target === CartDialog) CartDialog.close();
});

renderCart();


const OrderDialog = document.getElementById('OrderDialog');
const OrderForm = document.getElementById('OrderForm');
const checkoutButton = document.getElementById('checkoutButton');
const cancelOrderButton = document.getElementById('cancelOrderButton');
checkoutButton.addEventListener('click', () => {
    if (cart.length === 0) {
        showMessage('cart is empty');
        return;
    }
    CartDialog.close();
    OrderDialog.showModal();
});
cancelOrderButton.addEventListener('click', () => {
    OrderDialog.close();
});
OrderDialog.addEventListener('click', (e) => {
    if (e.target === OrderDialog) OrderDialog.close();
});
OrderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!OrderForm.checkValidity()) {
        OrderForm.reportValidity();
        return;
    }
    showMessage('order has been created');
    cart = [];
    saveCart();
    renderCart();
    OrderForm.reset();

    OrderDialog.close();
});
