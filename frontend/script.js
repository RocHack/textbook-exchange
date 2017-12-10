const $fab = document.getElementById('add-button');
const $modal = document.getElementById('add-post');

$fab.addEventListener('click', _ => {
  if ($modal.style.display == 'flex') {
    $modal.style.display = 'none';
  } else {
    $modal.style.display = 'flex';
  }
});

function toggleModal() {
  
}