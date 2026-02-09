function formatPrice(price){
  return new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',minimumFractionDigits:0}).format(price);
}

document.addEventListener('DOMContentLoaded', ()=>{
  const raw = localStorage.getItem('success_data');
  if(!raw){
    // jika tidak ada data sukses, kembali ke kasir
    window.location.href = 'kasir.html';
    return;
  }

  const data = JSON.parse(raw);
  const methodEl = document.getElementById('s-method');
  const totalEl = document.getElementById('s-total');
  const givenEl = document.getElementById('s-given');
  const changeEl = document.getElementById('s-change');
  const timeEl = document.getElementById('s-time');

  methodEl.textContent = (data.method === 'cash') ? 'Tunai' : (data.method === 'card' ? 'Kartu' : 'QRIS');
  totalEl.textContent = formatPrice(data.total || 0);
  givenEl.textContent = formatPrice(data.given || 0);
  changeEl.textContent = formatPrice(data.change || 0);
  timeEl.textContent = new Date(data.time).toLocaleString();

  document.getElementById('backToKasir').addEventListener('click', ()=>{
    // bersihkan success_data setelah kembali
    localStorage.removeItem('success_data');
    window.location.href = 'kasir.html';
  });

  document.getElementById('printReceipt').addEventListener('click', ()=>{
    // cetak sederhana menggunakan window.print()
    window.print();
  });
});
