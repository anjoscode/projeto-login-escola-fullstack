const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Banco de dados em memória (será limpo ao reiniciar o servidor)
let usuarios = [];

/**
 * ROTA DE CADASTRO
 * Adiciona um novo usuário ao array se o e-mail não existir.
 */
app.post('/cadastro', (req, res) => {
    const { nome, email, senha, perfil } = req.body;
    
    const usuarioExistente = usuarios.find(u => u.email === email);
    
    if (usuarioExistente) {
        return res.status(400).json({ mensagem: "Erro: E-mail já cadastrado!" });
    }

    usuarios.push({ nome, email, senha, perfil });
    res.status(201).json({ mensagem: "Cadastro realizado com sucesso!" });
});

/**
 * ROTA DE LOGIN
 * Validação passo a passo para garantir que o usuário e perfil coincidam.
 */
app.post('/login', (req, res) => {
    const { email, senha, perfil } = req.body;
    
    // 1. Localiza o usuário apenas pelo e-mail
    const usuario = usuarios.find(u => u.email === email);
    
    if (!usuario) {
        return res.status(401).json({ mensagem: "E-mail não encontrado." });
    }

    // 2. Valida se o perfil selecionado bate com o perfil cadastrado
    if (usuario.perfil !== perfil) {
        return res.status(401).json({ 
            mensagem: `Este e-mail está cadastrado como ${usuario.perfil}.` 
        });
    }

    // 3. Valida a senha
    if (usuario.senha !== senha) {
        return res.status(401).json({ mensagem: "Senha incorreta." });
    }

    // 4. Sucesso: retorna os dados do usuário
    res.json({ sucesso: true, usuario });
});

// Inicialização do Servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando com sucesso na porta ${PORT}`);
});