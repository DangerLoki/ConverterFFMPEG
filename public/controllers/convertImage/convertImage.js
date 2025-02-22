document.getElementById('convertImage').addEventListener('click', async () => {
    const imageInput = document.getElementById('imageInput');
    const outputFormat = document.getElementById('outputFormat').value;

    if (imageInput.files.length === 0) {
        alert('Por favor, selecione uma imagem.');
        return;
    }

    try {
        const { FFmpeg } = FFmpegWASM;
        const ffmpeg = new FFmpeg({ corePath: '/JS/ffmpeg/ffmpeg-core.js' });
        ffmpeg.on('progress', ({ progress }) => {
            updateProgress(progress);
        });
        ffmpeg.on('log', ({ message }) => {
            console.log(`FFmpeg: ${message}`);
        });
        // Carregar o FFmpeg
        if (!ffmpeg.loaded) {
            await ffmpeg.load();
        }


        const inputImage = imageInput.files[0];
        const outputImage = `${inputImage.name.split('.')[0]}.${outputFormat}`;

        // Ler o arquivo como array buffer
        const imageData = await inputImage.arrayBuffer();

        // Escrever o arquivo no sistema de arquivos virtual
        ffmpeg.writeFile(inputImage.name, new Uint8Array(imageData));

        // Executar o comando de conversão
        await ffmpeg.exec(['-i', inputImage.name, outputImage]);

        // Ler o arquivo convertido
        const data = await ffmpeg.readFile(outputImage);
        console.log(data);

        // Criar um link para download
        const url = URL.createObjectURL(new Blob([data.buffer], { type: `image/${outputFormat}` }));
        const output = document.getElementById('output');
        output.innerHTML = `<a href="${url}" download="${outputImage}" class="btn btn-success">
            <i class="fas fa-download"></i> Baixar imagem convertida
        </a>`;

    } catch (error) {
        console.error(error);
        alert('Erro ao converter a imagem. Por favor, tente novamente.');
    }
});
