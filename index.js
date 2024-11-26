
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import path from 'path';

const app = express();
app.use(express.urlencoded({ extended: true }));
const porta = 3000;
const host = '0.0.0.0';

app.use(express.static(path.join(process.cwd(),'./pages/public')));
app.use(express.static('./pages/public'));
app.use(session({
    secret: 'MinhaChave3232c',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure:false,
        httpOnly:true,
        maxAge:1000 * 60 * 30
    }
}));

app.use(cookieParser());
var listaprodutos = [];

function cadastroproduto(req, resp) {
    const ultimoAcesso = req.cookies['dataHoraUltimoAcesso'] || 'Primeiro acesso';
    resp.send(`
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <title>Cadastro de Produtos</title>
            <style>
                body { font-family: Arial, sans-serif; background: #f8f9fa; }
                .form-container { margin: 50px auto; width: 50%; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); }
                label, input, button { display: block; width: 100%; margin-bottom: 10px; }
                button { background: #007bff; color: #fff; padding: 10px; border: none; border-radius: 5px; }
                button:hover { background: #0056b3; }
            </style>
        </head>
        <body>
            <div class="form-container">
                <h2>Cadastro de Produtos</h2>
                <p>Seu último acesso foi em: <strong>${ultimoAcesso}</strong></p>
                <form action="/cadastroproduto" method="POST">
                    <label for="codigo">Código de Barras:</label>
                    <input type="text" id="codigo" name="codigo" required>
                    
                    <label for="descricao">Descrição do Produto:</label>
                    <input type="text" id="descricao" name="descricao" required>
                    
                    <label for="precoCusto">Preço de Custo:</label>
                    <input type="number" step="0.01" id="precoCusto" name="precoCusto" required>
                    
                    <label for="precoVenda">Preço de Venda:</label>
                    <input type="number" step="0.01" id="precoVenda" name="precoVenda" required>
                    
                    <label for="validade">Data de Validade:</label>
                    <input type="date" id="validade" name="validade" required>
                    
                    <label for="estoque">Quantidade em Estoque:</label>
                    <input type="number" id="estoque" name="estoque" required>
                    
                    <label for="fabricante">Nome do Fabricante:</label>
                    <input type="text" id="fabricante" name="fabricante" required>
                    
                    <button type="submit">Cadastrar Produto</button>
                </form>
            </div>
        </body>
        </html>
    `);
}

function cadastrarproduto(req, resp) {
    const { codigo, descricao, precoCusto, precoVenda, validade, estoque, fabricante } = req.body;

    if (!codigo || !descricao || !precoCusto || !precoVenda || !validade || !estoque || !fabricante) {
        return resp.send("Todos os campos são obrigatórios!");
    }

    listaprodutos.push({ codigo, descricao, precoCusto, precoVenda, validade, estoque, fabricante });
    lista(req, resp);
}

function lista(req, resp) {
    const ultimoAcesso = req.cookies['dataHoraUltimoAcesso'] || 'Primeiro acesso';
    resp.write(`
        <html lang="pt-BR">
        <head>
            <title>Lista de Produtos</title>
            <style>
                table { width: 100%; border-collapse: collapse; margin: 20px auto; }
                th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                th { background: #007bff; color: #fff; }
                tr:nth-child(even) { background: #f2f2f2; }
            </style>
        </head>
        <body>
            <h2>Produtos Cadastrados</h2>
            <p>Seu último acesso foi em: <strong>${ultimoAcesso}</strong></p>
            <table>
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Descrição</th>
                        <th>Preço de Custo</th>
                        <th>Preço de Venda</th>
                        <th>Validade</th>
                        <th>Estoque</th>
                        <th>Fabricante</th>
                    </tr>
                </thead>
                <tbody>
    `);

    listaprodutos.forEach(produto => {
        resp.write(`
            <tr>
                <td>${produto.codigo}</td>
                <td>${produto.descricao}</td>
                <td>${produto.precoCusto}</td>
                <td>${produto.precoVenda}</td>
                <td>${produto.validade}</td>
                <td>${produto.estoque}</td>
                <td>${produto.fabricante}</td>
            </tr>
        `);
    });

    resp.write(`
                </tbody>
            </table>
        </body>
        </html>
    `);

    resp.end();
}

function autenticarus(req , resp){
    const usuario = req.body.usuario;
    const senha = req.body.senha;

    if(usuario === 'admin' && senha === '123'){
        req.session.usuariologado = true;
        resp.cookie('dataHoraUltimoAcesso', new Date().toLocaleString(), { maxAge: 1000 * 60 * 60 * 24 * 30 });
        resp.redirect('/');
    }else{
        resp.send('<h3>Usuário ou senha inválidos!</h3><a href="/login">Tentar novamente</a>');
    }
}

function autenticacao(req, resp, next) {
    if(req.session.usuariologado){
        next();
    } else {
        resp.redirect('/login');
    }
}

app.get('/login', (req, resp) => {
    resp.send('<form method="POST" action="/login"><input name="usuario"/><input type="password" name="senha"/><button>Entrar</button></form>');
});

app.post('/login', autenticarus);

app.get('/', autenticacao, (req, resp) => {
    const ultimoAcesso = req.cookies['dataHoraUltimoAcesso'] || 'Primeiro acesso';
    resp.send(`
        <html lang="pt-BR">
        <head><title>Menu</title></head>
        <body>
            <h1>Bem-vindo!</h1>
            <p>Seu último acesso foi em: <strong>${ultimoAcesso}</strong></p>
            <a href="/cadastrarproduto">Cadastrar Produto</a><br>
            <a href="/lista">Ver Produtos</a><br>
            <a href="/logout">Sair</a>
        </body>
        </html>
    `);
});

app.get('/cadastrarproduto', autenticacao, cadastroproduto);
app.post('/cadastroproduto', autenticacao, cadastrarproduto);
app.get('/lista', autenticacao, lista);

app.get('/logout', (req, resp) => {
    req.session.destroy();
    resp.redirect('/login');
});

app.listen(porta, host, () => {
    console.log(`Servidor iniciado em http://${host}:${porta}`);
});
