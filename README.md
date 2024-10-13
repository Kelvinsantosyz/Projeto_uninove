Claro! Aqui está a versão atualizada do `README.md`, incluindo explicações sobre a configuração da sessão e a conexão com o banco de dados MySQL:

```markdown
# Projeto OneLife Advogados

Este projeto é uma aplicação web para a OneLife Advogados, focada em maximizar a captação de clientes e divulgar os serviços oferecidos. O site inclui funcionalidades para facilitar a interação com clientes, como formulários de contato e agendamento de consultas.

## Colaboradores

- **Kelvin Felipe dos Santos** - R.A: 923200158
- **Miguel Benites de Almeida** - R.A: 923209649
- **Thiago Rocha Santana** - R.A: 923204332

## Funcionalidades

- Registro e login de usuários (advogados e clientes).
- Envio e gerenciamento de chamados.
- Marcação de status dos chamados por advogados.
- Visualização de informações do usuário logado.
- Interface responsiva e atraente.

## Tecnologias Utilizadas

- **Frontend**: HTML, CSS, JavaScript, Bootstrap
- **Backend**: Node.js, Express
- **Banco de Dados**: MySQL
- **Autenticação**: bcrypt, express-session

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

Para instalar as dependências do projeto e executar o servidor Node.js, siga os passos abaixo:

1. Clone o repositório:

   ```bash
   gh repo clone Kelvinsantosyz/Projeto
   cd Projeto
   ```

2. Instale as dependências do projeto:

   ```bash
   npm install
   ```

3. Inicie o servidor:

   ```bash
   node server.js
   ```

4. Acesse a aplicação em seu navegador em `http://localhost:3000`.

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

Antes de iniciar o projeto, você deve garantir que o seu servidor MySQL esteja configurado corretamente. As credenciais de conexão estão definidas no código do servidor. Modifique as opções abaixo conforme necessário:

```javascript
const dbOptions = {
    host: 'localhost',
    user: 'root',
    password: '30561414', // Altere para sua senha do MySQL
    database: 'cadastro_db' // O nome do banco de dados que você criou
};
```

## Configuração da Sessão

Para gerenciar sessões de usuário, a seguinte configuração é utilizada:

```javascript
app.use(session({
    secret: '0488', // Segredo utilizado para assinar o cookie da sessão
    resave: false, // Não re-salvar a sessão se não houver alterações
    saveUninitialized: false, // Não salvar sessões não inicializadas
    cookie: { secure: false } // Para produção, considere definir como true e usar HTTPS
}));
```

- **secret**: Um valor que é utilizado para assinar a sessão. Este valor deve ser mantido em segredo.
- **resave**: Se `false`, a sessão só será re-salva no armazenamento se houve alguma modificação. 
- **saveUninitialized**: Se `false`, não armazena sessões não inicializadas no armazenamento.
- **cookie.secure**: Se `true`, o cookie só será enviado em conexões HTTPS. Em ambiente de desenvolvimento, você pode definir como `false`, mas em produção, é recomendado usar HTTPS.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma *issue* ou enviar um *pull request*.

## Licença

Este projeto é licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.
```

### Alterações
- Adicionadas seções para **Configuração do Servidor MySQL** e **Configuração da Sessão**, explicando como configurar o servidor MySQL e o middleware de sessão no Express.

Se precisar de mais ajustes ou informações adicionais, é só avisar!
