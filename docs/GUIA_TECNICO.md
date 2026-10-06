# Documentação RangoFast Delivery

Documento de apoio à apresentação e defesa do projeto. Explica o porquê das decisões de arquitetura, segurança e integração, não repete o que já está nos comentários do código.

## 1. Visão geral e motivação arquitetural

O projeto implementa o app do entregador da RangoFast Delivery em duas plataformas, Mobile (Expo/React Native) e Web (ReactJS/Vite), seguindo Arquitetura em Camadas: cada responsabilidade (visual, estado, lógica, rede) fica em uma pasta própria, e uma camada só conhece a camada imediatamente abaixo dela.

Mobile e Web são dois projetos irmãos, não um monorepo com código compartilhado. A decisão é deliberada: React Native e um bundler web (Vite) têm ambientes de execução incompatíveis (um roda sobre componentes nativos, o outro sobre o DOM), e forçar compartilhamento de código entre eles exigiria uma camada extra de abstração que não traz benefício real para o tamanho deste projeto. Em vez disso, as duas plataformas replicam a mesma estrutura de pastas e os mesmos nomes de função, a consistência vem do padrão arquitetural, não do código em si.

```
src/
├── api/         # comunicação HTTP com o serviço de login da Fatec
├── components/  # elementos visuais reutilizáveis
├── contexts/    # estado global (sessão do entregador)
├── hooks/       # lógica de negócio e acesso a recursos nativos
├── routes/      # navegação entre telas
├── screens/     # telas completas, só código visual
└── utils/       # validação e formatação
```

Regra que a arquitetura força: uma `screen` nunca chama `api/` diretamente, nem lê GPS/câmera diretamente. Ela só chama hooks. Isso é o que permite, por exemplo, trocar a lib de câmera sem tocar em nenhuma tela.

## 2. Divisão de responsabilidades

A documentação e a implementação foram divididas por camada entre dois programadores, não por tela nem por plataforma, porque a complexidade real do projeto está na camada, não na tela.

### 2.1 Programador A: Interface e recursos nativos

Responsável por `components/`, `screens/`, `routes/` e pelos hooks que tocam o sistema operacional: `hooks/useLocation.ts` e `hooks/useCamera.ts`.

Ponto central para a defesa: o GPS e a Câmera nunca aparecem direto numa tela. `useLocation` devolve só `{ coords, error, requestLocation }`, a tela não sabe se por trás existe `expo-location` ou a Geolocation API do navegador. O mesmo vale para `useCamera`. Essa troca de biblioteca por trás de um hook com a mesma assinatura é a prova prática de que a camada de apresentação está isolada da camada de sistema.

### 2.2 Programador B: Dados, integração e segurança

Responsável por `api/`, `contexts/AuthContext.tsx`, `hooks/useAuth.ts` e por todas as decisões de segurança envolvendo a sessão do entregador (seção 5).

Ponto central para a defesa: `api/client.ts` é o único lugar do projeto que sabe o endereço da API. Se o endpoint da Fatec mudasse de domínio ou de formato de resposta, a mudança ficaria contida em `api/` , `AuthContext`, `useAuth` e todas as telas continuam iguais.

## 3. Fluxo de dados: login

```
LoginScreen
  -> useAuth().login(username, password)   // valida entrada (utils/validators.ts)
  -> AuthContext.login(payload)
  -> api/auth.ts -> POST /auth              // camada de serviço
  -> servidor responde com Set-Cookie       // sessão criada no servidor
  -> AuthContext atualiza "user"            // estado global
  -> Routes troca AuthStack por AppStack    // UI reage ao estado, não ao contrário
```

Nenhuma tela decide se o usuário está logado. Essa decisão mora inteiramente no `AuthContext`; a tela (e o `routes/`) só leem o resultado.

## 4. Cookies: a diferença real entre Mobile e Web

O guia original pede sessão via cookie e sugere `withCredentials: true` no Axios. Essa recomendação é correta para Web e insuficiente para Mobile, a diferença foi o ponto mais técnico do projeto.

**Web**: o navegador tem um cookie jar nativo. `axios.create({ withCredentials: true })` basta, o browser guarda o cookie recebido no login e o reenvia automaticamente em toda chamada seguinte para o mesmo domínio. Nenhum código extra é necessário em `api/client.ts`.

**Mobile**: o React Native não é um navegador. A camada nativa de rede (OkHttp no Android, NSURLSession no iOS) tem seu próprio cookie jar e também persiste e reenvia o cookie automaticamente durante a vida do app, mas de forma invisível ao JavaScript. Não existe, no RN, uma forma simples e sem dependências nativas extras de ler o header `Set-Cookie` em `response.headers` (é a mesma restrição de segurança que existe em navegadores). A alternativa mais robusta seria uma lib nativa de terceiros (`@react-native-cookies/cookies`), descartada aqui porque exigiria sair do Expo Go para um build de desenvolvimento customizado, complexidade desproporcional ao escopo da atividade.

Decisão adotada: no Mobile, a sessão vive apenas enquanto o app está aberto (não sobrevive a um reinício do app). O login é validado pelo status HTTP da resposta (200/201), não pela leitura do cookie, e `AuthContext` guarda o estado em memória. O cookie em si segue sendo enviado automaticamente pela camada nativa nas chamadas seguintes, exatamente como no navegador, só não é inspecionável pelo nosso código. Essa é uma limitação documentada e intencional, não uma falha.

### Descoberta adicional: CORS na Web

A API (`login-p26w.onrender.com`) não aceita requisições de origens que não reconhece — qualquer chamada do navegador com header `Origin` é rejeitada com `403 Invalid CORS request`, mesmo com `withCredentials: true` configurado corretamente. Isso é esperado: o backend não foi feito para ser chamado direto do browser de qualquer domínio.

Solução adotada em `web/vite.config.ts`: um proxy de desenvolvimento. O navegador chama `/api/...` (mesma origem, sem CORS), o processo Node do Vite repassa a requisição para a API real removendo os headers `Origin`/`Referer` (como um cliente não-browser faria) e devolve a resposta, incluindo o `Set-Cookie`, com `cookieDomainRewrite` para o navegador aceitar o cookie como se fosse de `localhost`. Essa solução é válida para desenvolvimento; uma versão em produção precisaria de um backend próprio fazendo esse papel de proxy, o que está fora do escopo desta atividade.

Também descoberto por inspeção direta da resposta: o cookie de sessão (`access_token`) já é `HttpOnly` por conta do servidor e tem validade de apenas 120 segundos (`Max-Age=120`). Isto é, o próprio backend já protege o cookie contra leitura via JavaScript, reforça por que nenhuma tentativa de ler o cookie do lado do cliente seria produtiva, e explica por que a sessão expira rápido em ambas as plataformas.

**Atualização:** o proxy de CORS/cookie da Web deixou de ser exclusivo de desenvolvimento. A
lógica de repasse foi extraída para `web/server/authProxy.ts`, reusada tanto pelo plugin de
desenvolvimento do Vite (`vite.config.ts`) quanto por um servidor Express de produção
(`web/server/index.ts`, rodado via `npm run start` depois do `npm run build`). Isso muda o modelo
de deploy da Web de "hospedagem estática" para "processo Node" — ver seção "Produção" no
`README.md`.

## 5. Segurança: checklist de defesa do Projeto

1. Senha, payload de autenticação e qualquer header de cookie nunca são passados para `console.log`, em nenhuma camada, em nenhuma plataforma.
2. Toda submissão de formulário passa por `utils/validators.ts` (e-mail, CEP, tamanho mínimo de senha) antes de qualquer chamada de rede.
3. `api/client.ts` traduz todo erro HTTP em mensagem genérica (`"Usuário ou senha inválidos."` / `"Não foi possível completar a operação."`), o payload bruto do servidor nunca chega à UI.
4. O cookie de sessão é `HttpOnly` por definição do backend: nem o código do app nem um eventual script malicioso injetado conseguem lê-lo via JavaScript, em nenhuma das duas plataformas.
5. `AuthContext.logout()` limpa o estado local imediatamente. Não existe endpoint de invalidação de sessão fornecido pela API; o cookie expira por conta própria em 120 segundos.
6. Toda comunicação com a API ocorre em HTTPS (garantido pelo próprio domínio `onrender.com`); não há nenhum caminho de código que permita downgrade para HTTP.
7. O proxy de CORS (seção 4) hoje roda tanto em desenvolvimento quanto em produção, sempre a
  partir de um processo Node controlado por este projeto (nunca do navegador direto) — não é
   uma forma de contornar segurança, é a ponte necessária porque o backend não foi pensado para
   ser chamado direto do navegador.
8. Código de pedido (`RF-000`) é validado por `isValidOrderCode`/`ORDER_CODE_PATTERN` antes de
  qualquer leitura local, e `acceptOrder`/`cancelOrder`/`completeOrder` sempre conferem o dono
   da reserva no repositório, nunca confiam em decisão tomada só na tela.



## 6. Como rodar

Ver `[README.md](../README.md)` na raiz do projeto.

## 7. Extensões implementadas desde a primeira entrega

- Escaneamento de QR Code: implementado (mobile, `expo-camera` com `barcodeScannerSettings`),
junto com um domínio "Pedido" mockado localmente (`src/data/ordersRepository.ts` em cada
plataforma) para dar ao QR Code algo de verdade para identificar. Ver
`docs/superpowers/specs/2026-10-05-pedidos-qrcode-design.md` para o desenho completo (fora do
git, uso interno).
- Proxy de cookie em produção na Web: implementado via `web/server/authProxy.ts` compartilhado
entre o plugin de desenvolvimento do Vite e um servidor Express de produção.

Continua fora de escopo, pela mesma razão já registrada: persistência de sessão entre reinícios
do app Mobile (dependeria de uma lib nativa de cookie fora do Expo Go).