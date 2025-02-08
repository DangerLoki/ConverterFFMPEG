const { createFFmpeg } = FFmpeg;
const ffmpeg = createFFmpeg({ log: true });

document.getElementById('convertImage').addEventListener('click', async () => {
    const imageInput = document.getElementById('imageInput');
    const outputFormat = document.getElementById('outputFormat').value;

    if (imageInput.files.length === 0) {
        alert('Por favor, selecione uma imagem.');
        return;
    }

    try {
        // Carregar o FFmpeg
        if (!ffmpeg.isLoaded()) {
            await ffmpeg.load();
        }

        // Ler o arquivo como array buffer
        const imageData = await imageInput.files[0].arrayBuffer();
        
        // Escrever o arquivo no sistema de arquivos virtual
        ffmpeg.FS('writeFile', 'input.jpg', new Uint8Array(imageData));

        // Executar o comando de conversão
        await ffmpeg.run('-i', 'input.jpg', `output.${outputFormat}`);

        // Ler o arquivo convertido
        const data = ffmpeg.FS('readFile', `output.${outputFormat}`);

        // Criar um link para download
        const url = URL.createObjectURL(new Blob([data.buffer], { type: `image/${outputFormat}` }));
        const output = document.getElementById('output');
        output.innerHTML = `<a href="${url}" download="output.${outputFormat}" class="btn btn-success">
            <i class="fas fa-download"></i> Baixar imagem convertida
        </a>`;

    } catch (error) {
        console.error(error);
        alert('Erro ao converter a imagem. Por favor, tente novamente.');
    }
});