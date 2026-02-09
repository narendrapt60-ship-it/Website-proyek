// Read checkout data from localStorage and render
function formatPrice(price){
  return new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',minimumFractionDigits:0}).format(price);
}

document.addEventListener('DOMContentLoaded', ()=>{
  const dataRaw = localStorage.getItem('checkout_data');
  if(!dataRaw){
    alert('Tidak ada data checkout. Kembali ke halaman kasir.');
    window.location.href = 'kasir.html';
    return;
  }

  const checkout = JSON.parse(dataRaw);
  const subtotalEl = document.getElementById('subtotal');
  const taxEl = document.getElementById('tax');
  const totalEl = document.getElementById('total');
  const methodEl = document.getElementById('method');
  const givenEl = document.getElementById('given');
  const changeEl = document.getElementById('change');
  const qrisBox = document.getElementById('qrisBox');
  const confirmBtn = document.getElementById('confirmPay');
  const backBtn = document.getElementById('backBtn');

  subtotalEl.textContent = formatPrice(checkout.subtotal || 0);
  taxEl.textContent = formatPrice(checkout.tax || 0);
  totalEl.textContent = formatPrice(checkout.total || 0);

  function updateChange(){
    const method = methodEl.value;
    const given = parseInt(givenEl.value) || 0;
    const total = checkout.total || 0;
    if(method === 'cash'){
      const change = Math.max(0, given - total);
      changeEl.textContent = formatPrice(change);
      if(qrisBox) qrisBox.style.display = 'none';
    } else {
      changeEl.textContent = formatPrice(0);
      // show QRIS image when selected
      if(qrisBox) qrisBox.style.display = (method === 'qris') ? 'flex' : 'none';
    }
  }

  methodEl.addEventListener('change', ()=>{
    // if non-cash, clear given
    if(methodEl.value !== 'cash') givenEl.value = '';
    // show/hide QRIS immediately
    if(qrisBox) qrisBox.style.display = (methodEl.value === 'qris') ? 'flex' : 'none';
    updateChange();
  });
  givenEl.addEventListener('input', updateChange);

  confirmBtn.addEventListener('click', ()=>{
    const method = methodEl.value;
    const given = parseInt(givenEl.value) || 0;
    const total = checkout.total || 0;
    let change = 0;
    if(method === 'cash'){
      if(given < total){
        alert('Nominal yang diberikan kurang.');
        return;
      }
      change = given - total;
      // continue to success flow
    } else {
      change = 0;
    }

    // simpan success data untuk halaman sukses
    const success = {
      method: method,
      total: total,
      given: given,
      change: change,
      time: new Date().toISOString()
    };
    localStorage.setItem('success_data', JSON.stringify(success));
    // juga simpan last_change untuk tampilan kasir
    localStorage.setItem('last_change', String(change));
    // bersihkan checkout/cart
    localStorage.removeItem('checkout_data');
    localStorage.removeItem('cart_data');
    // arahkan ke halaman sukses
    window.location.href = 'bayar-sukses.html';
  });

  backBtn.addEventListener('click', ()=>{
    window.location.href = 'kasir.html';
  });
});
