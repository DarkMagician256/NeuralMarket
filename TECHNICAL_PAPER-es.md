# NeuralMarket - Technical Paper Oficial
**Versión de Documento:** 1.0 (Release Candidate / Institutional M1)
**Ecosistema:** Solana, ElizaOS, Kalshi, Next.js
**Idioma:** Español

---

## 1. Resumen Ejecutivo (Abstract)

**NeuralMarket** es una aplicación descentralizada (dApp) y un ecosistema de infraestructura IA que funciona como puente transaccional y oráculo predictivo entre el mercado criptográfico sobre Solana y los mercados de predicción regulados tradicionales (Kalshi). 

Este proyecto resuelve tres grandes problemas del ecosistema DeFi y los AI-Agents actuales:
1. **Privacidad Institucional:** Mediante el enrutamiento de agentes de IA locales con LLMs soberanos (como DeepSeek R1 trabajando offline mediante Ollama), previniendo fugas de datos estratégicos.
2. **Fricción de Liquidez:** Usando los bajos costos de la red de Solana y el enrutador intencional DFlow para convertir stablecoins/solana en posiciones legales de predicción.
3. **Falta de Transparencia del "Cerebro IA":** Mediante un puente de telemetría constante (Neural Link Protocol) que emite "pensamientos" cuantificados para que las instituciones y usuarios evalúen la cadena de decisiones de la IA en vivo.

---

## 2. Arquitectura Global del Sistema

El ecosistema NeuralMarket está conceptualmente segmentado en 3 capas de ejecución verticalmente integradas para proveer concurrencia sin obstrucciones.

### 2.1 Capa de Contrato Inteligente (Anchor/Solana) - "Neural Vault"
Escrita rigurosamente en Rust usando **Anchor 0.32.1**. Es la capa que garantiza inmutabilidad, reglas financieras, y la estructura de pagos.
Se despliega bajo el ID de programa: `A7FnyNVtkcRMEkhaBjgtKZ1Z7Mh4N9XLBN8AGneXNK2F`.

Contiene dos modelos principales de datos como *PDAs (Program Derived Addresses)*:
- `UserStats`: Gestiona conteos globales del billetera de un usuario, enlazado criptográficamente a la llave pública. Almacena victorias, conteos de agentes desplegados, y volumen total tranzado.
- `Agent`: Cada entidad IA ostenta un registro individual con: ID, arquetipo (Sniper, Sentinel, Oracle), riesgo, capital y el margen de apalancamiento, con rastreo en vivo de `total_pnl` (Ganancias / Pérdidas en lamports).

**Instrucciones Críticas (Transacciones Funcionales):**
*   `create_agent_standalone`: Despliega de inmediato un Agente y cobra automáticamente el **Protocol Fee exacto de 0.05 SOL** (`50_000_000` lamports) directamente a la tesorería de NeuralMarket utilizando `system_instruction::transfer`.
*   `submit_trade_intent`: Es el pegamento esencial de DFlow. En lugar de hacer arbitraje en la cadena on-chain, emite el evento bloqueado `TradeIntentSubmitted`. Los Solvers (recolectores de órdenes off-chain en un entorno asíncrono) se suscriben a estos eventos e infieren en milisegundos las operaciones contra mercados como USDC -> Kalshi.
*   `record_agent_prediction`: Es la resolución del oráculo que confirma si la IA profetizó ganancia o pérdida, modificando el PDA `Agent.total_pnl` garantizando auditorias en tiempo real en los retornos sobre capital institucional de la IA.

### 2.2 Capa Cognitiva Autónoma (Neural Agent - TypeScript / ElizaOS)
Se encuentra en `/neural-agent/` y representa el cerebro del marco de trabajo.
*   **Oráculo Sentient (ElizaOS Runtime):** Utiliza los protocolos de `@elizaos/core` y el plugin de `@elizaos/plugin-solana` para crear una identidad criptográfica conectada al mercado.
*   **Decisión LLM Híbrida**: Una lógica de inyección de infraestructura en `agent.ts` detecta la variable `USE_LOCAL_AI`. 
    *   Si está activa, el agente ignora OpenAI, apaga los servicios de red de API de inferencia externa y consume tokens locales de Ollama (`ModelProviderName.OLLAMA`).
    *   Si no, rutea normalmente solicitudes a OpenAI Cloud para velocidad máxima.
*   **Pipeline Analítico Base**: Ejecuta un "Cron Heartbeat" de 15 segundos que consulta en vivo los **top 10 mercados con mayor liquidez de Kalshi** obteniendo APIs v2, extrae volumen base, inyecta su conocimiento y emite determinaciones de peso probabilístico (`HIGH_CONVICTION_YES`, `BEARISH`, etc.).
*   **Interceptor de Registros (Telemetría)**: Este subsistema sobreescribe el `elizaLogger` nativo de la IA. Inyecta escuchas a todos los logs informativos e invocaciones de éxito mental del bot y las propaga de regreso usando colas MQ / HTTP para la capa del frontend.

### 2.3 Capa Front-End Cliente (Next.js App Router)
Se ejecuta en `Next.js 16.1.3` + `React 19`.
*   **Integración UI / UX Dinámica**: Utiliza `TailwindCSS v4` consolidado con `Framer Motion` y `React Three Fiber`. Se enfoca en el "Glassmorphism oscurecido" y micro-animaciones premium, proveyendo al inversionista la sensación de interactuar con un terminal tecnológico y moderno.
*   **Conectividad Solana End-to-End**: A través de las bibliotecas `@solana/wallet-adapter-react` el usuario firma transacciones para el cobro del fee de programa On-chain y de la inserción o desactivación de sus bots.
*   **Visualización en Tiempo Real**: SWR acoplado a Supabase proveen *Hot Subscriptions* atadas al canal del interceptor de telemetría. Recharts proyecta gráficos de los "Pensamientos" de la IA en tiempo real sobre la gráfica de Kalshi / DFlow.

---

## 3. Pruebas y Aseguramiento de Calidad (QA / Testing)

Buscando una certificación productiva M1 Institucional, NeuralMarket opera las siguientes capas de testing:
- **Anchor Tests (.anchor/tests)**: Usa `mocha`/`chai` con `anchor-bankrun` embebido para validaciones locales hiper-rápidas donde simula la transferencia de tesorería y validación del chequeo de autoridad (Agent owner validation constraint `constraint = agent.owner == user.key()`).
- **Vitest (Unit Coverage)**: Utiliza `@vitest/coverage-v8` para escanear dependencias del front-end.
- **Micro-E2E con Playwright**: Implementado bajo `playwright.config.ts`, ejecuta simulaciones de User Stories end-to-end dentro del app renderizada evaluando interacciones reactivas de botones Web3 y tablas de renderizamiento en múltiples navegadores.

---

## 4. Patrones de Diseño Aplicados y Seguridad

- **Program Derived Addresses (PDAs):** Prevención completa contra la contaminación de estados, ya que todos los agentes basan su Address en un Seed (`user.key`, `agent_id`). Si el usuario trata de manipular o invocar datos de un agente adverso, la restricción de validación Anchor previene la instrucción de base.
- **Fail-open Logging:** El Agente utiliza `Try-Catch` perimetrales en los Heartbeats. Si Kalshi colapsa u Ollama falla, el agente emite un "Thought" informando degradación del feed, pero la aplicación no crashea, y vuelve a intentar tras 15 segundos de encedido seguro sin agotar memoria (gestionado directamente por los reportes `process.memoryUsage()`).
- **Telemetry TypeSafety:** Datos como tipos de pensamiento (`ANALYSIS`, `DECISION`) estructurados fuertemente bajo Enums de TS previniendo incomprensiones en el volcado a UI.
- **Observabilidad (Sentry):** El front-end integra `@sentry/nextjs` (Edge, Client, y Server) permitiendo que cualquier caída sutil de React Server Components sea monitorizada en vivo para asegurar un entorno ininterrumpible.

---

## 5. Conclusión y Factibilidad de Despliegue (Release Status)

Actualmente la plataforma supera un estadio funcional Beta y califica como un "Mainnet Release Candidate". Ha madurado su red con Devnet Solana demostrando interconectividad sólida e infraestructura Docker/Supabase lista para escalamientos horizontales de la flota ElizaOS. Contiene todo lo necesario para iniciar la monetización P2P y posicionarse como la interfaz líder de Agentes Autónomos Cripto-Inteligentes operando en mercados reales.
