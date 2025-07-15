// Utility: Get categories from storage
function fetchCategories() {
  return new Promise(resolve => {
    chrome.storage.local.get(['categories'], data => {
      resolve(data.categories || []);
    });
  });
}
// Utility: Save categories
function saveCategories(categories) {
  chrome.storage.local.set({ categories });
}
// Utility: Get reading list
function fetchReadingList() {
  return new Promise(resolve => {
    chrome.storage.local.get(['readingList'], data => {
      resolve(data.readingList || []);
    });
  });
}
// Utility: Save reading list
function saveReadingList(readingList) {
  chrome.storage.local.set({ readingList });
}

// Populate open tabs
function loadTabs() {
  chrome.tabs.query({ currentWindow: true }, tabs => {
    const list = document.getElementById('tab-list');
    list.innerHTML = '';
    tabs.forEach(tab => {
      const li = document.createElement('li');
      li.textContent = tab.title;
      // Close button
      const closeBtn = document.createElement('button');
      closeBtn.textContent = 'Close';
      closeBtn.onclick = () => chrome.tabs.remove(tab.id);
      // Save button
      const saveBtn = document.createElement('button');
      saveBtn.textContent = 'Save';
      saveBtn.onclick = async () => {
        const categories = await fetchCategories();
        let cat = prompt(`Save to which category? Available: ${categories.join(', ')}`, categories[0] || '');
        if (!cat) return;
        // Add to reading list
        fetchReadingList().then(list => {
          list.push({ url: tab.url, title: tab.title, category: cat });
          saveReadingList(list);
          loadReadingList();
        });
      };
      li.appendChild(closeBtn);
      li.appendChild(saveBtn);
      list.appendChild(li);
    });
  });
}

// Populate reading list
function loadReadingList() {
  fetchReadingList().then(list => {
    const ul = document.getElementById('reading-list');
    ul.innerHTML = '';
    list.forEach((item, idx) => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="${item.url}" target="_blank">${item.title}</a> [${item.category}]`;
      // Remove button
      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Remove';
      removeBtn.onclick = () => {
        list.splice(idx, 1);
        saveReadingList(list);
        loadReadingList();
      };
      li.appendChild(removeBtn);
      ul.appendChild(li);
    });
  });
}

// Populate categories
function loadCategories() {
  fetchCategories().then(categories => {
    const ul = document.getElementById('category-list');
    ul.innerHTML = '';
    categories.forEach((cat, idx) => {
      const li = document.createElement('li');
      li.textContent = cat;
      // Remove button
      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Remove';
      removeBtn.onclick = () => {
        categories.splice(idx, 1);
        saveCategories(categories);
        loadCategories();
      };
      li.appendChild(removeBtn);
      ul.appendChild(li);
    });
  });
}

// Add category handler
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('add-category-btn').onclick = () => {
    const input = document.getElementById('new-category');
    let val = input.value.trim();
    if (!val) return;
    fetchCategories().then(categories => {
      if (!categories.includes(val)) {
        categories.push(val);
        saveCategories(categories);
        loadCategories();
      }
      input.value = '';
    });
  };
  loadTabs();
  loadReadingList();
  loadCategories();
});