## INFORMAÇÕES DO PROJETO
### O projeto é o SAEP do SENAI onde fazemos o gerenciamento de produtos 
## FERRAMENTAS UTILIZADAS
- __BACKEND__: Python, Djando RESTFRAME WORK
- __BANCO DE DADOS__: MySQL
- __FRONTEND__: JavaScript, React e CSS
---
## COMO RODAR O PROJETO

### FRONTEND
- Abra o frontend no vscode;
- Abra o terminal;
- No terminal digite: __npm i__;
- Depois digite: __npm run dev__;
- Abra o link de localhost;

### BACKEND
- Abra o backend no vscode;
- Vá no arquivo settings e mude a senha do workbench (caso a senha não seja a mesma que a sua);
- Abra o terminal;
- No terminal digite: __python -m venv env__;
- Depois digite: __.\env\Scripts\activate__;
- Após isso, digite: __pip install -r requirements.txt__;
- Vá no workbench rode os comandos:
-   __CREATE DATABASE IF NOT EXISTS saep_db;__
-   __USE saep_db;__
- No terminal do vscode digite: __python manage.py makemigrations__;
- Após isso, digite: __python manage.py migrate__;
- Abra o arquivo de banco no WorkBench e crie as tabelas;
- Volte para o projeto e digite: __python manage.py runserver__;

__Com o backend rodando, abra o link do frontend e use o projeto__
