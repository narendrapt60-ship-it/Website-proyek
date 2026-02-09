// ======== KASIR APP - CART SYSTEM ========

// Object untuk menyimpan data keranjang
let cart = {};

// Fungsi untuk format harga ke format Indonesia
function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);
}

// Fungsi untuk menambah item ke cart
function addToCart(productId, productName, productPrice) {
  if (cart[productId]) {
    // Jika item sudah ada, tambah quantity
    cart[productId].quantity += 1;
  } else {
    // Jika belum ada, buat item baru
    cart[productId] = {
      id: productId,
      name: productName,
      price: productPrice,
      quantity: 1
    };
  }
  updateCart();
}

// Fungsi untuk update quantity
function updateQuantity(productId, change) {
  if (cart[productId]) {
    cart[productId].quantity += change;
    // Jika quantity <= 0, hapus item
    if (cart[productId].quantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCart();
    }
  }
}

// Fungsi untuk menghapus item dari cart
function removeFromCart(productId) {
  delete cart[productId];
  updateCart();
}

// Fungsi untuk update tampilan cart
function updateCart() {
  const cartItemsContainer = document.getElementById('cartItems');
  
  // Jika cart kosong
  if (Object.keys(cart).length === 0) {
    cartItemsContainer.innerHTML = '<p style="text-align: center; color: #94a3b8; padding: 20px;">Belum ada pesanan</p>';
    updateTotals();
    return;
  }

  // Generate HTML untuk setiap item di cart
  let cartHTML = '';
  for (let productId in cart) {
    const item = cart[productId];
    const itemTotal = item.price * item.quantity;
    
    cartHTML += `
      <div class="cart-item">
        <div class="item-detail">
          <p class="item-name"><strong>${item.quantity}x</strong> ${item.name}</p>
          <p class="item-price-small">${formatPrice(itemTotal)}</p>
        </div>
        <div class="item-actions">
          <button class="btn-qty" onclick="updateQuantity(${productId}, -1)"><i class="fa-solid fa-minus"></i></button>
          <button class="btn-qty" onclick="updateQuantity(${productId}, 1)"><i class="fa-solid fa-plus"></i></button>
          <button class="btn-del" onclick="removeFromCart(${productId})"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>
    `;
  }

  cartItemsContainer.innerHTML = cartHTML;
  updateTotals();
}

// Fungsi untuk update total dan pajak
function updateTotals() {
  let subtotal = 0;

  // Hitung subtotal
  for (let productId in cart) {
    const item = cart[productId];
    subtotal += item.price * item.quantity;
  }

  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + tax;

  // Update tampilan
  document.getElementById('subtotal').textContent = formatPrice(subtotal);
  document.getElementById('tax').textContent = formatPrice(tax);
  document.getElementById('total').textContent = formatPrice(total);
}

// Setup event listener untuk tombol tambah produk
document.addEventListener('DOMContentLoaded', function() {
  // Event listener untuk setiap product card
  document.querySelectorAll('.product-card').forEach(card => {
    const addBtn = card.querySelector('.badge-add');
    const productId = card.getAttribute('data-id');
    const productName = card.getAttribute('data-name');
    const productPrice = parseInt(card.getAttribute('data-price'));

    addBtn.addEventListener('click', function() {
      addToCart(productId, productName, productPrice);
    });
  });

  // Initialize tampilan cart
  updateCart();
  // Wire pay button to payment page
  const payBtn = document.getElementById('btnPay');
  if (payBtn) {
    payBtn.addEventListener('click', function() {
      if (Object.keys(cart).length === 0) {
        alert('Belum ada pesanan.');
        return;
      }

      // Hitung totals
      let subtotal = 0;
      for (let productId in cart) {
        const item = cart[productId];
        subtotal += item.price * item.quantity;
      }
      const tax = Math.round(subtotal * 0.1);
      const total = subtotal + tax;

      // Simpan data checkout ke localStorage dan pergi ke halaman bayar
      const checkout = { cart: cart, subtotal: subtotal, tax: tax, total: total };
      localStorage.setItem('checkout_data', JSON.stringify(checkout));
      window.location.href = 'bayar.html';
    });
  }

  // Jika datang dari halaman bayar, tampilkan kembalian terakhir (jika ada)
  const lastChangeRaw = localStorage.getItem('last_change');
  if (lastChangeRaw !== null) {
    const lastChangeEl = document.getElementById('lastChange');
    if (lastChangeEl) {
      const val = parseInt(lastChangeRaw) || 0;
      lastChangeEl.textContent = formatPrice(val);
    }
    // Hapus setelah ditampilkan sekali
    localStorage.removeItem('last_change');
  }
});

// Helper to clear checkout storage (optional)
function clearCheckoutStorage() {
  localStorage.removeItem('checkout_data');
}
