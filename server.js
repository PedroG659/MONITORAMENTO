// server.js
// App Express simples com métricas Prometheus (prom-client)
// Comentários explicam cada bloco.


const express = require('express');
const client = require('prom-client');


const app = express();


// Coleta métricas padrão do node (CPU, memória, gc, etc.).
// collectDefaultMetrics é uma função que começa a coletar métricas automaticamente.
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics(); // inicia a coleta de métricas padrão


// Criamos um contador para contar requisições ao endpoint '/'.
// name: nome da métrica exposta ao Prometheus
// help: descrição da métrica
const requestCounter = new client.Counter({
name: 'app_requests_total',
help: 'Total de requisições recebidas pelo endpoint root'
});


// Criamos um histograma para medir duração de resposta (em segundos)
// Isso ajuda a criar indicadores de latência no Grafana.
const responseTimeHistogram = new client.Histogram({
name: 'app_response_duration_seconds',
help: 'Duração das respostas em segundos',
// buckets são os intervalos em segundos para agrupar as observações
buckets: [0.005, 0.01, 0.05, 0.1, 0.5, 1, 2]
});


// Endpoint principal — contabiliza contadores e observa tempo de resposta
app.get('/', async (req, res) => {
// inicia temporização do histograma
const end = responseTimeHistogram.startTimer();


// incrementa contador de requisições
requestCounter.inc();


// Simula trabalho (opcional) — aqui apenas enviamos a resposta
res.send('Hello, Prometheus + Grafana + Kubernetes!');


// finaliza temporizador e registra duração
end();
});


// Endpoint exposto para Prometheus coletar métricas
app.get('/metrics', async (req, res) => {
// define o Content-Type correto para o Prometheus
res.set('Content-Type', client.register.contentType);
// envia todas métricas registradas
res.end(await client.register.metrics());
});


// Porta configurável via env var PORT (útil para Kubernetes)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(`App running on port ${PORT}`);
});