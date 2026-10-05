# RangoFast Delivery O App do Entregador

Projeto da Atividade 3 (Fatec): aplicativo para entregadores da plataforma RangoFast Delivery, em duas versões — Mobile (Expo/React Native) e Web (ReactJS/Vite), seguindo a mesma Arquitetura em Camadas.

Documentação técnica completa, com a motivação de cada decisão: `[docs/GUIA_TECNICO.md](docs/GUIA_TECNICO.md)`.

## Estrutura

```
RangoFast-Delivery/
├── docs/GUIA_TECNICO.md   # documentação técnica (arquitetura, segurança, divisão de tarefas)
├── mobile/                # Expo (React Native + TypeScript)
└── web/                   # ReactJS + Vite + TypeScript
```



## Como rodar em Mobile

```bash
cd mobile
cp .env.example .env   # já vem com a URL da API do guia
npm install
npx expo start
```

Abra no Expo Go (Android) ou em um emulador. Permissões de GPS e Câmera são solicitadas em tempo de execução.

## Como rodar na Web

```bash
cd web
cp .env.example .env
npm install
npm run dev
```

Acesse `http://localhost:5173` (ou a porta indicada pelo Vite). O proxy de desenvolvimento configurado em `vite.config.ts` é necessário porque a API não envia cabeçalhos CORS, ver detalhes no guia técnico.

## API utilizada

Serviço de autenticação fornecido pela Fatec: `https://login-p26w.onrender.com/fatec/login/v1`. Endpoints `/create` (cadastro) e `/auth` (login), sessão via cookie.