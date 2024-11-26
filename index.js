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
var listaaluno = [];

function cadastroaluno(req, resp) {
    resp.send(`
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Formulário de Matrícula</title>
            <style>
                body {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background-color: #f8f9fa;
                    margin: 0;
                    font-family: Arial, sans-serif;
                }
                .form-container {
                    width: 500px;
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 8px;
                    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
                }
                h2 {
                    text-align: center;
                    color: #333;
                }
                label {
                    display: block;
                    margin-top: 10px;
                    font-weight: bold;
                }
                input, select, textarea {
                    width: 100%;
                    padding: 10px;
                    margin-top: 5px;
                    margin-bottom: 10px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                }
                button {
                    width: 100%;
                    padding: 10px;
                    background-color: #007bff;
                    color: #fff;
                    border: none;
                    border-radius: 4px;
                    font-size: 16px;
                    cursor: pointer;
                }
                button:hover {
                    background-color: #0056b3;
                }
            </style>
        </head>
        <body>
            <div class="form-container">
                <h2>Formulário de Matrícula</h2>
                <form action="/cadastros" method="POST">
                    <label for="nome">Nome Completo:</label>
                    <input type="text" id="nome" name="nome" placeholder="Digite seu nome" >

                    <label for="data">Data de Nascimento:</label>
                    <input type="date" id="data" name="data" >

                    <label for="genero">Gênero:</label>
                    <select id="genero" name="genero" >
                        <option value="Masculino">Masculino</option>
                        <option value="Feminino">Feminino</option>
                        <option value="Outro">Outro</option>
                    </select>

                    <label for="endereco">Endereço:</label>
                    <input type="text" id="endereco" name="endereco" >

                    <label for="telefone">Telefone:</label>
                    <input type="tel" id="telefone" name="telefone" >

                    <label for="rg">RG:</label>
                    <input type="text" id="rg" name="rg" >

                    <label for="cpf">CPF:</label>
                    <input type="text" id="cpf" name="cpf" >

                    <label for="Adicionais">Informações Adicionais:</label>
                    <textarea id="aadicionais" name="aadicionais"></textarea>

                    <label for="nomePai">Nome do Pai:</label>
                    <input type="text" id="nomePai" name="nomePai" >

                    <label for="nomeMae">Nome da Mãe:</label>
                    <input type="text" id="nomeMae" name="nomeMae" >

                    <button type="submit">Cadastrar</button>
                </form>
            </div>
        </body>
        </html>
    `);
}


function cadastrar(req, resp) {
    const dataHoraUltimoAcesso = req.cookies['dataHoraUltimoAcesso'];
    if(!dataHoraUltimoAcesso){
        dataHoraUltimoAcesso = '';
    }
    
    const nome = req.body.nome;
    const data = req.body.data;
    const genero = req.body.genero;
    const endereco = req.body.endereco;
    const telefone = req.body.telefone;
    const rg = req.body.rg;
    const cpf = req.body.cpf;
    const Adicionais = req.body.aadicionais;
    const nomePai = req.body.nomePai;
    const nomeMae = req.body.nomeMae;


    const aluno = {
        nome,
        data,
        genero,
        endereco,
        telefone,
        rg,
        cpf,
        Adicionais,
        nomePai,
        nomeMae
    };

    if(nome && data && genero && endereco && telefone && rg && cpf && Adicionais && nomePai && nomeMae){  


        listaaluno.push(aluno); 

        resp.write(`
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Lista de Alunos</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f8f9fa;
                        margin: 20px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        flex-direction: column;
                    }
                    table {
                        width: 80%;
                        border-collapse: collapse;
                        margin-top: 20px;
                        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    }
                    th, td {
                        border: 1px solid #dee2e6;
                        padding: 12px;
                        text-align: left;
                    }
                    th {
                        background-color: #007bff;
                        color: white;
                    }
                    tr:nth-child(even) {
                        background-color: #f2f2f2;
                    }
                    tr:hover {
                        background-color: #e0e7ff;
                    }
                </style>
            </head>
            <body>
                <h2>Lista de Alunos</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Data de Nascimento</th>
                            <th>Gênero</th>
                            <th>Endereço</th>
                            <th>Telefone</th>
                            <th>RG</th>
                            <th>CPF</th>
                            <th>Informações Adicionais</th>
                            <th>Nome do Pai</th>
                            <th>Nome da Mãe</th>
                        </tr>
                    </thead>
                    <tbody>
        `);

        for(var i= 0; i<listaaluno.length; i++){
            resp.write(`
                <tr>
                    <td>${aluno.nome}</td>
                    <td>${aluno.data}</td>
                    <td>${aluno.genero}</td>
                    <td>${aluno.endereco}</td>
                    <td>${aluno.telefone}</td>
                    <td>${aluno.rg}</td>
                    <td>${aluno.cpf}</td>
                    <td>${aluno.Adicionais || "N/A"}</td>
                    <td>${aluno.nomePai}</td>
                    <td>${aluno.nomeMae}</td>
                </tr>
            `);
        };

        resp.write(`
                    </tbody>
                </table>
                <br>
                <a href="/" style="text-decoration: none; padding: 10px 20px; background-color: #007bff; color: #fff; border-radius: 4px;">Menu</a>
            </body>
            </html>
        `);
    }else{
            resp.write(`
                
            <html lang="pt-BR">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Formulário de Matrícula</title>
                    <style>
                            body {
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                height: 100vh;
                                background-color: #f8f9fa;
                                margin: 0;
                                font-family: Arial, sans-serif;
                            }
                            .form-container {
                                width: 500px;
                                padding: 20px;
                                background-color: #fff;
                                border-radius: 8px;
                                box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
                            }
                            h2 {
                                text-align: center;
                                color: #333;
                            }
                            label {
                                display: block;
                                margin-top: 10px;
                                font-weight: bold;
                            }
                            input, select, textarea {
                                width: 100%;
                                padding: 10px;
                                margin-top: 5px;
                                margin-bottom: 10px;
                                border: 1px solid #ccc;
                                border-radius: 4px;
                            }
                            button {
                                width: 100%;
                                padding: 10px;
                                background-color: #007bff;
                                color: #fff;
                                border: none;
                                border-radius: 4px;
                                font-size: 16px;
                                cursor: pointer;
                            }
                            button:hover {
                                background-color: #0056b3;
                            }
                            .error-message {
                                color: #d9534f; /* Vermelho */
                                font-size: 14px;
                                font-weight: bold;
                                margin-top: -5px;
                                margin-bottom: 10px;
                                display: block;
                            }
                    </style>
                </head>
                <body>
                <div class="form-container">
                    <h2>Formulário de Matrícula</h2>
                    <form action="/cadastros" method="POST">
                        <label for="nome">Nome Completo:</label>
                        <input type="text" id="nome" name="nome" placeholder="Digite seu nome" value ="${nome}">
                        
            `);
            if (!nome) {
                resp.write(`
                    <div>
                        <span class="error-message">Informe o nome do aluno</span>
                    </div>
                `);
            }
            resp.write(`
                <label for="data">Data de Nascimento:</label>
                <input type="date" id="data" name="data" value="${data}">
            `);
            if (!data) {
                resp.write(`
                    <div>
                        <span class="error-message">Informe a data de nascimento</span>
                    </div>
                `);
            }
            resp.write(`
                <label for="genero">Gênero:</label>
                <select id="genero" name="genero">
                    <option value="Masculino" ${genero === 'Masculino' ? 'selected' : ''}>Masculino</option>
                    <option value="Feminino" ${genero === 'Feminino' ? 'selected' : ''}>Feminino</option>
                    <option value="Outro" ${genero === 'Outro' ? 'selected' : ''}>Outro</option>
                </select>
            `);
            if (!genero) {
                resp.write(`
                    <div>
                        <span class="error-message">Informe o gênero</span>
                    </div>
                `);
            }
            resp.write(`
                <label for="endereco">Endereço:</label>
                <input type="text" id="endereco" name="endereco" value="${endereco}">
            `);
            if (!endereco) {
                resp.write(`
                    <div>
                        <span class="error-message">Informe o endereço</span>
                    </div>
                `);
            }
            resp.write(`
                <label for="telefone">Telefone:</label>
                <input type="tel" id="telefone" name="telefone" value="${telefone}">
            `);
            if (!telefone) {
                resp.write(`
                    <div>
                        <span class="error-message">Informe o telefone</span>
                    </div>
                `);
            }
            resp.write(`
                <label for="rg">RG:</label>
                <input type="text" id="rg" name="rg" value="${rg}">
            `);
            if (!rg) {
                resp.write(`
                    <div>
                        <span class="error-message">Informe o RG</span>
                    </div>
                `);
            }
            resp.write(`
                <label for="cpf">CPF:</label>
                <input type="text" id="cpf" name="cpf" value="${cpf}">
            `);
            if (!cpf) {
                resp.write(`
                    <div>
                        <span class="error-message">Informe o CPF</span>
                    </div>
                `);
            }
            resp.write(`
                <label for="Adicionais">Informações Adicionais:</label>
                <textarea id="aadicionais" name="aadicionais">${Adicionais}</textarea>
            `);
            if (!Adicionais) {
                resp.write(`
                    <div>
                        <span class="error-message">Informe as informações adicionais</span>
                    </div>
                `);
            }
            resp.write(`
                <label for="nomePai">Nome do Pai:</label>
                <input type="text" id="nomePai" name="nomePai" value="${nomePai}">
            `);
            if (!nomePai) {
                resp.write(`
                    <div>
                        <span class="error-message">Informe o nome do pai</span>
                    </div>
                `);
            }
            resp.write(`
                <label for="nomeMae">Nome da Mãe:</label>
                <input type="text" id="nomeMae" name="nomeMae" value="${nomeMae}">
            `);
            if (!nomeMae) {
                resp.write(`
                    <div>
                        <span class="error-message">Informe o nome da mãe</span>
                    </div>
                `);
            }

            
            resp.write(`
                <button type="submit">Cadastrar</button>
                <div>
                     <li class="nav-item">
                        <a class="nav-link disabled" aria-disabled="true"> seu ultimo acesso foi realizado em ${dataHoraUltimoAcesso} </a>
                     </li>
                 </div>
            `);
            resp.write(`

                </form>
            `);
             resp.end();
        }
}

function menu(req, resp){
    const dataHoraUltimoAcesso = req.cookies['dataHoraUltimoAcesso'];
    if(!dataHoraUltimoAcesso){
        dataHoraUltimoAcesso = '';
    }
    resp.send(`

 <html lang="pt-BR">
    <head>
     <title>Menu</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    </head>
    <body>
        <nav class="navbar bg-body-tertiary">
            <div class="container-fluid">
                <a class="navbar-brand" href="/cadastraraluno">cadastrar aluno</a>
            </div>
        </nav>

        <nav class="navbar bg-body-tertiary">
            <div class="container-fluid">
                <a class="navbar-brand" href="/lista">Lista</a>
            </div>
            <div class="container-fluid">
                <a class="navbar-brand" href="/logout">Sair</a>
            </div>
            <div>
             <li class="nav-item">
                <a class="nav-link disabled" aria-disabled="true"> seu ultimo acesso foi realizado em ${dataHoraUltimoAcesso} </a>
             </li>
            </div>
        </nav>

    </body>
     <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
 </html>
        `);

}
function lista(req, resp) {
    resp.write(`
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Tabela de Alunos</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f8f9fa;
                    margin: 20px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                }

                table {
                    width: 60%;
                    border-collapse: collapse;
                    margin-top: 20px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }

                th, td {
                    border: 1px solid #dee2e6;
                    padding: 12px;
                    text-align: left;
                }

                th {
                    background-color: #007bff;
                    color: white;
                }

                tr:nth-child(even) {
                    background-color: #f2f2f2; 
                }

                tr:hover {
                    background-color: #e0e7ff; 
                }

                .link-botao {
                    display: inline-block;
                    padding: 12px 24px;
                    background-color: #007bff; 
                    color: white; 
                    text-decoration: none;
                    border-radius: 4px;
                    font-size: 16px;
                    font-weight: bold;
                    text-align: center;
                    transition: background-color 0.3s;
                    margin-top: 20px;
                }

                .link-botao:hover {
                    background-color: #0056b3; 
                }

            </style>
        </head>
        <body>
            <h2>Tabela de Alunos</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Data de Nascimento</th>
                        <th>Gênero</th>
                        <th>Endereço</th>
                        <th>Telefone</th>
                        <th>RG</th>
                        <th>CPF</th>
                        <th>Informações Adicionais</th>
                        <th>Nome do Pai</th>
                        <th>Nome da Mãe</th>
                    </tr>
                </thead>
                <tbody>
    `);
    listaaluno.forEach(aluno => {
        resp.write(`
            <tr>
                <td>${aluno.nome}</td>
                <td>${aluno.data}</td>
                <td>${aluno.genero}</td>
                <td>${aluno.endereco}</td>
                <td>${aluno.telefone}</td>
                <td>${aluno.rg}</td>
                <td>${aluno.cpf}</td>
                <td>${aluno.Adicionais || "N/A"}</td>
                <td>${aluno.nomePai}</td>
                <td>${aluno.nomeMae}</td>
            </tr>
        `);
    });

    resp.write(`
                </tbody>
            </table> 
            <a href="/" class="link-botao">Menu</a>
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
        resp.cookie('dataHoraUltimoAcesso',new Date().toLocaleString()),{maxAge: 1000 *60 *60 *24 *30,} ;
        resp.redirect('/');
    }else{
        resp.write(` <html lang="pt-BR">
                    <head>
                    <title>Menu</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
                    </head>
                    <body>
                        <div class="alert alert-dark" role="alert">
                        Usuario ou senha invalida!
                        </div>
                        <div>
                        <a href= "/login.html"  class="btn btn-outline-danger">tente novamente</a>
                        </div>  
                    </body>`);
    }
}
function autenticacao(req,resp,next){
    if(req.session.usuariologado){
        next(); 
    }else{
        resp.redirect('/login.html');
    }
}
app.get('/login',(req,resp)=>{
    resp.redirect('/login.html');
})

app.get('/logout',(req,resp)=>{
    req.session.destroy();
    resp.redirect('/login.html');
});

app.post('/login',autenticarus);

app.get('/',autenticacao,menu);
app.get('/cadastraraluno',autenticacao ,cadastroaluno);
app.post('/cadastros',autenticacao ,cadastrar);
app.get('/lista',autenticacao ,lista);

app.listen(porta, host, () => {
    console.log(`Servidor iniciado em http://${host}:${porta}`);
});
