# E-vote

Este projeto é o backend da aplicação e-vote, que gerencia as eleições do DECSI. Ele faz parte do trabalho final da disciplina de Sistemas Web 1.


## Instalação e inicialização

Clone o projeto disponibilizado no github

```Typescript
  $ git clone https://github.com/mateussr7/e_vote_backend.git
```

Após isso, você deve rodar o comando que irá instalar todas as dependências do projeto

```Typescript
  $ npm install
```

O banco de dados do projeto será do tipo SQLite, que ja foi instalado anteriormente junto com as dependências. Para que possa utilizar a API, é necessário criar uma migration e um Prisma Client:

```Typescript
  $ npx prisma migrate dev --name init
```


```Typescript
  $ npx prisma generate
```

Após ter instalado todas as dependências e gerado as migrations e o prisma client, você está pronto para fazer deploy do servidor localmente.
A porta escolhida foi a `8080`.

Use esse comando para ativar o servidor, que iniciará um listener definido no arquivo src/index.ts do nosso servidor.

```Typescript
  $ npx ts-node-dev src/server.ts
```

Se estiver tudo certo, você deverá ver a seguinte mensagem no terminal:

```Typescript
  [SERVER] Servidor rodando na porta 8080
```
