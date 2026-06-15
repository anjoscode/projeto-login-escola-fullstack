import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function PainelPrincipal({ usuario }) {
  // Função para deslogar e recarregar a página
  const handleLogout = () => {
    window.location.reload(); 
  };

  return (
    <div className="wrapper">
      <div className="container" style={{ textAlign: 'center' }}>
        <h1 style={{ marginBottom: '10px' }}>Bem-vindo, {usuario.nome}!</h1>
        
        <p style={{ color: '#94a3b8', marginBottom: '30px' }}>
          Você está logado como: <strong>{usuario.perfil}</strong>
        </p>

        {/* Botão condicional conforme a regra de negócio */}
        <button className="btn-acao" style={{ marginBottom: '10px' }}>
          {usuario.perfil === 'Professor' ? 'Lançar Notas' : 'Acessar Minhas Aulas'}
        </button>

        {/* Botão de Sair adicionado */}
        <button className="btn-sair" onClick={handleLogout}>
          Sair do sistema
        </button>
      </div>
    </div>
  );
}

function App() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [perfil, setPerfil] = useState('Aluno');

  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [isLogin, setIsLogin] = useState(true);

  const [erroMensagem, setErroMensagem] = useState('');
  const [sucessoMensagem, setSucessoMensagem] = useState('');

  useEffect(() => {
    if (sucessoMensagem) {
      const timer = setTimeout(() => {
        setSucessoMensagem('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [sucessoMensagem]);

  useEffect(() => {
    if (erroMensagem) {
      const timer = setTimeout(() => {
        setErroMensagem('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [erroMensagem]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErroMensagem('');
    setSucessoMensagem('');

    const rota = isLogin ? '/login' : '/cadastro';

    try {
      const resposta = await axios.post(
        `http://localhost:3001${rota}`,
        {
          nome,
          email,
          senha,
          perfil,
        }
      );

      if (isLogin) {
        setUsuarioLogado(resposta.data.usuario);
      } else {
        setSucessoMensagem('Cadastro realizado com sucesso!');
        setIsLogin(true);
        setNome('');
        setEmail('');
        setSenha('');
      }
    } catch (erro) {
      setErroMensagem(
        erro.response?.data?.mensagem ||
          'Erro ao conectar com o servidor.'
      );
    }
  };

  if (usuarioLogado) {
    return <PainelPrincipal usuario={usuarioLogado} />;
  }

  return (
    <div className="wrapper">
      <div style={{ textAlign: 'center', color: '#fff' }}>
        <img src="/logo.png" alt="EduConnect" className="logo" />
        <h1 style={{ fontSize: '52px', fontWeight: '800', margin: 0 }}>EduConnect</h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginTop: '5px' }}>
          Plataforma Educacional
        </p>
      </div>

      <div className="container">
        <h1>{isLogin ? 'Login' : 'Cadastro'}</h1>

        {erroMensagem && <div className="erro">{erroMensagem}</div>}
        {sucessoMensagem && <div className="sucesso">{sucessoMensagem}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Nome"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          )}

          <input
            type="email"
            placeholder="E-mail"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Senha"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          {!isLogin && (
            <select value={perfil} onChange={(e) => setPerfil(e.target.value)}>
              <option value="Aluno">Aluno</option>
              <option value="Professor">Professor</option>
            </select>
          )}

          <button type="submit">
            {isLogin ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>

        <button className="cadastro" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Cadastre-se' : 'Faça Login'}
        </button>
      </div>
    </div>
  );
}

export default App;