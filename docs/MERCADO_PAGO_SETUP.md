# Configuração do Mercado Pago e Webhooks (Dev)

Este guia explica como configurar o ambiente de desenvolvimento para receber notificações de pagamento do Mercado Pago (Webhooks) usando o **ngrok**.

## 1. Obter Credenciais de Teste

1.  Acesse [Suas Integrações](https://www.mercadopago.com.br/developers/panel/app).
2.  Crie uma aplicação ou selecione uma existente.
3.  Vá em **Credenciais de produção** ou **Credenciais de teste**.
4.  Copie o `Access Token`.
5.  Cole no seu arquivo `.env` ou `docker-compose.linux.yml`:
    ```yaml
    MP_ACCESS_TOKEN=TEST-seu-token-aqui...
    ```

## 2. Configurar o ngrok

O Mercado Pago precisa enviar uma requisição HTTP para o seu backend quando um pagamento é aprovado. Como seu backend está rodando em `localhost`, o Mercado Pago não consegue acessá-lo diretamente. O ngrok cria um túnel seguro para resolver isso.

### Instalação
1.  Crie uma conta em [ngrok.com](https://ngrok.com).
2.  Baixe e instale o ngrok.
3.  Conecte sua conta (comando disponível no dashboard do ngrok):
    ```bash
    ngrok config add-authtoken SEU_TOKEN_NGROK
    ```

### Rodando o Túnel
No terminal, rode:
```bash
ngrok http 3000
```
*(3000 é a porta do seu backend)*

O ngrok vai gerar uma URL pública, algo como: `https://a1b2-c3d4.ngrok-free.app`.

## 3. Atualizar o Código

1.  Copie a URL gerada pelo ngrok.
2.  Abra o arquivo `backend/.env`.
3.  Atualize a variável `WEBHOOK_URL`:

```bash
WEBHOOK_URL=https://a1b2-c3d4.ngrok-free.app/api/subscription/webhook
```

**Atenção**: Sempre que você reiniciar o ngrok, a URL muda, e você precisará atualizar este arquivo (a menos que tenha um plano pago do ngrok com domínio fixo).

## 4. Testando o Fluxo

1.  Reinicie o backend para aplicar a mudança da URL (`npm run docker:linux` ou apenas o restart do container).
2.  Acesse o Frontend (`http://localhost:5173`).
3.  Vá em **Upgrade to Pro**.
4.  Clique em **Assinar Agora**.
5.  No checkout do Mercado Pago (Sandbox), use cartões de teste fornecidos na documentação.
6.  Após o pagamento, o Mercado Pago enviará um POST para sua URL do ngrok.
7.  Verifique os logs do backend:
    ```
    Company 1 upgraded to PRO
    ```
8.  Acesse a página de configurações da empresa e veja a mensagem de sucesso.
