// Image Manager JavaScript for Dynamic Photo Updates
class ImageManager {
    constructor() {
        this.imageSettings = this.loadSettings();
        this.initializeFileUploads();
        this.loadCurrentImages();
    }

    // Load settings from localStorage
    loadSettings() {
        const saved = localStorage.getItem('shutterCreationImages');
        return saved ? JSON.parse(saved) : {
            profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            logo: '',
            portfolio: [
                'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
            ]
        };
    }

    // Save settings to localStorage
    saveSettings() {
        localStorage.setItem('shutterCreationImages', JSON.stringify(this.imageSettings));
    }

    // Load current images into preview
    loadCurrentImages() {
        document.getElementById('profile-preview').src = this.imageSettings.profilePhoto;
        
        if (this.imageSettings.logo) {
            document.getElementById('logo-preview').src = this.imageSettings.logo;
        }
        
        this.imageSettings.portfolio.forEach((url, index) => {
            const img = document.getElementById(`portfolio-${index + 1}`);
            if (img) img.src = url;
        });
    }

    // Initialize file upload handlers
    initializeFileUploads() {
        document.getElementById('profile-file').addEventListener('change', (e) => {
            this.handleFileUpload(e, 'profile-url', 'profile-preview');
        });

        document.getElementById('logo-file').addEventListener('change', (e) => {
            this.handleFileUpload(e, 'logo-url', 'logo-preview');
        });
    }

    // Handle file upload and convert to data URL
    handleFileUpload(event, urlInputId, previewId) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataUrl = e.target.result;
                document.getElementById(urlInputId).value = dataUrl;
                document.getElementById(previewId).src = dataUrl;
            };
            reader.readAsDataURL(file);
        }
    }

    // Show success message
    showSuccess(elementId) {
        const element = document.getElementById(elementId);
        element.style.display = 'block';
        setTimeout(() => {
            element.style.display = 'none';
        }, 3000);
    }

    // Update images across the website
    updateWebsiteImages() {
        // This function would typically make API calls to update the actual website files
        // For now, we'll update localStorage and provide instructions
        this.saveSettings();
        
        // Update the actual website files by modifying the DOM if they're loaded
        this.updateMainWebsite();
    }

    // Update main website if pages are loaded
    updateMainWebsite() {
        try {
            // Try to update images in parent window or other tabs
            const pages = ['index.html', 'about.html', 'programs.html'];
            
            // Store in sessionStorage for cross-page updates
            sessionStorage.setItem('imageUpdates', JSON.stringify(this.imageSettings));
            
            // Dispatch custom event for real-time updates
            window.dispatchEvent(new CustomEvent('imagesUpdated', {
                detail: this.imageSettings
            }));
        } catch (error) {
            console.log('Cross-page update not available:', error);
        }
    }
}

// Initialize Image Manager
const imageManager = new ImageManager();

// Global functions for button clicks
function updateProfilePhoto() {
    const url = document.getElementById('profile-url').value;
    if (url) {
        imageManager.imageSettings.profilePhoto = url;
        document.getElementById('profile-preview').src = url;
        imageManager.updateWebsiteImages();
        imageManager.showSuccess('profile-success');
    }
}

function updateLogo() {
    const url = document.getElementById('logo-url').value;
    if (url) {
        imageManager.imageSettings.logo = url;
        document.getElementById('logo-preview').src = url;
        imageManager.updateWebsiteImages();
        imageManager.showSuccess('logo-success');
    }
}

function updatePortfolioImage(index) {
    const url = document.getElementById(`portfolio-url-${index}`).value;
    if (url) {
        imageManager.imageSettings.portfolio[index - 1] = url;
        document.getElementById(`portfolio-${index}`).src = url;
        imageManager.updateWebsiteImages();
        
        // Show success message
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.style.display = 'block';
        successDiv.textContent = `Portfolio image ${index} updated successfully!`;
        
        const controls = document.getElementById(`portfolio-url-${index}`).parentNode;
        controls.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }
}

function resetToDefaults() {
    if (confirm('Are you sure you want to reset all images to defaults?')) {
        localStorage.removeItem('shutterCreationImages');
        location.reload();
    }
}

function exportSettings() {
    const settings = JSON.stringify(imageManager.imageSettings, null, 2);
    const blob = new Blob([settings], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shutter-creation-images.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function previewChanges() {
    window.open('index.html', '_blank');
}

// Auto-save functionality
document.addEventListener('input', (e) => {
    if (e.target.classList.contains('url-input')) {
        // Auto-preview images as user types
        const previewId = e.target.id.replace('-url', '-preview');
        const preview = document.getElementById(previewId);
        
        if (preview && e.target.value) {
            // Debounce the preview update
            clearTimeout(e.target.previewTimeout);
            e.target.previewTimeout = setTimeout(() => {
                preview.src = e.target.value;
            }, 500);
        }
    }
});

// Handle drag and drop for images
document.addEventListener('DOMContentLoaded', () => {
    const dropZones = document.querySelectorAll('.current-image');
    
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.style.border = '3px dashed #f39c12';
        });
        
        zone.addEventListener('dragleave', () => {
            zone.style.border = '3px solid #f39c12';
        });
        
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.style.border = '3px solid #f39c12';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const file = files[0];
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const img = zone.querySelector('img');
                        img.src = event.target.result;
                        
                        // Update corresponding URL input
                        const imgId = img.id;
                        const urlInput = document.getElementById(imgId.replace('-preview', '-url'));
                        if (urlInput) {
                            urlInput.value = event.target.result;
                        }
                    };
                    reader.readAsDataURL(file);
                }
            }
        });
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case 's':
                e.preventDefault();
                // Save all current changes
                imageManager.updateWebsiteImages();
                alert('All changes saved!');
                break;
            case 'r':
                e.preventDefault();
                if (confirm('Reset all images?')) {
                    resetToDefaults();
                }
                break;
        }
    }
});

// Add live preview functionality
function enableLivePreview() {
    const style = document.createElement('style');
    style.textContent = `
        .live-preview {
            position: fixed;
            top: 10px;
            left: 10px;
            width: 300px;
            height: 200px;
            background: white;
            border: 2px solid #f39c12;
            border-radius: 10px;
            z-index: 10000;
            display: none;
            overflow: hidden;
        }
        .live-preview iframe {
            width: 100%;
            height: 100%;
            border: none;
            transform: scale(0.3);
            transform-origin: top left;
            width: 333%;
            height: 333%;
        }
    `;
    document.head.appendChild(style);
}

enableLivePreview();

// Enhanced Image Manager with Bulk Upload and Gallery Management
class GalleryManager {
    constructor() {
        this.gallery = this.loadGallery();
        this.selectedImages = new Set();
        this.currentFilter = 'all';
        this.initializeBulkUpload();
        this.initializeGallery();
        this.renderGallery();
    }

    loadGallery() {
        const saved = localStorage.getItem('shutterCreationGallery');
        return saved ? JSON.parse(saved) : [];
    }

    saveGallery() {
        localStorage.setItem('shutterCreationGallery', JSON.stringify(this.gallery));
        this.updateStats();
    }

    initializeBulkUpload() {
        const uploadZone = document.getElementById('bulk-upload-zone');
        const fileInput = document.getElementById('bulk-file-input');

        // Click to upload
        uploadZone.addEventListener('click', () => {
            fileInput.click();
        });

        // File input change
        fileInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });

        // Drag and drop
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });

        uploadZone.addEventListener('dragleave', () => {
            uploadZone.classList.remove('dragover');
        });

        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            this.handleFiles(e.dataTransfer.files);
        });
    }

    async handleFiles(files) {
        const fileArray = Array.from(files);
        const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));
        
        if (imageFiles.length === 0) {
            alert('Please select image files only.');
            return;
        }

        this.showProgress();
        
        for (let i = 0; i < imageFiles.length; i++) {
            const file = imageFiles[i];
            const progress = ((i + 1) / imageFiles.length) * 100;
            
            this.updateProgress(progress, `Processing ${file.name}...`);
            
            const imageData = await this.processImage(file);
            this.gallery.push(imageData);
        }

        this.hideProgress();
        this.saveGallery();
        this.renderGallery();
        
        // Clear file input
        document.getElementById('bulk-file-input').value = '';
        
        // Show success message
        this.showNotification(`Successfully uploaded ${imageFiles.length} images!`, 'success');
    }

    processImage(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageData = {
                    id: Date.now() + Math.random(),
                    name: file.name,
                    src: e.target.result,
                    category: 'other',
                    uploadDate: new Date().toISOString(),
                    size: file.size,
                    type: file.type
                };
                resolve(imageData);
            };
            reader.readAsDataURL(file);
        });
    }

    showProgress() {
        document.getElementById('upload-progress').style.display = 'block';
    }

    hideProgress() {
        document.getElementById('upload-progress').style.display = 'none';
    }

    updateProgress(percent, text) {
        document.getElementById('progress-fill').style.width = percent + '%';
        document.getElementById('progress-text').textContent = text;
    }

    initializeGallery() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.category;
                this.renderGallery();
            });
        });
    }

    renderGallery() {
        const gallery = document.getElementById('image-gallery');
        const filteredImages = this.currentFilter === 'all' 
            ? this.gallery 
            : this.gallery.filter(img => img.category === this.currentFilter);

        if (filteredImages.length === 0) {
            gallery.innerHTML = '<div class="empty-gallery">No images found. Upload some images to get started!</div>';
            this.updateStats();
            return;
        }

        gallery.innerHTML = filteredImages.map(image => `
            <div class="gallery-item" data-id="${image.id}">
                <img src="${image.src}" alt="${image.name}">
                <select class="category-select" onchange="galleryManager.updateImageCategory('${image.id}', this.value)">
                    <option value="wedding" ${image.category === 'wedding' ? 'selected' : ''}>Wedding</option>
                    <option value="portrait" ${image.category === 'portrait' ? 'selected' : ''}>Portrait</option>
                    <option value="event" ${image.category === 'event' ? 'selected' : ''}>Event</option>
                    <option value="other" ${image.category === 'other' ? 'selected' : ''}>Other</option>
                </select>
                <div class="gallery-item-overlay">
                    <div class="gallery-item-actions">
                        <button onclick="galleryManager.toggleSelection('${image.id}')" title="Select">
                            <i class="fas fa-check"></i>
                        </button>
                        <button onclick="galleryManager.useAsProfile('${image.id}')" title="Use as Profile">
                            <i class="fas fa-user"></i>
                        </button>
                        <button onclick="galleryManager.addToPortfolioSingle('${image.id}')" title="Add to Portfolio">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button onclick="galleryManager.deleteImage('${image.id}')" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="gallery-item-info">
                    <h4>${image.name}</h4>
                    <p>${this.formatFileSize(image.size)} • ${new Date(image.uploadDate).toLocaleDateString()}</p>
                </div>
            </div>
        `).join('');

        // Add click listeners for selection
        gallery.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.gallery-item-overlay') && !e.target.closest('.category-select')) {
                    this.toggleSelection(item.dataset.id);
                }
            });
        });

        this.updateStats();
        this.updateSelectionDisplay();
    }

    toggleSelection(imageId) {
        if (this.selectedImages.has(imageId)) {
            this.selectedImages.delete(imageId);
        } else {
            this.selectedImages.add(imageId);
        }
        this.updateSelectionDisplay();
        this.updateStats();
    }

    updateSelectionDisplay() {
        document.querySelectorAll('.gallery-item').forEach(item => {
            if (this.selectedImages.has(item.dataset.id)) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
    }

    updateImageCategory(imageId, category) {
        const image = this.gallery.find(img => img.id == imageId);
        if (image) {
            image.category = category;
            this.saveGallery();
        }
    }

    useAsProfile(imageId) {
        const image = this.gallery.find(img => img.id == imageId);
        if (image) {
            imageManager.imageSettings.profilePhoto = image.src;
            document.getElementById('profile-preview').src = image.src;
            imageManager.updateWebsiteImages();
            this.showNotification('Profile photo updated!', 'success');
        }
    }

    addToPortfolioSingle(imageId) {
        const image = this.gallery.find(img => img.id == imageId);
        if (image) {
            // Find first available portfolio slot
            for (let i = 0; i < 4; i++) {
                if (!imageManager.imageSettings.portfolio[i] || 
                    imageManager.imageSettings.portfolio[i].includes('unsplash.com')) {
                    imageManager.imageSettings.portfolio[i] = image.src;
                    document.getElementById(`portfolio-${i + 1}`).src = image.src;
                    imageManager.updateWebsiteImages();
                    this.showNotification(`Added to portfolio slot ${i + 1}!`, 'success');
                    return;
                }
            }
            this.showNotification('All portfolio slots are full!', 'warning');
        }
    }

    deleteImage(imageId) {
        if (confirm('Are you sure you want to delete this image?')) {
            this.gallery = this.gallery.filter(img => img.id != imageId);
            this.selectedImages.delete(imageId);
            this.saveGallery();
            this.renderGallery();
            this.showNotification('Image deleted!', 'success');
        }
    }

    updateStats() {
        const total = this.gallery.length;
        const selected = this.selectedImages.size;
        document.getElementById('image-count').textContent = `${total} image${total !== 1 ? 's' : ''}`;
        document.getElementById('selected-count').textContent = `${selected} selected`;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#d4edda' : type === 'warning' ? '#fff3cd' : '#d1ecf1'};
            color: ${type === 'success' ? '#155724' : type === 'warning' ? '#856404' : '#0c5460'};
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize Gallery Manager
const galleryManager = new GalleryManager();

// Global functions for gallery management
function selectAllImages() {
    const visibleImages = document.querySelectorAll('.gallery-item');
    visibleImages.forEach(item => {
        galleryManager.selectedImages.add(item.dataset.id);
    });
    galleryManager.updateSelectionDisplay();
    galleryManager.updateStats();
}

function deleteSelectedImages() {
    if (galleryManager.selectedImages.size === 0) {
        alert('No images selected.');
        return;
    }
    
    if (confirm(`Delete ${galleryManager.selectedImages.size} selected images?`)) {
        galleryManager.selectedImages.forEach(id => {
            galleryManager.gallery = galleryManager.gallery.filter(img => img.id != id);
        });
        galleryManager.selectedImages.clear();
        galleryManager.saveGallery();
        galleryManager.renderGallery();
        galleryManager.showNotification('Selected images deleted!', 'success');
    }
}

function addToPortfolio() {
    if (galleryManager.selectedImages.size === 0) {
        alert('No images selected.');
        return;
    }
    
    const selectedArray = Array.from(galleryManager.selectedImages);
    const maxSlots = Math.min(selectedArray.length, 4);
    
    for (let i = 0; i < maxSlots; i++) {
        const imageId = selectedArray[i];
        const image = galleryManager.gallery.find(img => img.id == imageId);
        if (image) {
            imageManager.imageSettings.portfolio[i] = image.src;
            document.getElementById(`portfolio-${i + 1}`).src = image.src;
        }
    }
    
    imageManager.updateWebsiteImages();
    galleryManager.selectedImages.clear();
    galleryManager.updateSelectionDisplay();
    galleryManager.updateStats();
    galleryManager.showNotification(`Added ${maxSlots} images to portfolio!`, 'success');
}

function exportGallery() {
    const data = {
        gallery: galleryManager.gallery,
        settings: imageManager.imageSettings,
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shutter-creation-gallery.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
