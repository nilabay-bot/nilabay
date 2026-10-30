(() => {
  const bookingUrl = 'https://calendar.app.google/7oGxouMbEHSWySFY9';
  const embedUrl = 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ2fFDzEFfvEyaNd5RFI7EnHuvPu-OyHg09v8boDmvbrG_lNIMtM8VRfE2GrjCxtcN84mQJF5hUv?gv=true';
  if (typeof HTMLDialogElement === 'undefined' || !HTMLDialogElement.prototype.showModal) return;

  const dialog = document.createElement('dialog');
  dialog.className = 'booking-dialog';
  dialog.setAttribute('aria-labelledby', 'booking-title');
  dialog.innerHTML = '<div class="booking-heading"><h2 id="booking-title">Book a free conversation</h2><button class="booking-close" type="button" aria-label="Close booking calendar" autofocus>×</button></div><p class="booking-help">20 minutes. No obligation. <a href="' + bookingUrl + '" target="_blank" rel="noopener noreferrer">Open calendar in a new tab ↗</a></p><iframe title="Choose a time for your free nilabay conversation"></iframe>';
  document.body.append(dialog);
  const frame = dialog.querySelector('iframe');
  let trigger;

  document.querySelectorAll('a[href="' + bookingUrl + '"]').forEach(link => {
    // Keep the fallback link and modified clicks as ordinary new-tab links.
    if (dialog.contains(link)) return;
    link.setAttribute('aria-haspopup', 'dialog');
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      trigger = link;
      if (!frame.hasAttribute('src')) frame.src = embedUrl;
      dialog.showModal();
      document.documentElement.classList.add('booking-open');
    });
  });
  dialog.querySelector('.booking-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('booking-open');
    if (trigger?.isConnected && trigger.getClientRects().length) trigger.focus();
    else document.querySelector('.mobile-menu-toggle')?.focus();
  });
})();
