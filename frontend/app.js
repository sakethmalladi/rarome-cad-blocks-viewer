const API_BASE_URL = 'http://localhost:5000/api';
let currentPage = 1;
const itemsPerPage = 10;

async function uploadFile() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];
  
  if (!file) {
    alert('Please select a file first');
    return;
  }
  
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    showLoading(true);
    const response = await fetch(`${API_BASE_URL}/files/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(await response.text());
    }
    
    const result = await response.json();
    alert('File uploaded successfully!');
    loadBlocks();
  } catch (error) {
    console.error('Upload error:', error);
    alert(`Upload failed: ${error.message}`);
  } finally {
    showLoading(false);
  }
}

async function loadBlocks(page = 1) {
  try {
    showLoading(true);
    currentPage = page;
    
    const nameFilter = document.getElementById('nameFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;
    
    let url = `${API_BASE_URL}/blocks?page=${page}&limit=${itemsPerPage}`;
    if (nameFilter) url += `&name=${encodeURIComponent(nameFilter)}`;
    if (typeFilter) url += `&type=${encodeURIComponent(typeFilter)}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch blocks');
    }
    
    const data = await response.json();
    renderBlocks(data.blocks);
    renderPagination(data.total, data.pages, page);
  } catch (error) {
    console.error('Error loading blocks:', error);
    alert('Error loading blocks');
  } finally {
    showLoading(false);
  }
}

function renderBlocks(blocks) {
  const blocksList = document.getElementById('blocksList');
  blocksList.innerHTML = '';
  
  if (blocks.length === 0) {
    blocksList.innerHTML = '<p>No blocks found</p>';
    return;
  }
  
  blocks.forEach(block => {
    const blockCard = document.createElement('div');
    blockCard.className = 'block-card';
    blockCard.innerHTML = `
      <h3>${block.name}</h3>
      <p><strong>Type:</strong> ${block.type}</p>
      <p><strong>Layer:</strong> ${block.layer}</p>
      <p><strong>Position:</strong> X: ${block.x.toFixed(2)}, Y: ${block.y.toFixed(2)}, Z: ${block.z.toFixed(2)}</p>
    `;
    blockCard.onclick = () => showBlockDetails(block.id);
    blocksList.appendChild(blockCard);
  });
}

function renderPagination(totalItems, totalPages, currentPage) {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';
  
  if (totalPages <= 1) return;
  
  const prevButton = document.createElement('button');
  prevButton.textContent = 'Previous';
  prevButton.disabled = currentPage === 1;
  prevButton.onclick = () => loadBlocks(currentPage - 1);
  pagination.appendChild(prevButton);
  
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('button');
    pageButton.textContent = i;
    pageButton.disabled = i === currentPage;
    pageButton.onclick = () => loadBlocks(i);
    pagination.appendChild(pageButton);
  }
  
  const nextButton = document.createElement('button');
  nextButton.textContent = 'Next';
  nextButton.disabled = currentPage === totalPages;
  nextButton.onclick = () => loadBlocks(currentPage + 1);
  pagination.appendChild(nextButton);
}

async function showBlockDetails(blockId) {
  try {
    showLoading(true);
    const response = await fetch(`${API_BASE_URL}/blocks/${blockId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch block details');
    }
    
    const block = await response.json();
    const detailsContent = document.getElementById('detailsContent');
    detailsContent.innerHTML = `
      <h3>${block.name}</h3>
      <p><strong>Type:</strong> ${block.type}</p>
      <p><strong>Layer:</strong> ${block.layer}</p>
      <p><strong>Position:</strong> X: ${block.x}, Y: ${block.y}, Z: ${block.z}</p>
      <p><strong>File:</strong> ${block.file.originalname}</p>
      <h4>Properties:</h4>
      <pre>${JSON.stringify(block.properties, null, 2)}</pre>
    `;
    
    document.getElementById('blockDetails').style.display = 'block';
  } catch (error) {
    console.error('Error loading block details:', error);
    alert('Error loading block details');
  } finally {
    showLoading(false);
  }
}

function hideDetails() {
  document.getElementById('blockDetails').style.display = 'none';
}

function showLoading(show) {
  document.getElementById('loading').style.display = show ? 'block' : 'none';
}

// Initial load
document.addEventListener('DOMContentLoaded', () => {
  loadBlocks();
});