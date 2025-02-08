// Certifique-se de que o evento de clique está corretamente vinculado
const videoUploadButton = document.getElementById('videoUploadButton');

videoUploadButton.addEventListener('click', function() {
    videoInput.click();
});

const videoInput = document.getElementById('videoInput');
const videoFileNameDisplay = document.getElementById('videoFileName');

// Certifique-se de que a variável dropArea está sendo usada corretamente
const videoDropArea = document.getElementById('videoDropArea');

// Prevenir comportamentos padrão
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    videoDropArea.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// Adicionar classes para efeitos visuais
['dragenter', 'dragover'].forEach(eventName => {
    videoDropArea.addEventListener(eventName, () => videoDropArea.classList.add('highlight'), false);
});

['dragleave', 'drop'].forEach(eventName => {
    videoDropArea.addEventListener(eventName, () => videoDropArea.classList.remove('highlight'), false);
});

// Lidar com arquivos arrastados
videoDropArea.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;

    handleVideoFiles(files);
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

// Usar o elemento de vídeo existente para pré-visualização
const videoPreview = document.getElementById('videoPreview');
const videoPreviewContainer = document.getElementById('videoPreviewContainer');

function handleVideoFiles(files) {
    // Resetar o estado do preview
    videoPreview.src = '';
    videoPreviewContainer.style.display = 'none';
    videoFileNameDisplay.textContent = '';

    if (files && files[0]) {
        const file = files[0];
        
        // Verificar se é um arquivo de vídeo
        if (!file.type.startsWith('video/')) {
            alert('Por favor, selecione um arquivo de vídeo válido.');
            return;
        }

        // Atualizar o nome do arquivo
        videoFileNameDisplay.textContent = file.name;

        // Criar URL do objeto para preview
        const videoURL = URL.createObjectURL(file);
        
        // Configurar eventos do vídeo
        videoPreview.onerror = function() {
            alert('Erro ao carregar o vídeo. Por favor, tente outro arquivo.');
            URL.revokeObjectURL(videoURL);
            videoPreviewContainer.style.display = 'none';
        };

        videoPreview.onloadeddata = function() {
            // Mostrar o container apenas quando o vídeo estiver carregado
            videoPreviewContainer.style.display = 'block';
            videoPreview.play();
            videoPreview.pause();
        };

        // Limpar a URL do objeto quando não for mais necessário
        videoPreview.onload = function() {
            URL.revokeObjectURL(videoURL);
        };

        // Definir a fonte do vídeo
        videoPreview.src = videoURL;
    }
}

videoInput.addEventListener('change', function() {
    if (videoInput.files.length > 0) {
        handleVideoFiles(videoInput.files);
    }
});