# Projeto OneLife Advogados

Este projeto é uma aplicação web desenvolvida para a **OneLife Advogados**, com o objetivo de maximizar a captação de clientes e divulgar os serviços oferecidos pelo escritório. A plataforma oferece funcionalidades para facilitar a interação com clientes, como formulários de contato, agendamento de consultas e gerenciamento de chamados.

## Colaboradores

- Kelvin Felipe dos Santos - R.A: 923200158
- Miguel Benites de Almeida - R.A: 923209649
- Thiago Rocha Santana - R.A: 923204332

## Funcionalidades

- Registro e login de usuários (advogados e clientes).
- Envio e gerenciamento de chamados.
- Marcação de status dos chamados por advogados.
- Visualização de informações do usuário logado.
- Interface responsiva e atraente.

## Tecnologias Utilizadas

- **Frontend**: HTML, CSS, JavaScript, Bootstrap.
- **Backend**: Node.js, Express.
- **Banco de Dados**: MySQL.
- **Autenticação e Segurança**: bcrypt, express-session.

## Estrutura do Banco de Dados

### Tabelas Criadas

```sql
-- Criação da tabela "chamados"
CREATE TABLE chamados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    sobrenome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(255) NOT NULL,
    ramo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    status VARCHAR(255) DEFAULT 'Aberto',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criação da tabela "sessions"
CREATE TABLE sessions (
    session_id VARCHAR(128) PRIMARY KEY,
    expires INT UNSIGNED NOT NULL,
    data MEDIUMTEXT NOT NULL
);

-- Criação da tabela "usuarios"
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    sobrenome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL
);
```

## Instalação

### Passo 1: Clonando o Repositório

Clone o repositório para sua máquina local:

```bash
gh repo clone Kelvinsantosyz/Projeto_uninove
cd Projeto
```

### Passo 2: Instalando as Dependências

Instale as dependências do projeto a partir do `package.json`:

```bash
npm install bcrypt bcryptjs body-parser bootbox bootstrap cors csurf express express-session express-validator mysql2
```

Ou, se você já tem um arquivo `package.json` com as dependências listadas, use o comando:

```bash
npm install
```

### Passo 3: Iniciando o Servidor

Inicie o servidor Node.js:

```bash
node server.js
```

Agora, você pode acessar a aplicação em seu navegador em [http://localhost:3000/site.html](http://localhost:3000/site.html).

## Dependências

As seguintes dependências são necessárias para o funcionamento do projeto:

```json
{
  "dependencies": {
    "bcrypt": "^5.1.1",
    "bcryptjs": "^2.4.3",
    "body-parser": "^1.20.2",
    "bootbox": "^6.0.0",
    "bootstrap": "^5.3.3",
    "cors": "^2.8.5",
    "csurf": "^1.11.0",
    "express": "^4.19.2",
    "express-session": "^1.18.0",
    "express-validator": "^7.2.0",
    "mysql2": "^3.11.0"
  }
}
```

## Configuração do Servidor MySQL

Antes de iniciar o projeto, garanta que o seu servidor MySQL esteja configurado corretamente. As credenciais de conexão estão definidas no código do servidor. Modifique as opções abaixo conforme necessário:

```javascript
const dbOptions = {
    host: 'localhost',
    user: 'root',
    password: 'sua-senha', // Altere para sua senha do MySQL
    database: 'cadastro_db' // Nome do banco de dados a ser utilizado
};
```

## Configuração da Sessão

A aplicação utiliza o pacote **express-session** para gerenciar sessões de usuário. Abaixo está a configuração padrão utilizada para sessões:

```javascript
app.use(session({
    secret: '0488', // Segredo utilizado para assinar o cookie da sessão
    resave: false,   // Não re-salvar a sessão se não houver alterações
    saveUninitialized: false, // Não salvar sessões não inicializadas
    cookie: { secure: false } // Para produção, defina como true e utilize HTTPS
}));
```

### Explicação das Opções de Sessão

- **secret**: Valor utilizado para assinar a sessão. Deve ser mantido em segredo.
- **resave**: Se `false`, a sessão só será re-salva se houver alterações.
- **saveUninitialized**: Se `false`, não armazena sessões não inicializadas no armazenamento.
- **cookie.secure**: Se `true`, o cookie só será enviado em conexões HTTPS. Em ambiente de desenvolvimento, pode ser definido como `false`.

## Contribuição

Contribuições são bem-vindas! Caso você tenha sugestões de melhorias ou queira corrigir algum erro, sinta-se à vontade para abrir uma **issue** ou enviar um **pull request**.

### Como Contribuir

1. Faça um fork deste repositório.
2. Crie uma branch para a sua alteração (`git checkout -b minha-alteracao`).
3. Faça o commit das suas alterações (`git commit -am 'Adicionando nova funcionalidade'`).
4. Envie para o repositório remoto (`git push origin minha-alteracao`).
5. Crie uma nova pull request.

## Licença

Este projeto é licenciado sob a [MIT License](LICENSE).

---

Agradecemos pela sua visita ao nosso projeto! 🎉
```

