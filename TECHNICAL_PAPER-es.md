# NeuralMarket - Technical Paper Oficial
**Versión del Documento:** 2.0 (Release Candidate / Institutional Architecture)
**Ecosistema:** Solana, ElizaOS, Kalshi, Next.js, DeepSeek R1, OpenAI o1
**Idioma:** Español

---

## 1. Resumen Ejecutivo (Abstract)

**NeuralMarket V2** se ha rediseñado desde sus cimientos para convertirse en la primera infraestructura híbrida a prueba de censuras y fallas cognitivas en el mercado criptográfico. Actuando puramente como un **Proveedor de Software Estricto (Software-Only Provider)**, NeuralMarket consolida un ecosistema "No-Custodial" interconectado, orquestando Agentes Avanzados (Multi-LLM) con Smart Contracts operando en Solana. 

Este proyecto combate tres dogmas fundamentales operativos:
1. **El Problema del Arbitraje Lento en Fiat:** Facilitamos *NeuralVaults* apegadas en Solana (USDC) donde la ejecución del capital es instantánea y los cobros de licencias del protocolo son inmutables e incrustables en la cadena.
2. **Las Alucinaciones y Costo de Inteligencias Artificiales:** Se provee una orquestación en *Pipeline Multi-LLM* capaz de inferir métricas sentimentales locales sin coste asíncrono (DeepSeek), formatear la información transaccionalmente (Claude) y aprobar rigurosamente el riesgo sin posibilidad matemática de error humano (o1).
3. **El Costo B2B M2M:** Implementando el *Machine Payments Protocol (Gateway HTTP 402)* que obliga y verifica el pago automático entre servidores API antes de expeler las analíticas financieras.

---

## 2. Arquitectura de los 4 Pilares (Integración V2)

NeuralMarket opera verticalmente con 4 macro-estructuras sistémicas completamente autónomas y modulares.

### Pilar 1: Capa Cognitiva Inmutable (API Gateway Multi-LLM)
Refactorizada para evadir riesgos operacionales algorítmicos. La capa cognitiva no depende de una sola red neuronal. Consta de un orquestador híbrido (`neural-agent/src/services/multiLLMOrchestrator.ts`).

- **Tier 3 (Sentiment local - $0 Costo):** Utiliza *Ollama* de forma asíncrona procesando grandes volúmenes de contexto en redes privadas empoderado por `deepseek-r1:8b`.
- **Tier 2 (Structuring - Claude 3.5 Sonnet):** Pule el texto y genera el vector estructurado de decisión intent (`side, amount, confidence`).
- **Tier 1 (Risk Validator - OpenAI o1):** La capa final no se usa para generar ideas; funciona como el auditor que impone las restricciones duras. Compara matemáticamente la orden Tier 2 con la balanza disponible de la bóveda (risk_bounds) para asegurar que nunca se dispare sobre los márgenes operativos del usuario. 

### Pilar 2: Infraestructura No Custodial (Contratos Anchor)
El **NeuralVault** es la garantía de confianza criptográfica del ecosistema institucional, codificada puramente en `Rust`. Los usuarios nunca depositan fondos en carteras controladas por NeuralMarket.

- **Diseño de PDAs:** Cada fondo es una *Program Derived Address* vinculada 1:1 a la llave pública del usuario en cuestión.
- **Micro-Lógica de Pago:** Todas las transacciones comerciales aprobadas por la IA y firmadas por la wallet son canalizadas por `execute_trade_with_fee()`. El cual liquida en milisegundos un *Software License Fee* automático del `0.5%` directo a la tesorería del desarrollador. 
- **Verificación Constraint:** Se manejan variables estrictas en-cadena (`max_position_size_bps`) previniendo riesgos catastróficos por vulnerabilidades API o de validadores RPC.

### Pilar 3: Machine Payments Protocol (MPP Gateway) 
Resolviendo la "Monetización P2P Automatizada", la plataforma expone el portal B2B en `/packages/api/`, actuando como el cobrador de peajes para aplicaciones Web3 de terceros que quieren extraer inteligencia de Kalshi/Solana de nuestra IA. 

- **Interceptación de Estatus 402:** Frente a llamados REST sin headers de validación, el gateway cancela y responde un código de Estado HTTP `402 Payment Required`, indicando el contrato Web3 a firmar. 
- **Validación sin Base de Datos:** Usando los protocolos `x-\*` HTTP headers (ej. `x-solana-payment-tx`), la firma se contrasta contra el Devnet empleando `crypto.createHmac`. 
- **El resultado es un oráculo API Software as a Service** (SaaS) monetizado criptográficamente donde la máquina que paga extrae el JSON enriquecido de la predicción en tiempo real. 

### Pilar 4: Frente Institucional y Blackbox (Next.js 16)
Reemplazando los MVP previos, NeuralMarket ahora alberga un *Swarm Intelligence Command Center* enfocado a Hedge Funds desarrollado en Next.js.

- **Riesgos Deslizables (Risk-Slider):** Interface visual amigable que invoca `deposit_usdc` interactuando y alterando los Base Points (BPS) que la IA tiene permitido operar a discreción.
- **Auditoría Transaccional y Criptográfica (Irys):** Toda intención completada genera un Payload HMAC-SHA256, incluyendo el *Sentiment Core, Intent format y el Risk Level*. Éste hash es escrito permanentemente sobre el shadow drive descentralizado Irys (`gateway.irys.xyz/[Hash]`) proveyendo *Certeza del 100% de que la IA y no un humano hizo el movimiento*, a través  del Modal Exploratorio *Blackbox Data Table*.

---

## 3. Pruebas y Certificaciones de Riesgo

El ecosistema actual asegura su grado institucional pasando de forma exitosa las siguientes validaciones operativas:
- **Anchor Simulators:** Validadas y corroboradas localmente todas las transacciones `vault.rs` para verificar que es imposible alterar las métricas de un usuario B desde una cuenta A.
- **Fail-Open Logging:** Si a algún nodo se le corta la conectividad RPC durante una ráfaga, el sistema detiene los *TradeIntents*, emitiendo registros de estado degradado sin agotar la memoria de contención del servidor ni corromper las secuencias o1.
- **Compliance y Jurisdicción (Software puro):** El Portal evalúa localmente un "DFlow KYC Token Protocol", asegurando que aunque NeuralMarket no almacena Identidades (respetando PII), restringe el software ante IP americanas automatizando el filtro sin intervenir su lógica descentralizada fundamental mediante portales de aprobación de pruebas *DFlow Zero Knowledge*.

---

## 4. Viabilidad de Despliegue e Interoperabilidad Inminente

**Release Status:** `Candidate - Devnet Production Final`
NeuralMarket V2 ha consolidado su meta inter-mercado entre finanzas automatizadas e inferencia cognitiva pesada y regulaciones. Las iteraciones actuales asocian las pruebas de caja blanca en Devnet para inyectar su funcionalidad en V2.1 Mainnet, listos para transformar USDC en posiciones tangibles dentro de protocolos DFlow Kalshi sin un milisegundo de intervención humana y con la robustez legal de una agencia de proveeduría SaaS Web3.
