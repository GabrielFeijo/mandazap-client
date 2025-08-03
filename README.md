# 📱 MandaZap

Uma aplicação web moderna para gerenciamento de múltiplas instâncias do WhatsApp, desenvolvida com React, TypeScript, Vite e Tailwind CSS.

## 🚀 Sobre o Projeto

O **MandaZap** é uma interface web intuitiva que permite aos usuários gerenciar múltiplas instâncias do WhatsApp simultaneamente. A aplicação oferece funcionalidades avançadas para envio de mensagens, gerenciamento de contatos e monitoramento em tempo real.

### 📸 Screenshots

![Dashboard Principal](https://i.imgur.com/SFeZZV4.png)
_Dashboard principal com todas as instâncias_

![QrCode](https://i.imgur.com/pHSJHSk.png)
_Modal para leitura do QrCode_

![Envio de Mensagens](https://i.imgur.com/PsonhF2.png)
_Modal para envio de mensagens_

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- API MandaZap rodando (backend)

## 🚀 Instalação

1. **Clone o repositório**

   ```bash
   git clone https://github.com/GabrielFeijo/mandazap-client.git
   cd manda-zap-client
   ```

2. **Instale as dependências**

   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configure as variáveis de ambiente**

   Crie um arquivo `.env` na raiz do projeto:

   ```env
   VITE_API_BASE="http://localhost:3333"
   ```

4. **Execute o projeto**

   ```bash
   npm run dev
   # ou
   yarn dev
   ```

5. **Acesse a aplicação**

   Abra seu navegador e acesse: `http://localhost:5173`

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── Dashboard.tsx           # Dashboard principal
│   ├── LoginForm.tsx           # Formulário de login/registro
│   ├── InstanceCard.tsx        # Card de instância
│   ├── CreateInstanceModal.tsx # Modal de criação
│   ├── SendMessageModal.tsx    # Modal de envio de mensagens
│   ├── MessagesModal.tsx       # Modal de mensagens
│   ├── ContactsModal.tsx       # Modal de contatos
│   ├── QRCodeModal.tsx         # Modal de QR Code
│   └── StatusBadge.tsx         # Badge de status
├── contexts/           # Contextos React
│   ├── AuthContext.tsx         # Contexto de autenticação
│   └── SocketContext.tsx       # Contexto de WebSocket
├── hooks/             # Custom Hooks
│   ├── useAuth.ts             # Hook de autenticação
│   └── useSocket.ts           # Hook de WebSocket
├── services/          # Serviços de API
│   ├── api.ts                # Configuração da API
│   └── fetchWithAuth.ts      # Fetch com autenticação
├── types/
│   └── index.ts
├── utils/             # Utilitários
│   └── getInitials.ts
├── App.tsx            # Componente principal
├── main.tsx           # Ponto de entrada
└── index.css          # Estilos globais
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build de produção
- `npm run lint` - Executa o linter

---

## 🛠️ Feito utilizando

<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="40" height="45" /> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" width="40" height="45" /> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg" width="40" height="45" /> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" width="45" height="45"/>
