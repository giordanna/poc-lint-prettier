# POC TSLint + Prettier

POC de utilização de TSLint + Prettier + Husky + Lint-Staged + Nodemon + Concurrently

- TSLint: Forçar a padronização de código. Mostra erros e warnings.
- Prettier: Formatação automática de código.
- Husky: Executar comandos antes de `commit` e `push`.
- Lint-Staged: Forçar que o commit seja da versão mais atualizada
- Nodemon: Permitir escutar por alterações de código para executar o linting.
- Concurrently: Permitir a execução de dois comandos em paralelo no mesmo terminal, o nodemon e o ng
  serve.

## Passos para reproduzir

- Executar no terminal:

```sh
ng add <projeto>
npm i -D prettier tslint-config-prettier tslint-plugin-prettier husky lint-staged nodemon concurrently
```

- Alterar `package.json`, adicionando os scripts:

```json
{
  ...
  "lint-staged": {
    "*.js": [
      "npm run prettier",
      "git add"
    ]
  },
  "husky": {
    "hooks": {
      "pre-commit": "ng lint --fix && npm run prettier",
      "pre-push": "ng lint --fix && npm run prettier"
    }
  },
  "scripts": {
    "ng": "ng",
    "build": "ng build",
    "test": "ng test",
    "lint": "ng lint",
    "e2e": "ng e2e",
    "prettier": "prettier --write '{functions,src,configuration}/**/*.{ts,js,scss,html}'",
    "lint:watch": "nodemon --exec \"ng lint || exit 1\" --ext ts",
    "start": "concurrently --kill-others \"npm run lint:watch\" \"ng serve\""
  },
  ...
}
```

- Adicione/altere no projeto os arquivos de configuração do TSLint e Prettier.

`tslint.json`:

```json
{
  "extends": ["tslint:recommended", "tslint-plugin-prettier", "tslint-config-prettier"],
  "rules": {
    "prettier": true,
    ...
  }
  ...
}
}
```

`.prettierrc`:

```json
{
  "bracketSpacing": true,
  "htmlWhitespaceSensitivity": "css",
  "arrowParens": "avoid",
  "trailingComma": "all",
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false,
  "endOfLine": "lf",
  "quoteProps": "as-needed",
  "semi": true,
  "printWidth": 100,
  "insertPragma": false,
  "jsxSingleQuote": false,
  "requirePragma": false,
  "jsxBracketSameLine": false,
  "proseWrap": "always",
  "vueIndentScriptAndStyle": false
}
```

`.prettierignore`:

```
e2e/
node_modules/
coverage/
dist/
build/
out/
www/
.next/
docs/
src/polyfills.ts
src/main.ts
src/test.ts
package-lock.json
karma.conf.js
```

- Inicializa projeto:

```sh
npm run start
```

- Adiciona em `app.component.ts`:

```ts
funcaoNova() {
  var totalmente_errado = "aaaaa";
  return totalmente_errado;
}
```

- O log irá apontar os erros:

```
[0] Linting "poc-lint-prettier"...
[0]
[0] ERROR: /home/giordanna/repos/poc-lint-prettier/src/app/app.component.ts:11:1 - Delete `⏎`
[0] ERROR: /home/giordanna/repos/poc-lint-prettier/src/app/app.component.ts:13:5 - Forbidden 'var' keyword, use 'let' or 'const' instead
[0] ERROR: /home/giordanna/repos/poc-lint-prettier/src/app/app.component.ts:13:9 - Identifier 'totalmente_errado' is never reassigned; use 'const' instead of 'var'.
[0] ERROR: /home/giordanna/repos/poc-lint-prettier/src/app/app.component.ts:13:9 - variable name must be in lowerCamelCase, PascalCase or UPPER_CASE
[0] ERROR: /home/giordanna/repos/poc-lint-prettier/src/app/app.component.ts:13:29 - " should be '
[0] ERROR: /home/giordanna/repos/poc-lint-prettier/src/app/app.component.ts:13:29 - Replace `"aaaaa"` with `'aaaaa'`
[0]
[0] Lint errors found in the listed files.
```

- Tente commitar sem as alterações:

```sh
git add -A
git commit -m "salvar com as coisa errada"
```

- Será apontado erros:

```
husky > pre-commit (node v10.15.3)
Linting "poc-lint-prettier"...
Fixed 6 error(s) in /home/giordanna/repos/poc-lint-prettier/src/app/app.component.ts

ERROR: /home/giordanna/repos/poc-lint-prettier/src/app/app.component.ts:12:9 - Identifier 'totalmente_errado' is never reassigned; use 'const' instead of 'let'.
ERROR: /home/giordanna/repos/poc-lint-prettier/src/app/app.component.ts:12:9 - variable name must be in lowerCamelCase, PascalCase or UPPER_CASE
```

- Ajuste para commitar:

```ts
funcaoNova() {
  const totalmenteErrado = 'aaaaa';
  return totalmenteErrado;
}
```

## Prós e Contras

### Prós:

- Melhor organização de código, o que facilita na legibilidade
- Maior facilidade na formatação
- Os dois fatores acima contribuem para que seja possivel múltiplos desenvolvedores desenvolverem no
  mesmo projeto e manter a legibilidade ao decorrer do desenvolvimento
- Impede configurações diferentes de cada ambiente dos desenvolvedores (Prettier)
- Impede commits não-formatados

### Contras:

- TSLint está deprecado
- Migração do TSLint para o ESLint está prevista para o Angular 10 apenas
- Difícil de ser aplicado em projetos antigos que estão muito fora do padrão, ainda mais em versões
  mais antigas do Angular (versão incompatível do TSLint)
- Curva de aprendizado média
- Há regras que devem ser personalizadas dependendo do projeto (principalmente os que utilizam
  variáveis fora do padrão, como snake_case), ao ponto de ser necessário analisar se a quantidade de
  exceções a serem adicionadas no TSLint acaba arruinando o propósito do TSLint em si
