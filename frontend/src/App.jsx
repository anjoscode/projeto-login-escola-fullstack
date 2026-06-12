import { useState } from 'react';
import axios from 'axios';
import './App.css';

// 1. Componente Painel Principal
function PainelPrincipal({ usuario }) {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Bem-vindo, {usuario.nome}!</h1>
      <p>Você está logado como: {usuario.perfil}</p>
      {usuario.perfil === 'Professor' ? (
        <button>Lançar Notas</button>
      ) : (
        <button>Acessar Minhas Aulas</button>
      )}
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
  const [erroMensagem, setErroMensagem] = useState(''); // Novo state para o erro

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErroMensagem(''); // Limpa o erro ao tentar novamente
    const rota = isLogin ? '/login' : '/cadastro';

    try {
      const resposta = await axios.post(`http://localhost:3001${rota}`, {
        nome, email, senha, perfil
      });
      
      if (isLogin) {
        setUsuarioLogado(resposta.data.usuario);
      } else {
        alert("Cadastro realizado com sucesso!");
        setIsLogin(true);
      }
    } catch (erro) {
      // Substituído o alert pela atualização do state
      setErroMensagem(erro.response?.data?.mensagem || 'Erro ao conectar com o servidor.');
    }
  };

  if (usuarioLogado) return <PainelPrincipal usuario={usuarioLogado} />;

  return (
    <div className="container" style={{ padding: '20px', maxWidth: '300px', margin: 'auto' }}>
      <h1>{isLogin ? 'Login' : 'Cadastro'}</h1>
      
      {/* Exibição da mensagem de erro clara */}
      {erroMensagem && <div className="erro">{erroMensagem}</div>}
      
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input type="text" placeholder="Nome" required onChange={(e) => setNome(e.target.value)} style={{ display: 'block', width: '100%', marginBottom: '10px' }} />
        )}
        <input type="email" placeholder="E-mail" required onChange={(e) => setEmail(e.target.value)} style={{ display: 'block', width: '100%', marginBottom: '10px' }} />
        <input type="password" placeholder="Senha" required onChange={(e) => setSenha(e.target.value)} style={{ display: 'block', width: '100%', marginBottom: '10px' }} />
        
        {!isLogin && (
          <select onChange={(e) => setPerfil(e.target.value)} style={{ width: '100%', marginBottom: '10px' }}>
            <option value="Aluno">Aluno</option>
            <option value="Professor">Professor</option>
          </select>
        )}

        <button type="submit" style={{ width: '100%' }}>{isLogin ? 'Entrar' : 'Cadastrar'}</button>
      </form>

      <p style={{ textAlign: 'center' }}>
        <button onClick={() => setIsLogin(!isLogin)}>{isLogin ? 'Cadastre-se' : 'Faça Login'}</button>
      </p>
    </div>
  );
}

export default App;