document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const formatBtns = document.querySelectorAll('.format-btn');
    const convertBtn = document.getElementById('convertBtn');
    const statusDiv = document.getElementById('status');
    
    let selectedFile = null;
    let selectedFormat = null;
    
    // File selection
    uploadArea.addEventListener('click', () => fileInput.click());

    
    fileInput.addEventListener('change', (e) => {
        selectedFile = e.target.files[0];
        uploadArea.querySelector('p').textContent = selectedFile.name;
        updateConvertButton();
    });
    
    // Format selection
    formatBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            formatBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedFormat = btn.dataset.format;
            updateConvertButton();
        });
    });
    
    // Conversion
    convertBtn.addEventListener('click', async () => {
        if (!selectedFile || !selectedFormat) return;
        
        convertBtn.disabled = true;
        statusDiv.textContent = 'Converting...';
        
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('format', selectedFormat);
            
            const response = await fetch('/convert', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || 'Conversion failed');
            }
            
            statusDiv.innerHTML = `
                Conversion successful! 
                <a href="${result.download_url}" download>Download ${result.filename}</a>
            `;
        } catch (error) {
            statusDiv.textContent = error.message;
        } finally {
            convertBtn.disabled = false;
        }
    });
    
    function updateConvertButton() {
        convertBtn.disabled = !(selectedFile && selectedFormat);
    }
});