// ========================
// LOAD PRODUCTS
// ========================
fetch("products.json")
    .then(res => res.json())
    .then(data => {
        const list = document.getElementById("product-list");
        if (!list) return;

        data.forEach((p, i) => {
            let item = document.createElement("li");
            item.innerHTML = `
                ${p.name} - AED ${p.price}
                <button onclick="addToCart(${i})">Add</button>
            `;
            list.appendChild(item);
        });

        window.products = data;
    });

// ========================
// CART SYSTEM
// ========================
let cart = [];

function addToCart(i) {
    cart.push(products[i]);
    renderCart();
}

function renderCart() {
    const cartList = document.getElementById("cart-items");
    if (!cartList) return;

    cartList.innerHTML = "";
    let total = 0;

    cart.forEach((item, i) => {
        total += item.price;
        let li = document.createElement("li");
        li.innerHTML = `
            ${item.name} - AED ${item.price}
            <button onclick="removeItem(${i})">x</button>
        `;
        cartList.appendChild(li);
    });

    document.getElementById("total").innerText = total.toFixed(2);
}

function removeItem(i) {
    cart.splice(i, 1);
    renderCart();
}

// ========================
// PAYMENT SYSTEM
// ========================
function checkout(type) {
    let total = Number(document.getElementById("total").innerText);
    if (total <= 0) {
        alert("Cart empty!");
        return;
    }

    let payments = JSON.parse(localStorage.getItem("payments") || "[]");

    payments.push({
        amount: total,
        method: type,              // cash, visa, talabat, noon
        items: cart,
        date: new Date().toLocaleString()
    });

    localStorage.setItem("payments", JSON.stringify(payments));

    alert("Payment recorded: " + type.toUpperCase());

    cart = [];
    renderCart();
}

// ========================
// PRINT RECEIPT
// ========================
function printReceipt() {
    window.print();
}
