# ✅ LimbaTodo — Frontend

**Gerenciador de tarefas construído com Angular 21, Signals e Bootstrap 5. Organize suas pendências por vencimento, edite no próprio card e acompanhe o que já foi concluído.**

[![Angular](https://img.shields.io/badge/Angular-21-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

[🌐 Acessar a aplicação](https://limba-todo-frontend.vercel.app) • [🔗 API Backend](https://climba-todo-one.vercel.app/api/todos) • [📦 Repositório Backend](https://github.com/gesielbr/climba-todo)

---

## 📸 Preview

[Acesse a demonstração](https://limba-todo-frontend.vercel.app) para conhecer a tela de entrada e o painel de tarefas.

<!--
Para incluir uma captura, salve a imagem em docs/preview.png e descomente o bloco abaixo.

<div align="center">
  <img src="./docs/preview.png" alt="Painel do LimbaTodo em tema escuro, com a lista de tarefas e o formulário de criação" />
</div>
-->

---

## 📋 Sumário

- [Sobre o projeto](#-sobre-o-projeto)
- [Pontos fortes](#-pontos-fortes)
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

O **LimbaTodo** é uma aplicação de gerenciamento de tarefas desenvolvida como parte de um **teste técnico**. O objetivo é facilitar a organização do dia: ao abrir o painel, você vê primeiro o que ainda está pendente e quais prazos vêm antes.

O frontend usa **Angular 21**, componentes standalone e Signals. As tarefas são persistidas em uma **API REST em .NET 10 com PostgreSQL**, mantida em um [repositório separado](https://github.com/gesielbr/climba-todo). Já o nome usado na saudação fica salvo no navegador.

---

## 💡 Pontos fortes

- **Priorização que ajuda no dia a dia:** pendências aparecem antes das concluídas. Dentro de cada grupo, os prazos são exibidos em ordem crescente, com as tarefas sem data no final.
- **Estado reativo com responsabilidades bem separadas:** o `TodoService` cuida das requisições e do estado das tarefas. A lista deriva a busca e a ordenação com `computed`, sem alterar o array original do serviço.
- **Edição sem sair do contexto:** título, descrição e prazo podem ser editados no próprio card. Descrições longas podem ser expandidas sem abrir outra tela.
- **Status legível para além da cor:** os cards exibem os rótulos **Pendente** e **Concluída**, acompanhados de ícones e bordas que ajudam a distinguir os dois estados.
- **Entrada simples e personalizada:** a saudação usa o nome salvo no navegador, exibe um avatar com a inicial e se adapta a telas menores.

---

## ✨ Funcionalidades

- ✅ Informar o nome na tela de entrada e mantê-lo salvo entre visitas no mesmo navegador.
- ✅ Criar, editar e excluir tarefas com título, descrição e prazo.
- ✅ Marcar tarefas como concluídas e reabri-las quando necessário.
- ✅ Pesquisar por título, descrição ou data de vencimento.
- ✅ Listar pendências e concluídas por vencimento, com tarefas sem prazo ao final de cada grupo.
- ✅ Validar o prazo no formulário de criação, com feedback junto ao campo.
- ✅ Exibir a data atual por extenso em pt-BR, por exemplo: **Terça-feira, 24 de novembro de 2026**.
- ✅ Exibir indicadores de carregamento, estado de lista vazia e status nos cards.
- ✅ Usar o painel em desktop, tablet e celular, com tema escuro e rolagem independente na lista.

---

## 🛠 Tecnologias

| Camada | Tecnologia |
|--------|------------|
| Framework | Angular 21 com componentes standalone |
| Linguagem | TypeScript |
| Estado reativo | Angular Signals e `computed` |
| Formulários | Reactive Forms no cadastro de tarefas |
| Navegação | Angular Router, carregamento sob demanda e guard funcional |
| Estilo | Bootstrap 5, Bootstrap Icons e CSS customizado |
| HTTP | Angular HttpClient e RxJS |
| Testes | Arquivos `.spec.ts` e execução via Angular CLI |
| Deploy | Vercel |

---

## 🏗 Arquitetura do projeto

A estrutura separa componentes de interface, modelos, serviços e regras de navegação. A árvore abaixo agrupa os arquivos de implementação, template, estilo e teste nas respectivas pastas de componentes.

```text
src/
├── app/
│   ├── components/
│   │   ├── create-task/          # Formulário de criação de tarefas
│   │   ├── home/
│   │   ├── layout/               # Layout da área de tarefas
│   │   ├── login/                # Tela de entrada por nome
│   │   ├── sidebar/              # Barra lateral
│   │   ├── todo-card/            # Card individual e edição inline
│   │   └── todo-list/            # Busca, ordenação e exibição da lista
│   ├── date-picker-dropdown/     # Componente de seleção de data
│   ├── models/
│   │   └── todo.model.ts         # Todo, CreateTodoDto e UpdateTodoDto
│   ├── pipes/
│   │   └── capitalize.pipe.ts
│   ├── services/
│   │   ├── todo.service.ts       # Requisições HTTP e estado das tarefas
│   │   └── user.service.ts       # Nome do usuário e persistência local
│   ├── app.config.server.ts
│   ├── app.config.ts
│   ├── app.css
│   ├── app.html
│   ├── app.routes.server.ts
│   ├── app.routes.ts
│   ├── app.spec.ts
│   └── app.ts                    # Componente raiz
├── guards/
│   └── name.guard.ts             # Verifica o nome antes de ativar rotas do painel
├── index.html
├── main.server.ts
├── main.ts
├── server.ts
└── styles.css                    # Estilos globais e variáveis do tema
```

### Fluxo de dados

```text
Ação na interface → TodoService → HttpClient → API REST
Resposta da API   → TodoService → Signals    → Interface
```

O `TodoService` expõe os signals `todos()` e `loading()` para leitura. Depois de uma operação bem-sucedida, o serviço recarrega ou atualiza os dados locais conforme a ação. O `TodoList` reage a essas mudanças e recalcula a lista exibida, sem recarregar a página.

---

## 🚀 Como rodar localmente

### Pré-requisitos

- Node.js em uma [versão compatível com Angular 21](https://angular.dev/reference/versions), como a linha 22 LTS a partir da versão 22.12.
- npm.
- Acesso à API publicada ou a uma instância local do backend. Não é necessário instalar o Angular CLI globalmente para usar os comandos abaixo.

### Instalação

```bash
git clone https://github.com/gesielbr/limba-todo-frontend.git
cd limba-todo-frontend
npm install
```

### Rodar em desenvolvimento

```bash
npx ng serve --port 4200
```

Acesse [http://localhost:4200](http://localhost:4200).

Por padrão, o `TodoService` aponta para a API publicada. Para desenvolver sem alterar os dados da demonstração, siga as instruções do [backend](https://github.com/gesielbr/climba-todo) e ajuste a propriedade `apiUrl` em `src/app/services/todo.service.ts` para a sua instância, por exemplo `http://localhost:8080/api/todos`.

### Build de produção

```bash
npx ng build --configuration production
```

O diretório de saída é definido pela configuração de build no `angular.json`.

### Testes

```bash
npx ng test
```

O projeto inclui arquivos `.spec.ts` para componentes como login, lista, card e seletor de data.

---

## 🔗 Integração com o backend

**URL base:** `https://climba-todo-one.vercel.app/api/todos`

### Endpoints usados no fluxo da interface

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/todos` | Lista as tarefas |
| `POST` | `/api/todos` | Cria uma tarefa |
| `PUT` | `/api/todos/{id}` | Atualiza título, descrição, prazo ou status |
| `DELETE` | `/api/todos/{id}` | Exclui uma tarefa |

O serviço também disponibiliza `completeTodo()`, que chama `PATCH /api/todos/{id}/complete`. No fluxo atual da lista, tanto **concluir** quanto **reabrir** uma tarefa usam `PUT` com o campo `isCompleted`.

### Exemplo de payload (criação)

```json
{
  "title": "Estudar Angular 21",
  "description": "Revisar Signals e componentes standalone",
  "dueDate": "2030-11-25T00:00:00Z"
}
```

### Exemplo de payload (atualização)

```json
{
  "title": "Estudar Angular 21",
  "description": "Finalizar a revisão de Signals e do Angular Router",
  "dueDate": "2030-11-25T00:00:00Z",
  "isCompleted": true
}
```

> 📘 Consulte o [README do backend](https://github.com/gesielbr/climba-todo) para ver a documentação da API e as instruções para executá-la localmente.

---

## 🎯 Decisões técnicas

### Signals para estado, RxJS para HTTP

O estado das tarefas é alterado pelo serviço. Os componentes leem os signals públicos e disparam operações como criar, editar e excluir.

```ts
private todosSignal = signal<Todo[]>([]);
public todos = this.todosSignal.asReadonly();

private loadingSignal = signal<boolean>(false);
public loading = this.loadingSignal.asReadonly();
```

O `@if` alterna entre o carregamento e o conteúdo. O `@for` usa `track todo.id` para identificar cada card quando a lista é filtrada ou reordenada.

### Busca e ordenação com `computed`

O `filteredTodos` combina o termo de busca com os dados atuais do serviço. A busca considera título, descrição e prazo, tanto no formato brasileiro quanto no valor ISO recebido da API.

A ordenação segue duas regras:

1. **Pendentes antes de concluídas**, independentemente do vencimento.
2. **Em cada grupo, prazos em ordem crescente**, com tarefas sem data ou com data inválida no fim.

O `sort` atua sobre uma cópia do array. Assim, a ordem de exibição não altera o estado original mantido pelo serviço.

### Entrada por nome e navegação

A tela de login lê o nome digitado com `viewChild()` e salva o valor no `UserService` antes de navegar. O serviço mantém o nome em um signal e usa `localStorage` para preservá-lo após recarregar a página.

| Rota | Comportamento |
|------|---------------|
| `/` | Redireciona para `/login`. |
| `/login` | Exibe a tela pública de entrada. |
| `/tasks` | Abre o painel se houver nome salvo; senão, redireciona para `/login`. |
| URL desconhecida | Redireciona para `/tasks`, que passa pela mesma verificação. |

O `nameGuard` é aplicado com `canActivateChild`, para que novas rotas adicionadas ao grupo do painel compartilhem a regra. As telas de entrada e de tarefas são carregadas sob demanda com `loadComponent`.

> O guard organiza o fluxo de navegação. O nome salvo no navegador **não é autenticação** e não protege a API nem isola tarefas por usuário.

### Datas e edição inline

O formulário de criação valida o prazo no calendário local para não aceitar dias passados. O card permite salvar ou cancelar a edição sem sair da lista. No cabeçalho, a data atual é formatada com `Intl.DateTimeFormat('pt-BR')`.

### Tema escuro e responsividade

O grid do Bootstrap organiza o painel, enquanto as variáveis CSS centralizam as cores do tema. A saudação usa `clamp()` para ajustar texto e avatar, reticências em nomes longos e `prefers-reduced-motion` para respeitar a preferência por menos animações.

Os estilos usam **CSS Nesting nativo** para agrupar estados e media queries. As classes dos elementos da saudação mantêm seus seletores completos, sem depender da concatenação de seletores do Sass.

---

## 📦 Deploy

- **Frontend:** [limba-todo-frontend.vercel.app](https://limba-todo-frontend.vercel.app)
- **API:** [climba-todo-one.vercel.app/api/todos](https://climba-todo-one.vercel.app/api/todos)
- **Código do backend:** [github.com/gesielbr/climba-todo](https://github.com/gesielbr/climba-todo)

---

## 📝 Licença

Projeto desenvolvido como parte de um **teste técnico**. Antes de reutilizar ou redistribuir o código, verifique os termos de licença publicados no repositório.

---

<div align="center">

**Feito com 💜 por [Gesiel](https://github.com/gesielbr)**

[⬆ Voltar ao topo](#-limbatodo--frontend)

</div>
