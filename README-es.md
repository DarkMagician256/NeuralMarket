# NeuralMarket

**La Primera Interfaz Híbrida de Mercados de Predicción con IA en Solana.**

![Solana](https://img.shields.io/badge/Solana-Devnet-blueviolet?style=for-the-badge&logo=solana)
![DFlow](https://img.shields.io/badge/DFlow-Integrated-blue?style=for-the-badge)
![Kalshi](https://img.shields.io/badge/Kalshi-Regulated-green?style=for-the-badge)
![AI](https://img.shields.io/badge/AI-ElizaOS%20|%20Ollama-orange?style=for-the-badge)

---

## 🚀 ¿QUÉ ES NEURALMARKET?

**NeuralMarket** es una interfaz completa de mercados de predicción desplegada sobre Solana, diseñada para servir de puente entre el vasto ecosistema de liquidez en cripto (Solana) y el mercado de predicciones regulado de Kalshi.

Al integrar **Agentes Autónomos de Inteligencia Artificial (basados en ElizaOS)** con la **velocidad de ejecución y bajo costo de Solana**, ofrecemos un terminal institucional, de grado bancario, para comerciantes soberanos que buscan automatizar estrategias de arbitraje y predicción.

---

## ✨ CARACTERÍSTICAS PRINCIPALES

- ✅ **Monetización On-Chain Integrada:** Cada agente desplegado paga una tarifa de protocolo automatizada y programática del **0.05 SOL** procesada directamente por un smart contract.
- ✅ **Arquitectura de Agentes de IA Híbrida:** Soporta IA en la Nube (OpenAI) para el máximo rendimiento cognitivo, o **IA Soberana Local (DeepSeek R1 vía Ollama)** para usuarios institucionales que previenen la fuga de datos confidenciales.
- ✅ **Telemetría Inteligente (Sentient Logs):** El sistema proyecta la cadena de pensamientos lógicos del agente en tiempo real (Synapse Logs) directo al dashboard, brindando 100% de transparencia en por qué se toma cada decisión.
- ✅ **Integración de Billeteras Web3:** Compatibilidad nativa con Phantom, Solflare, y WalletConnect a través de los estandarizados Web3 Wallet Adapters de Solana.
- ✅ **Liquidación de Órdenes Híbrida:** API v2 en tiempo real de Kalshi, conectada mediante DFlow y Jupiter para el flujo de pagos inter-cadena.
- ✅ **Contratos Inteligentes "Neural Vault":** Gestión completa en cadena del ciclo de vida del agente: creación, ejecución de intenciones de mercado, telemetría de PNL (Ganancias y Pérdidas), inactivación / reactivación segura.

---

## 🛠️ STACK TECNOLÓGICO

### Frontend
- **Framework:** Next.js 16 (App Router), React 19.
- **Estilos e UI:** Tailwind CSS 4, Three.js / React Three Fiber (Visualizaciones 3D dinámicas).
- **Control de Estado y Datos:** SWR, Supabase (Persistencia Off-chain).

### Backend de la IA (Agente "Oraculo Sentient")
- **Motor Cognitivo:** ElizaOS (@elizaos/core).
- **Procesadores LLM:** OpenAI o servidor Ollama autohospedado con DeepSeek R1.
- **Acceso a Mercados:** SDK de Kalshi, Adaptadores custom de DFlow.
- **Runtime:** Bun / TSX para inicialización rápida del Agente.

### Blockchain y Nodos
- **Contratos:** Rust puro mediante el framework Anchor (versión 0.32.1).
- **Conectividad:** `@solana/web3.js` (@1.98.4), Anchor Bankrun.

---

## ⚙️ CÓMO EMPEZAR RÁPIDAMENTE (INSTRUCCIONES DE DESARROLLO)

Asegúrate de contar con `pnpm`, `bun`, `rust`, `solana-cli` y `anchor` instalados.

### 1. Clonación e Instalación

```bash
git clone https://github.com/tu-repo/NeuralMarket.git
cd NeuralMarket
pnpm install
```

### 2. Configuración de Entorno

Hay multiples archivos `.env` a configurar:
- En la raíz (.env.local): Supabase, Variables RPC de Solana.
- En `neural-agent/.env`: Claves OPenAI, URL de Ollama, y Credenciales temporales Kalshi.

### 3. Ejecutar los Smart Contracts Localmente (Anchor)

```bash
cd anchor
anchor test
```
*Esto asegurará y validará que la lógica de cobro de 0.05 SOL funciona correctamente en tu nodo local validator.*

### 4. Lanzamiento de la Aplicación de React / Next.js

En una nueva terminal, levanta el frontend:

```bash
pnpm run dev
```
(El sitio estará corriendo sobre `http://localhost:3000`)

### 5. Lanzamiento del Agente Autónomo (Oraculo Sentient)

Abre otra sesión de terminal y navega al Agente:

```bash
cd neural-agent
bun run src/agent.ts  # Inicia las rutinas de telemetría y conexión a ElizaOS
```

Una vez en línea, el bot emitirá logs con "[TELEMETRY]" y analizará en tiempo real eventos de alta volatilidad y predecirá tendencias globales, transmitiendolas inmediatamente al frontend para su ejecución mediante el **Neural Vault**.

---

## 🧪 TESTING

El proyecto contiene un robusto set de pruebas:
- **Unitarias y UI:** Vitest `pnpm run test:ui`
- **End-to-End (E2E):** Playwright `pnpm run test:e2e`
- **Contratos Inteligentes:** Anchor y Chai `pnpm run test:anchor`

---

## 📜 LICENCIA Y MARCO LEGAL

Este proyecto utiliza licencias y frameworks de uso de datos limitados. Además incluye exclusiones de responsabilidad y regulaciones para Inteligencias Artificiales aplicadas como servicios financieros según parámetros definidos en la exención "Digital Utility" implementado para la robustez Fintech.
