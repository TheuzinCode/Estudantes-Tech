document.addEventListener('DOMContentLoaded', function() {
  const mainImg = document.getElementById('produto-main-img');
  const thumbs = Array.from(document.querySelectorAll('.thumbs .thumb'));

  function setActiveThumbById(imageId) {
    thumbs.forEach(t => t.classList.toggle('active', t.getAttribute('data-image-id') === String(imageId)));
  }

  if (mainImg) {
    const currentId = mainImg.getAttribute('data-image-id');
    if (currentId) setActiveThumbById(currentId);
  }
  
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const id = thumb.getAttribute('data-image-id');
      if (!id || !mainImg) return;
      const newSrc = `/images/${encodeURIComponent(id)}`;
      mainImg.src = newSrc;
      mainImg.setAttribute('data-image-id', id);
      setActiveThumbById(id);
    });
  });
});

