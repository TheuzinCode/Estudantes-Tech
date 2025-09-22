
Frontend-only PETMATCH mock (static).

Conteúdo:
- products.html (lista com busca, paginação, ações)
- productForm.html (cadastro/alteração com múltiplas imagens, marcar principal, salvar/cancelar)
- productView.html (visualização com carrossel, botão comprar desabilitado)
- estoquistaForm.html (apenas qtd editável)
- login.html (simulado)
- css/style.css, js/app.js, assets/

Como usar:
- Extraia o ZIP e abra qualquer arquivo HTML no navegador (recomendado usar Live Server no VS Code para melhor comportamento).
- As alterações (salvar produto, imagens) são guardadas no localStorage do navegador (persistem no mesmo navegador).
- Upload de imagens é feito localmente com FileReader; nomes simulados são gerados e armazenados no localStorage.
- Nenhuma integração com backend é necessária agora.
