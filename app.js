const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Rota para exibir o formulário
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para clonar a página
app.post('/clone', async (req, res) => {
    const { url, afiliado } = req.body;
    const pastaDestino = path.join(__dirname, 'clones', `${Date.now()}`);

    try {
        // Cria o diretório de destino
        if (!fs.existsSync(pastaDestino)) {
            fs.mkdirSync(pastaDestino, { recursive: true });
        }

        // Baixar a página HTML
        const response = await axios.get(url);
        let html = response.data;

        // Substituir o link antigo pelo novo link de afiliado
        html = html.replace(/LINK_DE_AFILIADO_ANTIGO/g, afiliado);

        // Salvar o HTML no diretório
        fs.writeFileSync(path.join(pastaDestino, 'index.html'), html);

        res.send(`Página clonada com sucesso! Verifique a pasta: ${pastaDestino}`);
    } catch (error) {
        res.send(`Erro ao clonar a página: ${error.message}`);
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
