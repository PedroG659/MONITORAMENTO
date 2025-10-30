# Dockerfile para a aplicação Node.js
# 1) Usa uma imagem Node leve
FROM node:18-alpine


# 2) Define diretório de trabalho dentro do container
WORKDIR /usr/src/app


# 3) Copia package.json e package-lock.json (se existir) e instala dependências
COPY package*.json ./
RUN npm install --production


# 4) Copia o restante do código para dentro da imagem
COPY . .


# 5) Expõe a porta em que o app irá rodar
EXPOSE 3000


# 6) Comando de inicialização do container
CMD ["node", "server.js"]