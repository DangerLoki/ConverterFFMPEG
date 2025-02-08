document.getElementById('imageUploadButton').addEventListener('click', function() {
    document.getElementById('imageInput').click();
});


const dropArea = document.getElementById('imagedropArea');
const imageInput = document.getElementById('imageInput');


// Prevenir comportamentos padrão
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// Adicionar classes para efeitos visuais
['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, () => dropArea.classList.add('highlight'), false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, () => dropArea.classList.remove('highlight'), false);
});

// Lidar com arquivos arrastados
dropArea.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;

    handleFiles(files);
}

// Lidar com arquivos colados
document.addEventListener('paste', (e) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
        if (items[i].kind === 'file') {
            const file = items[i].getAsFile();
            handleFiles([file]);
        }
    }
});

function handleFiles(files) {
    const fileNameDisplay = document.getElementById('fileName');
    fileNameDisplay.textContent = files[0].name;

    const preview = document.getElementById('preview');
    const reader = new FileReader();
    reader.onload = function(e) {
        preview.src = e.target.result;
        preview.style.display = 'block';
    }
    reader.readAsDataURL(files[0]);
}

imageInput.addEventListener('change', function() {
    if (imageInput.files.length > 0) {
        handleFiles(imageInput.files);
    }
});