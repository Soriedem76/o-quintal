# 🧱 O Quintal — Mural Colaborativo

Mural interativo estilo grafite urbano. Seus amigos compartilham fotos, desenham, colam pins e associam músicas num canvas colaborativo em tempo real.

**Tecnologias:** React + Vite · Firebase (Firestore + Storage + Auth) · PWA instalável

---

## ⚡ Início Rápido

### 1. Instalar dependências

```bash
cd quintal
npm install
```

### 2. Configurar Firebase

#### 2.1 Criar projeto no Firebase
1. Acesse https://console.firebase.google.com
2. **Criar projeto** → dê um nome (ex: `o-quintal`)
3. Desative Google Analytics (opcional)

#### 2.2 Habilitar serviços
No menu lateral do Firebase Console:

- **Authentication** → Sign-in method → habilitar **Anonymous**
- **Firestore Database** → Criar banco → modo **test** (ou use as regras abaixo)
- **Storage** → Ativar

#### 2.3 Pegar credenciais
**Project Settings** (ícone de engrenagem) → **Your apps** → **Web app** → Registrar app → copie o `firebaseConfig`

#### 2.4 Colar no projeto
Edite `src/lib/firebase.js`:

```js
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### 3. Rodar em desenvolvimento

```bash
npm run dev
```
Acesse: http://localhost:5173

---

## 🔥 Regras do Firebase

### Firestore Rules
No Firebase Console → **Firestore → Rules**, cole:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /items/{itemId} {
      // Leitura: qualquer um autenticado
      allow read: if request.auth != null;
      // Escrita: qualquer autenticado pode criar
      allow create: if request.auth != null
        && request.resource.data.quintalId is string
        && request.resource.data.author is string;
      // Update: só posição (drag)
      allow update: if request.auth != null
        && request.resource.data.diff(resource.data).affectedKeys()
            .hasOnly(['x', 'y']);
      // Delete: só o próprio autor
      allow delete: if request.auth != null
        && resource.data.authorId == request.auth.uid;
    }
  }
}
```

### Storage Rules
**Storage → Rules**:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /quintals/{quintalId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null
        && request.resource.size < 10 * 1024 * 1024; // max 10MB
    }
  }
}
```

### Índice Composto do Firestore
O app faz uma query com `where` + `orderBy` que precisa de índice.
Ao rodar pela primeira vez, o Firestore vai mostrar um erro no console com um **link direto para criar o índice**. Clique nele ou crie manualmente:

- **Coleção:** `items`
- **Campo 1:** `quintalId` (Ascending)
- **Campo 2:** `createdAt` (Ascending)

---

## 📱 Instalar como App (PWA)

### Android (Chrome)
1. Abra o site no Chrome
2. Menu (⋮) → **"Adicionar à tela inicial"**
3. O app aparece como ícone nativo
4. **A câmera funcionará como app nativo** — abre direto a câmera traseira

### iOS (Safari)
1. Abra no Safari (obrigatório, não Chrome)
2. Botão de compartilhar (□↑) → **"Adicionar à Tela Inicial"**
3. Abre em tela cheia sem barra do browser

### Desktop (Chrome/Edge)
1. Ícone de instalação na barra de endereços (🖥️)
2. Ou Menu → **"Instalar O Quintal"**

---

## 🏗️ Estrutura do Projeto

```
quintal/
├── public/
│   ├── manifest.json       # PWA config
│   ├── sw.js               # Service Worker (cache offline)
│   └── icons/              # Ícones do app
├── src/
│   ├── lib/
│   │   ├── firebase.js         # Config Firebase
│   │   ├── UserContext.jsx     # Auth anônima + nome/cor
│   │   └── QuintalContext.jsx  # Salas por código (MURO-42)
│   ├── hooks/
│   │   └── useMural.js         # CRUD Firestore em tempo real
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── AuthScreen.jsx      # Login: nome + cor
│   │   │   └── QuintalSelect.jsx   # Criar ou entrar numa sala
│   │   ├── Mural/
│   │   │   ├── MuralApp.jsx        # Container principal
│   │   │   ├── Canvas.jsx          # Canvas infinito + drag
│   │   │   └── Toolbar.jsx         # Barra de ferramentas
│   │   ├── Drawing/
│   │   │   ├── DrawingLayer.jsx    # Canvas de desenho + drips
│   │   │   └── DrawingItem.jsx     # Renderiza desenho no mural
│   │   ├── Photo/
│   │   │   ├── PhotoUploadModal.jsx # Upload + câmera nativa
│   │   │   └── PhotoCard.jsx       # Polaroid no mural
│   │   ├── Pin/
│   │   │   ├── PinModal.jsx        # Criar pin
│   │   │   └── PinItem.jsx         # Adesivo no mural
│   │   ├── Music/
│   │   │   └── MusicPlayer.jsx     # Embed Spotify/YouTube/SC
│   │   └── UI/
│   │       ├── UserBadge.jsx       # Chip de usuário no topo
│   │       └── ShareSheet.jsx      # Compartilhar código/link
│   └── styles/
│       ├── global.css          # Variáveis, reset, grain
│       └── animations.css      # drip, stamp-in, slideUp...
```

---

## 🎮 Como Usar

### Fluxo básico
1. **Escolha nome e cor** → essa cor é sua identidade no mural
2. **Crie ou entre num quintal** via código (ex: `PATIO-37`)
3. **Compartilhe o código** com a galera via botão ↗ no topo

### Ferramentas
| Ferramenta | Ação |
|-----------|------|
| ✋ **MOVER** | Arrastar o mural, reposicionar itens |
| 🎨 **GRAFITAR** | Desenho livre com efeito de tinta |
| 📍 **PIN** | Toca/clica no mural para deixar um comentário |
| 📷 **FOTO** | Tira foto (câmera nativa no app) ou escolhe da galeria |

### Câmera no celular
- **PWA instalado**: abre câmera nativa do celular (traseira por padrão)
- **Browser no celular**: solicita permissão de câmera
- **Desktop**: abre webcam via browser

---

## 🚀 Deploy

### Vercel (recomendado)
```bash
npm install -g vercel
vercel
# Segue as instruções, funciona out of the box
```

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Public dir: dist, SPA: yes
npm run build
firebase deploy
```

O service worker e o manifest já estão configurados para funcionar em qualquer domínio.

---

## 🔧 Customização

### Trocar cores principais
Em `src/styles/global.css`, edite as variáveis:
```css
:root {
  --red: #D62828;       /* cor de destaque */
  --black: #0D0D0D;     /* fundo */
  --white: #F0EDE6;     /* texto */
}
```

### Adicionar mais quintais por usuário
Atualmente 1 usuário pode ter múltiplos quintais (basta trocar de sala). Para listar salas recentes, salvar em `localStorage` a lista de `quintalCode` visitados.

### Tamanho máximo de foto
Em `Storage Rules`, linha `request.resource.size < 10 * 1024 * 1024` → mude o `10` para o limite desejado em MB.

---

## ⚠️ Limites do Firebase Spark (gratuito)

| Recurso | Limite/mês |
|---------|-----------|
| Firestore reads | 50.000/dia |
| Firestore writes | 20.000/dia |
| Storage | 5 GB total |
| Storage download | 1 GB/dia |

Para uso entre amigos, o plano gratuito é mais que suficiente.

---

## 📋 TODO / Próximos passos

- [ ] Reações em fotos (emoji rápido)
- [ ] Notificação push quando alguém posta
- [ ] Modo câmera frontal (selfie)
- [ ] Zoom com pinch no mobile
- [ ] Exportar mural como imagem
- [ ] Histórico de quem estava online

---

*Feito com ❤️ + 🎨 — O quintal é de todos*
