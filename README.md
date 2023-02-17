# Socket-react-redis

App de chat com persistência de sessão e mensagens. O backend já está preparado para balanceamento de carga.

## Tecnologias utilizados

- Vite;
- React + Typescript;
- Express + Typescript;
- Socket.io;
- Redis.

## Arquitetura

```
/socket-react-redis/
└── react-redis-front
|   ├── package.json
|   ├── pnpm-lock.json
|   ├── ...
|   └── src
|       ├── main.tsx
|       └── ...
└── react-redis-back
|   ├── package.json
|   ├── pnpm-lock.json
|   ├── ...
|   └── src
|       ├── cluster.ts
|       └── ...
├── redis.conf
└── README

```

## Executando o projeto

Execute o servidor do Redis `redis-server redis.conf` (levando em consideração que o seu terminal está no diretório raiz do projeto).

````
$ redis-server react-socket-redis/redis.conf

                _._
           _.-``__ ''-._
      _.-``    `.  `_.  ''-._           Redis 6.0.16 (00000000/0) 64 bit
  .-`` .-```.  ```\/    _.,_ ''-._
 (    '      ,       .-`  | `,    )     Running in cluster mode
 |`-._`-...-` __...-.``-._|'` _.-'|     Port: 7000
 |    `-._   `._    /     _.-'    |     PID: 32753
  `-._    `-._  `-./  _.-'    _.-'
 |`-._`-._    `-.__.-'    _.-'_.-'|
 |    `-._`-._        _.-'_.-'    |           http://redis.io
  `-._    `-._`-.__.-'_.-'    _.-'
 |`-._`-._    `-.__.-'    _.-'_.-'|
 |    `-._`-._        _.-'_.-'    |
  `-._    `-._`-.__.-'_.-'    _.-'
      `-._    `-.__.-'    _.-'
          `-._        _.-'
              `-.__.-'
32753:M 17 Feb 2023 13:11:14.519 # Server initialized
32753:M 17 Feb 2023 13:11:14.520 * Ready to accept connections
````

### Frontend

Abra a pasta do front-end `cd socket-redis-front`, instale as dependências com `npm i`, `yarn` ou `pnpm i`.

#### Inicie o projeto:

```bash
# com npm
npm run dev
# com yarn
yarn dev
# com pnpm
pnpm run dev
```

Após isso, abra o endereço `http://localhost:5173` no navegador.

### Backend

Abra a pasta do back-end `cd socket-redis-back`, instale as dependências com `npm i`, `yarn` ou `pnpm i`.

#### Inicie o projeto:

```bash
# com npm
npm run start:dev
# com yarn
yarn start:dev
# com pnpm
pnpm run start:dev
```

### Redis em cluster

Caso queira, é possível ativar o [cluster do Redis](https://severalnines.com/blog/installing-redis-cluster-cluster-mode-enabled-auto-failover/), porém o store das mensagens e de sessões ainda não está adaptado para essa finalidade.

### Configurando o Redis

Você pode configurar o Redis conforme for mais conveniente. O arquivo padrão está da seguinte forma.

```
bind 127.0.0.1
protected-mode no
port 7000
cluster-enabled yes
cluster-config-file nodes.conf
cluster-node-timeout 15000
appendonly yes
```
