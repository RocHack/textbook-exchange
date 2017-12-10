const $fab = document.getElementById('add-button');
const $modal = document.getElementById('add-post');
const $postButton = document.getElementById('post-button');

$fab.addEventListener('click', e => {
  if ($modal.style.display == 'flex') {
    $modal.style.display = 'none';
  } else {
    $modal.style.display = 'flex';
  }
});
$postButton.addEventListener('click', e => {
  $modal.style.display = 'none';
});