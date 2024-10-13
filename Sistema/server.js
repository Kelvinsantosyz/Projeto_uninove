const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const path = require('path');
const { body, validationResult } = require('express-validator');
const session = require('express-session');
const mysql = require('mysql2/promise');

const app = express();
const saltRounds = 10;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Configuração da sessão
app.use(session({
    secret: '0488',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Para produção, considere definir como true e usar HTTPS
}));

// Servir arquivos estáticos a partir do diretório atual
app.use(express.static(path.join(__dirname)));
// Servir arquivos da pasta Sistema/imagens
app.use('/imagens', express.static(path.join(__dirname, 'Sistema', 'imagens')));


// Configuração da conexão com o banco de dados MySQL
const dbOptions = {
    host: 'localhost',
    user: 'root',
    password: '30561414',
    database: 'cadastro_db'
};

let pool;

(async () => {
    try {
        pool = mysql.createPool(dbOptions);
        console.log('Conectado ao banco de dados MySQL!');
    } catch (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        process.exit(1);
    }
})();

// Middleware para verificar autenticação
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    } else {
        res.status(403).json({ success: false, message: 'Acesso negado. Faça login para continuar.' });
    }
}

// Rota para obter informações do usuário logado
app.get('/user-info', (req, res) => {
    if (req.session.userId) {
        const userId = req.session.userId;
        pool.getConnection()
            .then(connection => {
                return connection.query('SELECT Nome, Sobrenome FROM usuarios WHERE id = ?', [userId])
                    .then(([results]) => {
                        connection.release();
                        if (results.length > 0) {
                            res.json({ success: true, user: results[0] });
                        } else {
                            res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
                        }
                    })
                    .catch(err => {
                        connection.release();
                        console.error('Erro ao buscar informações do usuário:', err);
                        res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
                    });
            })
            .catch(err => {
                console.error('Erro ao conectar ao banco de dados:', err);
                res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
            });
    } else {
        res.status(401).json({ success: false, message: 'Não autorizado.' });
    }
});

// Rota para acessar a página de chamados (deve estar protegida)
app.get('/chamados.html', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'chamados.html'));
});

// Middleware para redirecionar usuários autenticados
function redirectIfAuthenticated(req, res, next) {
    if (req.session.userId) {
        return res.redirect('/chamados.html');
    }
    next();
}

// Rotas
app.get('/index.html', redirectIfAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/Formulario.html', redirectIfAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'Formulario.html'));
});

app.post('/signin', [
    body('email').isEmail().withMessage('E-mail inválido.'),
    body('password').notEmpty().withMessage('Senha é obrigatória.')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        return res.status(400).json({ success: false, message: errorMessages.join(', ') });
    }

    const { email, password } = req.body;

    try {
        const connection = await pool.getConnection();
        const [results] = await connection.query('SELECT * FROM usuarios WHERE email = ?', [email]);

        if (results.length === 0) {
            connection.release();
            return res.status(401).json({ success: false, message: 'E-mail não cadastrado.' });
        }

        const user = results[0];

        bcrypt.compare(password, user.senha, (err, result) => {
            if (err) {
                console.error('Erro ao comparar senha:', err);
                return res.status(500).json({ success: false, message: 'Erro ao realizar login.' });
            }

            if (result) {
                req.session.userId = user.id;
                req.session.email = user.email;
                req.session.nome = user.Nome;
                req.session.sobrenome = user.Sobrenome;

                console.log('Sessão criada para o usuário:', req.session.userId);

                return res.status(200).json({ success: true, message: 'Login bem-sucedido!', redirectUrl: '/chamados.html' });
            } else {
                return res.status(401).json({ success: false, message: 'Senha inválida.' });
            }
        });
    } catch (err) {
        console.error('Erro ao consultar dados:', err);
        res.status(500).json({ success: false, message: 'Erro ao realizar login.' });
    }
});

app.post('/signup', [
    body('Nome').notEmpty().withMessage('Nome é obrigatório'),
    body('Sobrenome').notEmpty().withMessage('Sobrenome é obrigatório'),
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { Nome, Sobrenome, email, password } = req.body;

    try {
        const connection = await pool.getConnection();
        const [results] = await connection.query('SELECT * FROM usuarios WHERE email = ?', [email]);

        if (results.length > 0) {
            connection.release();
            return res.status(400).json({ success: false, message: 'Este e-mail já está registrado.' });
        }

        const hash = await bcrypt.hash(password, saltRounds);
        await connection.query('INSERT INTO usuarios (Nome, Sobrenome, email, senha) VALUES (?, ?, ?, ?)', [Nome, Sobrenome, email, hash]);
        connection.release();

        return res.status(200).json({ success: true, message: 'Usuário registrado com sucesso!' });
    } catch (err) {
        console.error('Erro ao registrar usuário:', err);
        res.status(500).json({ success: false, message: 'Erro ao registrar usuário.' });
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao realizar logout.' });
        }
        res.status(200).json({ success: true, message: 'Logout realizado com sucesso!' });
    });
});

app.post('/chamados', async (req, res) => {
    const { nome, sobrenome, email, telefone, ramo, descricao } = req.body;

    try {
        const connection = await pool.getConnection();
        await connection.query('INSERT INTO chamados (nome, sobrenome, email, telefone, ramo, descricao, status) VALUES (?, ?, ?, ?, ?, ?, ?)', [nome, sobrenome, email, telefone, ramo, descricao, 'Pendente']);
        connection.release();
        res.status(200).json({ success: true, message: 'Chamado enviado com sucesso!' });
    } catch (err) {
        console.error('Erro ao enviar chamado:', err);
        res.status(500).json({ success: false, message: 'Erro ao enviar chamado.' });
    }
});

app.get('/chamados', isAuthenticated, async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [results] = await connection.query('SELECT * FROM chamados');
        connection.release();
        res.status(200).json({ chamados: results });
    } catch (err) {
        console.error('Erro ao consultar chamados:', err);
        res.status(500).json({ success: false, message: 'Erro ao consultar chamados.' });
    }
});

app.post('/chamados/:id/status', isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const connection = await pool.getConnection();
        await connection.query('UPDATE chamados SET status = ? WHERE id = ?', [status, id]);
        connection.release();
        res.status(200).json({ success: true, message: 'Status do chamado atualizado com sucesso!' });
    } catch (err) {
        console.error('Erro ao atualizar status do chamado:', err);
        res.status(500).json({ success: false, message: 'Erro ao atualizar status do chamado.' });
    }
});

app.delete('/chamados/:id', isAuthenticated, async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await pool.getConnection();
        await connection.query('DELETE FROM chamados WHERE id = ?', [id]);
        connection.release();
        res.status(200).json({ success: true, message: 'Chamado excluído com sucesso!' });
    } catch (err) {
        console.error('Erro ao excluir chamado:', err);
        res.status(500).json({ success: false, message: 'Erro ao excluir chamado.' });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
