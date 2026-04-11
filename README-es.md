# Sentinely V2: Institutional

**La Primera Interfaz Híbrida de Mercados de Predicción con Inteligencia de Enjambre (Swarm AI) y Pagos por Máquina en Solana.**

![Solana](https://img.shields.io/badge/Solana-Devnet-blueviolet?style=for-the-badge&logo=solana)
![Nextjs](https://img.shields.io/badge/Next.js-16_AppRouter-black?style=for-the-badge&logo=next.js)
![AI](https://img.shields.io/badge/AI-DeepSeek_|_Claude_|_o1-orange?style=for-the-badge)
![Non-Custodial](https://img.shields.io/badge/Security-Non_Custodial-green?style=for-the-badge)

---

## 🚀 ¿QUÉ ES NEURALMARKET V2?

**Sentinely** ha evolucionado hacia una **Arquitectura Institucional (V2)**, diseñada estrictamente como un proveedor de software (**Software-Only Provider**). Nuestro ecosistema sirve como puente analítico y de transacción on-chain entre el vasto ecosistema de liquidez de Solana y los mercados de predicción regulados tradicionales (como Kalshi) empoderado por Inteligencia Artificial y protocolos de pago por inferencia (MPP).

Al combinar **Agentes de Múltiples Redes Neuronales (Multi-LLM)** orquestados por ElizaOS, la velocidad de **Solana**, y la liquidación off-chain de DFlow, entregamos un "Dashboard B2B tipo Bloomberg" de grado bancario para operadores comerciales y desarrolladores que buscan automatizar estrategias de toma de decisión.

> [!WARNING]
> **Descargo de Responsabilidad Regulatoria:** Sentinely opera estrictamente como un Proveedor de Software B2B. Ni custodiamos fondos ni brindamos asesoramiento de inversión. Las bóvedas (Vaults) son gobernadas directamente por los usuarios vía sus llaves privadas de Web3.

---

## ✨ CARACTERÍSTICAS DE LA ARQUITECTURA V2

- ✅ **Bóvedas Neurales No Custodiales (NeuralVaults):** Contratos inteligentes escritos en Anchor sobre Devnet que retienen de forma segura USDC. Los retiros y cambios en límites de riesgo de operaciones son custodiados 100% por la firma del cripto-monedero de los inversores.
- ✅ **Monetización Machine-to-Machine (Protocolo x402):** Contamos con un portal API de Gateway que cobra un peaje automatizado de `0.05 USDC` por cada predicción generada, utilizando HTTP 402 y firmas transaccionales HMAC en Solana.
- ✅ **Orquestador Cognitivo "Multi-LLM":** Reducimos las alucinaciones a cero usando validación escalonada:
  - **Tier 3 (Local):** Extracción de contexto asíncrono vía *DeepSeek R1* a coste cero.
  - **Tier 2 (Estructuración):** Formateo con *Claude 3.5 Sonnet*.
  - **Tier 1 (Validación de Riesgo):** Aprobación final determinista vía *OpenAI o1*.
- ✅ **Panel de Control Institucional B2B:** Aplicación de alto rendimiento construida sobre Next.js 16 (App Router), embebida con componentes oscuros de visualización financiera, líderazgo AI y un deslizador preciso para medir "Límites por Riesgo" de capital. 
- ✅ **Auditoria Inmutable en Caja Negra (Blackbox Audit):** Todos los "pensamientos" cuantificados de IA y transacciones originadas son emparejados a una firma asimétrica y subidos a Irys (Shadow Drive), logrando un feed de registro inmodificable y un track récord garantizado.

---

## 🛠️ ESTRUCTURA DEL MONOREPO Y STACK TÉCNICO

| Directorio | Componente | Descripción y Stack |
|---|---|---|
| `apps/frontend` | Dashboard Next.js | Aplicación web en Next.js 16 App Router. Usa TailwindCSS v4, SWR, y componentes `@solana/wallet-adapter` para un look "Glassmorphism oscurecido". |
| `anchor/` | Programas Inteligentes | Smart Contracts escritos en `Rust` (Anchor 0.32.1) encargados de gestionar las PDAs del `NeuralVault`. |
| `neural-agent/` | Orquestador Multi-LLM | Motor NodeJS (`bun`) ejecutando el orquestador ElizaOS con capacidad de comunicarse de manera local vía Ollama. |
| `packages/api/` | Gateway MPP | Servidor que intercepta llamadas API B2B, exigiendo un pago On-chain verificando el header HTTP 402. |

---

## ⚙️ INICIO RÁPIDO (DESARROLLO MULTINODO)

Asegúrate de contar con `pnpm` (10.x+), `bun`, `rust`, `solana-cli` y `anchor` instalados.

### 1. Clonación Completa
```bash
git clone https://github.com/DarkMagician256/Sentinely.git
cd Sentinely
pnpm install
```

### 2. Configuración de Entornos (.env)
Asegúrate de estructurar el entorno B2B correctamente:
- `apps/frontend/.env.local`: Incluye tu RPC de Helius o Solana Devnet.
- `neural-agent/.env`: Requiere los tokens `ANTHROPIC_API_KEY`, `OPENAI_API_KEY` y si requieres soberanía local, `USE_LOCAL_AI=true` con el endpoint de Ollama.
- `packages/api/.env`: Semillas de validación HMAC para firmar el Gateway de Auditoría.

### 3. Correr el Frontend (Dashboard Institucional)
```bash
# Navega localmente al dashboard de riesgo
cd apps/frontend
pnpm run dev
# Disponible en: http://localhost:3000
```

### 4. Lanzar el API Gateway (Monetización MPP)
```bash
# Inicia la validación x402
cd packages/api
npm start
# Este correrá el validador de pagos machine-to-machine.
```

### 5. Iniciar la Inteligencia Local (DeepSeek + Orquestador)
Para probar la suite completa libre de censura, asegúrate de tener Ollama corriendo localmente con el modelo *deepseek-r1:8b*, y luego actívalo:
```bash
cd neural-agent
bun run src/agent.ts
```

---

## 📜 LICENCIA Y EXENCIÓN LEGAL

Este proyecto utiliza licencias y frameworks de código abierto, diseñado para operar bajo un perímetro de **Software Puro**. Sentinely no toma depósitos bajo sus cuentas principales (todas las transferencias son gobernadas por contratos Web3 bajo la autonomía de cada usuario final). Consulte `SECURITY.md` para conocer más sobre nuestro flujo de seguridad integral y regulaciones exentas.
