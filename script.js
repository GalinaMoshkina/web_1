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

const CartList  = document.getElementById('CartList');
const CartTotal = document.getElementById('CartTotal');
const CartCount = document.getElementById('CartCount');


function renderCart() {
    CartList.innerHTML = '';

    if (cart.length === 0) {
        CartList.innerHTML = '<li class="CartEmpty">Cart is empty</li>';
    } else {
        cart.forEach(item => {
            const li = document.createElement('li');
            li.className = 'CartItem';
            li.innerHTML = `
                <span class="CartItemTitle">${item.title}</span>
                <div class="CartItemControls">
                    <button type="button" data-action="dec" data-id="${item.id}">−</button>
                    <span>${item.qty}</span>
                    <button type="button" data-action="inc" data-id="${item.id}">+</button>
                    <button type="button" data-action="remove" data-id="${item.id}">✕</button>
                </div>
                <span class="CartItemSum">${item.price * item.qty} €</span>
            `;
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

    if (action === 'inc')    changeQty(id, +1);
    if (action === 'dec')    changeQty(id, -1);
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
            id:    Number(card.getAttribute('dataid')),
            title: card.getAttribute('datatitle'),
            price: Number(card.getAttribute('dataprice')),
        });
        dialog.close();
    });
});


const CartDialog   = document.getElementById('CartDialog');
const openCartBtn  = document.getElementById('openCartButton');
const closeCartBtn = document.getElementById('closeCartButton');

openCartBtn.addEventListener('click', () => CartDialog.showModal());
closeCartBtn.addEventListener('click', () => CartDialog.close());

CartDialog.addEventListener('click', (e) => {
    if (e.target === CartDialog) CartDialog.close();
});

renderCart();


const OrderDialog      = document.getElementById('OrderDialog');
const OrderForm        = document.getElementById('OrderForm');
const checkoutButton   = document.getElementById('checkoutButton');
const cancelOrderButton = document.getElementById('cancelOrderButton');
checkoutButton.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Cart is empty');
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
    alert('Заказ создан!');
    cart = [];
    saveCart();
    renderCart();
    OrderForm.reset();

    OrderDialog.close();
});