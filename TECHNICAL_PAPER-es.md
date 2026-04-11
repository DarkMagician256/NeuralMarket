# Sentinely - Technical Paper Oficial
**Versión del Documento:** 2.5 (Institutional Hardening / Compliance First)
**Ecosistema:** Solana, ElizaOS, Kalshi, Next.js, DFlow Proof
**Idioma:** Español

---

## 1. Resumen Ejecutivo (Abstract)

**Sentinely** se ha consolidado como la infraestructura definitiva de "Canonical Liquidity Layer" para agentes de IA en mercados de predicción reales. Actuando como un **Proveedor de Software Estricto (SaaS)**, Sentinely orquesta una arquitectura híbrida que conecta el ecosistema de $2T de criptoactivos (vía Solana) con la liquidez regulada de Kalshi. 

En esta versión 2.5, el protocolo ha sido "endurecido" para cumplir con los estándares institucionales más exigentes, integrando:
1. **Hardened Compliance**: Geolocalización por Edge y validación de identidad descentralizada vía DFlow Proof.
2. **Real-Time Execution**: Integración nativa con la API v2 de Trading de Kalshi (REST authenticated).
3. **Monetización Transparente**: Atribución de ingresos mediante Builder Codes (`ORACULO_V2`) inyectados en cada orden.

---

## 2. Arquitectura de los 5 Pilares (Hardened Infrastructure)

### Pilar 1: Capa de Cumplimiento Normativo (Compliance Engine)
Sentinely implementa una capa de protección dual obligatoria para operar en entornos regulados:
- **Geo-Blocking (Vercel Edge)**: Middleware de baja latencia que intercepta todas las peticiones y bloquea el acceso desde EE.UU. y jurisdicciones OFAC, garantizando el cumplimiento del Acuerdo de Miembros de Kalshi.
- **DFlow Proof KYC Gate**: Una puerta de enlace de identidad (Proof of Personhood) que exige a los usuarios una verificación previa antes de interactuar con el panel de trading.

### Pilar 2: Motor de Ejecución en Tiempo Real (Kalshi API v2)
A diferencia de prototipos previos, Sentinely ahora gestiona órdenes reales directamente en los libros de Kalshi:
- **RSA-PSS Authentication**: Implementación robusta de firmas criptográficas RSA-PSS (SHA-256) para segurizar todas las transacciones `POST/DELETE`.
- **Order Management**: Soporte completo para órdenes de Mercado y Límite, gestión de posiciones abiertas, monitoreo de PnL no realizado y balance de plataforma en USDC.
- **Builder Code Attribution**: Inyección sistemática del código `ORACULO_V2` en los parámetros `referral_code` y `client_order_id` para garantizar la atribución de ingresos al protocolo.

### Pilar 3: Capa Cognitiva Inmutable (Multi-LLM ElizaOS)
La inteligencia de los agentes orquestada por ElizaOS procesa flujos de datos en tiempo real de Kalshi para generar recomendaciones.
- **Sentiment local (DeepSeek-R1)**: Procesamiento de grandes volúmenes de contexto sin coste asíncrono.
- **Validation (o1/Claude)**: Auditoría rigurosa de riesgo antes de enviar el intent de trading a la capa de ejecución.

### Pilar 4: Infraestructura No Custodial (Smart Contracts Anchor)
El programa **NeuralVault** en Solana gestiona la custodia de las licencias y el registro inmutable de las operaciones:
- **Seguridad**: Program Derived Addresses (PDAs) vinculadas 1:1 al usuario.
- **Licencias**: Cobro automático de *Software License Fees* del 0.5% por operación, inyectado en la lógica del contrato.

### Pilar 5: Interfaz de Comando Institucional (Next.js 15)
Un dashboard de alto rendimiento diseñado para usuarios avanzados y Hedge Funds:
- **Neural Performance Dashboard**: Visualización en tiempo real de exposiciones, balance en USDC de Kalshi y balance en SOL de la wallet.
- **Cortex Live Insight**: Terminal de telemetría que muestra el "pensamiento" de la IA antes de cada trade.

---

## 3. Seguridad y Auditoría

Sentinely aplica el principio de **"Blackbox Audit"**:
- Todas las ejecuciones de la IA generan un rastro de auditoría verificable.
- El uso de Irys para almacenamiento descentralizado de logs asegura que las decisiones de los agentes sean inalterables y transparentes para los auditores regulatorios.

---

## 4. Viabilidad y Estatus de Despliegue

**Status:** `Release Candidate - Institutional Grade`
Sentinely ya no es un MVP. Es un protocolo listo para Mainnet que soluciona el problema de la liquidez para agentes autónomos en mercados reales, cumpliendo con todas las restricciones jurisdiccionales y ofreciendo un modelo de negocio claro para Kalshi y los desarrolladores mediante Builder Codes.
 la robustez legal de una agencia de proveeduría SaaS Web3.
