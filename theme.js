// Aplica el tema guardado antes de pintar, para que no parpadee.
try {
  var t = localStorage.getItem('tema');
  if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
} catch (e) {}
