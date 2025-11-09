export function showLoader() {
  if (document.querySelector('#global-loader')) return;

  const loader = document.createElement('div');
  loader.id = 'global-loader';
  loader.innerHTML = `
    <div class="loader-overlay">
      <div class="loader-spinner"></div>
    </div>
  `;
  document.body.appendChild(loader);
}

export function hideLoader() {
  const loader = document.querySelector('#global-loader');
  if (loader) loader.remove();
}
