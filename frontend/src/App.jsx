import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function PainelPrincipal({ usuario }) {
  const handleLogout = () => window.location.reload();

  return (
    <div className="wrapper">
      <div className="container" style={{ textAlign: 'center' }}>
        <h1 style={{ marginBottom: '10px' }}>Bem-vindo, {usuario.nome}!</h1>
        <p style={{ color: '#94a3b8', marginBottom: '30px' }}>
          Você está logado como: <strong>{usuario.perfil}</strong>
        </p>
        
        {/* Renderiza o botão de Professor */}
        {usuario.perfil === 'Professor' && (
          <button className="btn-acao" style={{ marginBottom: '10px' }}>
            Lançar Notas
          </button>
        )}

        {/* Renderiza o botão de Aluno conforme exigido pelo requisito */}
        {usuario.perfil === 'Aluno' && (
          <button className="btn-acao" style={{ marginBottom: '10px' }}>
            Acessar Minhas Aulas
          </button>
        )}

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
  const [verSenha, setVerSenha] = useState(false);
  const [perfil, setPerfil] = useState('Aluno');
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [erroMensagem, setErroMensagem] = useState('');
  const [sucessoMensagem, setSucessoMensagem] = useState('');

  useEffect(() => {
    if (sucessoMensagem || erroMensagem) {
      const timer = setTimeout(() => {
        setSucessoMensagem('');
        setErroMensagem('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [sucessoMensagem, erroMensagem]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErroMensagem('');
    setSucessoMensagem('');

    try {
      const rota = isLogin ? '/login' : '/cadastro';
      const resposta = await axios.post(`http://localhost:3001${rota}`, {
        nome, email, senha, perfil,
      });

      if (isLogin) {
        setUsuarioLogado(resposta.data.usuario);
      } else {
        setSucessoMensagem('Cadastro realizado com sucesso!');
        setIsLogin(true);
        setNome(''); setEmail(''); setSenha('');
      }
    } catch (erro) {
      setErroMensagem(erro.response?.data?.mensagem || 'Erro ao conectar com o servidor.');
    }
  };

  if (usuarioLogado) return <PainelPrincipal usuario={usuarioLogado} />;

  return (
    <div className="wrapper">
      <div style={{ textAlign: 'center', color: '#fff' }}>
        <img src="/logo.png" alt="EduConnect" className="logo" />
        <h1 style={{ fontSize: '52px', fontWeight: '800', margin: 0 }}>EduConnect</h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginTop: '5px' }}>Plataforma Educacional</p>
      </div>

      <div className="container">
        <h1>{isLogin ? 'Login' : 'Cadastro'}</h1>

        {erroMensagem && <div className="erro">{erroMensagem}</div>}
        {sucessoMensagem && <div className="sucesso">{sucessoMensagem}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group">
              <label>Nome Completo</label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input type="text" placeholder="Digite seu nome" required value={nome} onChange={(e) => setNome(e.target.value)} />
              </div>
            </div>
          )}

          <div className="input-group">
            <label>E-mail</label>
            <div className="input-wrapper">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <input type="email" placeholder="Digite seu e-mail" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>

          <div className="input-group">
            <label>Senha</label>
            <div className="senha-wrapper">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <input 
                type={verSenha ? 'text' : 'password'} 
                placeholder={isLogin ? "Sua senha" : "Crie uma senha"} 
                required 
                value={senha} 
                onChange={(e) => setSenha(e.target.value)} 
              />
              <button type="button" className="senha-toggle" onClick={() => setVerSenha(!verSenha)}>
                {verSenha ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                )}
              </button>
            </div>
          </div>

          <div className="input-group">
            <label>Perfil de Acesso</label>
            {isLogin ? (
              <div className="perfil-selector">
                <button type="button" className={`segment-btn ${perfil === 'Aluno' ? 'active' : ''}`} onClick={() => setPerfil('Aluno')}>Aluno</button>
                <button type="button" className={`segment-btn ${perfil === 'Professor' ? 'active' : ''}`} onClick={() => setPerfil('Professor')}>Professor</button>
              </div>
            ) : (
              <div className="input-wrapper">
                <select value={perfil} onChange={(e) => setPerfil(e.target.value)} className="select-perfil" required>
                  <option value="Aluno">Aluno</option>
                  <option value="Professor">Professor</option>
                </select>
              </div>
            )}
          </div>

          <button type="submit">{isLogin ? 'Entrar' : 'Cadastrar'}</button>
        </form>

        <p className="auth-link" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Não tem uma conta? ' : 'Já tem uma conta? '}
          <span>{isLogin ? 'Cadastre-se' : 'Faça Login'}</span>
        </p>
      </div>
    </div>
  );
}

export default App;