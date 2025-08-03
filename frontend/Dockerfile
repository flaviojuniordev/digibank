FROM node:20-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Instala dependências do sistema
RUN apk add --no-cache python3 make g++

# Copia os arquivos package.json e package-lock.json
COPY package*.json ./

# Limpa cache do npm e instala dependências
RUN npm cache clean --force && npm install --force

# Copia o resto do código da aplicação
COPY . .

# Expõe a porta que a aplicação vai usar
EXPOSE 5173

# Define o comando para iniciar a aplicação em modo de desenvolvimento
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
