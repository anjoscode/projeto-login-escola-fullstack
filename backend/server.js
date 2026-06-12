const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Array em memória para salvar os usuários [cite: 18]
let usuarios = [];

// Rota de Cadastro atualizada para receber Nome e Perfil [cite: 6, 19]
app.post('/cadastro', (req, res) => {
    const { nome, email, senha, perfil } = req.body;
    
    // Adiciona o novo usuário ao array [cite: 18]
    usuarios.push({ nome, email, senha, perfil });
    
    console.log("Novo usuário cadastrado:", nome, email, perfil);
    res.json({ mensagem: "Cadastro realizado com sucesso!" });
});

// Rota de Login validando os dados [cite: 7, 20]
app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    const usuario = usuarios.find(u => u.email === email && u.senha === senha);
    
    if (usuario) {
        // Retorna o objeto do usuário encontrado para o frontend [cite: 8, 16]
        res.json({ sucesso: true, usuario });
    } else {
        // Mensagem de erro caso os dados estejam errados [cite: 9]
        res.status(401).json({ mensagem: "Erro: E-mail ou senha incorretos." });
    }
});

app.listen(3001, () => console.log("Servidor rodando na porta 3001"));