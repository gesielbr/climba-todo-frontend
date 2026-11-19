# ✅ LimbaTodo — Frontend

**Aplicação de lista de tarefas (To-Do) construída com Angular 21, Signals, Bootstrap 5 e tema escuro customizado.**

[![Angular](https://img.shields.io/badge/Angular-21-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

[🌐 Acessar a aplicação](https://limba-todo-frontend.vercel.app) • [🔗 API Backend](https://climba-todo-one.vercel.app/api/todos) • [📦 Repositório Backend](https://github.com/gesielbr/climba-todo)

---

## 📸 Preview

> _Adicione aqui um print ou GIF da aplicação rodando._

<div align="center">
  <img src="https://via.placeholder.com/800x400/1a1b26/ffffff?text=Limba+Todo+%E2%80%94+Preview" alt="Preview da aplicação" />
</div>

---

## 📋 Sumário

- [Sobre o projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Arquitetura do projeto](#-arquitetura-do-projeto)
- [Como rodar localmente](#-como-rodar-localmente)
- [Integração com o backend](#-integração-com-o-backend)
- [Decisões técnicas](#-decisões-técnicas)
- [Deploy](#-deploy)
- [Licença](#-licença)

---

## 🎯 Sobre o projeto

O **LimbaTodo** é uma aplicação de gerenciamento de tarefas (To-Do) desenvolvida como parte de um **teste técnico**. O frontend foi construído com **Angular 21** utilizando as práticas mais modernas do framework:

- **Standalone components** (sem `NgModule`)
- **Signals** para estado reativo
- **Zoneless** (padrão do Angular 21)
- **Reactive Forms** para validação
- **Bootstrap 5** para layout responsivo
- **Tema escuro customizado** com variáveis CSS

A aplicação consome uma **API RESTful em .NET 10** com **PostgreSQL** e **Clean Architecture** (repositório separado).

---

## ✨ Funcionalidades

- ✅ **Criar tarefas** com título, descrição e data prevista
- ✅ **Listar tarefas** em tempo real com Signals
- ✅ **Editar tarefas** inline (título, descrição e data)
- ✅ **Excluir tarefas** com feedback visual
- ✅ **Marcar/desmarcar** tarefas como concluídas
- ✅ **Pesquisar** por título, descrição ou data
- ✅ **Badge de status** (Pendente / Concluída) com cores customizadas
- ✅ **Validação de data prevista** (não pode ser no passado, com feedback em tempo real)
- ✅ **Ícones dinâmicos** por categoria (⏰, 🏃, 🏋️, 💼, 📝)
- ✅ **Data atual** no header (pt-BR) com pipe customizado
- ✅ **Layout responsivo** (desktop, tablet e mobile)
- ✅ **Tema escuro** customizado com Bootstrap 5
- ✅ **Scroll independente** na lista de tarefas

---

## 🛠️ Tecnologias

| Camada | Tecnologia |
|--------|------------|
| Framework | Angular 21 (standalone components) |
| Estado reativo | Signals |
| Formulários | Reactive Forms |
| Estilo | Bootstrap 5 + CSS customizado |
| Ícones | Bootstrap Icons |
| HTTP | HttpClient com `withFetch` |
| Linguagem | TypeScript |
| Deploy | Vercel |
| Testes | Vitest (configurado pelo Angular CLI) |

---

## 🏗️ Arquitetura do projeto

O projeto segue uma organização modular baseada em **features**, com separação clara de responsabilidades:

    src/
    ├── app/
    │   ├── components/
    │   │   ├── sidebar/            # Barra lateral de navegação
    │   │   ├── todo-list/          # Lista de tarefas + busca
    │   │   ├── todo-card/          # Card individual (edição inline)
    │   │   └── create-task/        # Formulário de criação
    │   ├── models/
    │   │   └── todo.model.ts       # Interfaces (Todo, CreateTodoDto, UpdateTodoDto)
    │   ├── pipes/
    │   │   └── capitalize.pipe.ts  # Pipe para capitalizar a data (pt-BR)
    │   ├── services/
    │   │   └── todo.service.ts     # Serviço HTTP + estado com Signals
    │   ├── app.component.ts        # Componente raiz (layout)
    │   ├── app.html                # Template do layout principal
    │   ├── app.css                 # Estilos globais do layout
    │   └── app.config.ts           # Configuração (HttpClient, locale pt-BR)
    └── styles.css                  # Tema escuro e variáveis CSS

### Fluxo de dados

    Usuário → Componente → TodoService (Signals) → HTTP → API .NET → PostgreSQL
                    ↑                                           │
                    └─────────────── atualiza ──────────────────┘

O `TodoService` centraliza o estado da aplicação com **Signals** (`todos`, `loading`) e expõe métodos para CRUD. Os componentes reagem automaticamente às mudanças, sem necessidade de recarregar a página.

---

## 🚀 Como rodar localmente

### Pré-requisitos

- Node.js 20+
- Angular CLI 21+
- API backend rodando em `http://localhost:8080` (ou usar a API em produção)

### Instalação

    # Clone o repositório
    git clone https://github.com/gesielbr/limba-todo-frontend.git

    # Entre na pasta
    cd limba-todo-frontend

    # Instale as dependências
    npm install

### Rodar em desenvolvimento

    ng serve --port 4200

Acesse [http://localhost:4200](http://localhost:4200).

> ⚠️ **Atenção:** a `apiUrl` no `todo.service.ts` precisa apontar para o backend local (`http://localhost:8080/api/todos`) ou para a API em produção (`https://climba-todo-one.vercel.app/api/todos`).

### Build de produção

    ng build --configuration production

O build é gerado em `dist/limba-todo-frontend/browser`.

### Testes

    ng test

O Angular CLI 21 usa **Vitest** como test runner padrão.

---

## 🔗 Integração com o backend

A aplicação consome a API RESTful em **.NET 10** com **PostgreSQL**:

    https://climba-todo-one.vercel.app/api/todos

### Endpoints utilizados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/todos` | Lista todas as tarefas |
| `POST` | `/api/todos` | Cria uma tarefa |
| `GET` | `/api/todos/{id}` | Consulta uma tarefa |
| `PUT` | `/api/todos/{id}` | Atualiza uma tarefa |
| `PATCH` | `/api/todos/{id}/complete` | Conclui uma tarefa |
| `DELETE` | `/api/todos/{id}` | Exclui uma tarefa |

### Exemplo de payload (criação)

    {
      "title": "Estudar Angular 21",
      "description": "Revisar Signals e standalone components",
      "dueDate": "2026-11-25T00:00:00Z"
    }

### Exemplo de payload (atualização)

    {
      "title": "Estudar Angular 21",
      "description": "Revisar Signals, standalone components e Zoneless",
      "dueDate": "2026-11-25T00:00:00Z",
      "isCompleted": true
    }

> 📘 A documentação completa da API está no [README do backend](https://github.com/gesielbr/climba-todo).

---

## 🎯 Decisões técnicas

### Signals para estado reativo

O estado da aplicação (lista de tarefas, loading e busca) é gerenciado com **Signals**, garantindo que a UI atualize **na hora** após criar, editar ou excluir — sem depender de recarregar a página.

    private todosSignal = signal<Todo[]>([]);
    public todos = this.todosSignal.asReadonly();

    private loadingSignal = signal<boolean>(false);
    public loading = this.loadingSignal.asReadonly();

### Validação de data em tempo real

O `create-task` usa um **validador customizado** no Reactive Forms que impede datas no passado, com feedback visual embaixo do campo (sem `alert`). A comparação é feita **apenas pelo dia**, ignorando fuso horário:

    const escolhida = new Date(ano, mes, dia); // data local, sem UTC
    if (escolhida < hoje) return { dataPassada: true };

Isso resolve o problema clássico de `new Date('yyyy-MM-dd')` interpretar como UTC e voltar um dia no fuso local.

### Edição inline no card

A edição da tarefa acontece **diretamente no card**, com botões de salvar/cancelar e mensagem de erro embaixo do campo de data. Isso evita modais e mantém a experiência fluida.

### Busca com `computed`

O filtro de busca usa `computed` para recalcular em tempo real e busca em **título, descrição e data** (formatada e ISO):

    filteredTodos = computed(() => {
      const term = this.searchTerm().toLowerCase().trim();
      // filtra por título, descrição e data (dd/MM/yyyy e ISO)
    });

### Limpeza automática da busca

Quando o usuário foca em qualquer campo do `create-task`, a busca é limpa automaticamente via **output** (`formFocused`) e **input** (`searchTerm`) entre componentes irmãos, intermediados pelo `app.component`.

### Layout responsivo com Bootstrap 5

O layout usa o **grid do Bootstrap 5** (`container-fluid`, `row`, `col-*`) com breakpoints para desktop, tablet e mobile. A sidebar é visível apenas em telas maiores (`d-none d-md-block`).

### Tema escuro customizado

As cores são definidas em variáveis CSS no `styles.css`:

    :root {
      --bg-sidebar: #16161e;
      --bg-card: #24283b;
      --bg-card-active: #3b82f6;
      --purple-accent: #a855f7;
    }

### Deploy na Vercel

O frontend é deployado automaticamente na **Vercel** a cada push na branch `main`. O SSR foi removido para simplificar o deploy e evitar porta dinâmica.

---

## 📦 Deploy

- **Frontend:** [https://limba-todo-frontend.vercel.app](https://limba-todo-frontend.vercel.app)
- **Backend:** [https://climba-todo-one.vercel.app/api/todos](https://climba-todo-one.vercel.app/api/todos)
- **Repositório Backend:** [https://github.com/gesielbr/climba-todo](https://github.com/gesielbr/climba-todo)

---

## 📝 Licença

Este projeto foi desenvolvido como parte de um **teste técnico**. Sinta-se à vontade para usar como referência de estudo.

---

<div align="center">

**Feito com 💜 por [Gesiel](https://github.com/gesielbr)**

[⬆ Voltar ao topo](#-limbatodo--frontend)

</div>
