const express = require('express');
const cors = require('cors');

const app = express();

// 1. Porta Dinâmica (usa a porta do Render ou cai para a 3001)
const PORT = process.env.PORT || 3001;

// 2. CORS: Liberar para qualquer origem (mais simples para seu deploy inicial)
app.use(cors()); 
app.use(express.json());

let usuarios = [];

app.post('/cadastro', (req, res) => {
    const { nome, email, senha, perfil } = req.body;
    const usuarioExistente = usuarios.find(u => u.email === email);
    
    if (usuarioExistente) {
        return res.status(400).json({ mensagem: "Erro: E-mail já cadastrado!" });
    }

    usuarios.push({ nome, email, senha, perfil });
    res.status(201).json({ mensagem: "Cadastro realizado com sucesso!" });
});

app.post('/login', (req, res) => {
    const { email, senha, perfil } = req.body;
    
    const usuario = usuarios.find(u => u.email === email);
    
    if (!usuario) {
        return res.status(401).json({ mensagem: "E-mail não encontrado." });
    }

    if (usuario.perfil !== perfil) {
        return res.status(401).json({ 
            mensagem: `Este e-mail está cadastrado como ${usuario.perfil}.` 
        });
    }

    if (usuario.senha !== senha) {
        return res.status(401).json({ mensagem: "Senha incorreta." });
    }

    res.json({ sucesso: true, usuario });
});

// 3. Atualizado para usar a constante PORT
app.listen(PORT, () => {
    console.log(`Servidor rodando com sucesso na porta ${PORT}`);
});