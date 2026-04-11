# 🧠 Sentinely - Local AI Setup (Gratis)

Este documento explica cómo ejecutar el agente **Oraculo Sentient** utilizando **DeepSeek R1** (o cualquier modelo Ollama) localmente, eliminando costos de API de OpenAI.

## ✅ Prerrequisitos

1. **Ollama instalado**: [Descargar Ollama](https://ollama.com)
2. **Bun Runtime** (Recomendado): El proyecto está optimizado para Bun.
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```
3. **Modelo DeepSeek R1**:
   ```bash
   ollama pull deepseek-r1-8b
   ```

## 🚀 Cómo Iniciar el Bot (Modo Local)

Desde la carpeta `neural-agent` y usando **Bun**:

```bash
# Instalar dependencias primero si no lo has hecho
pnpm install

# Iniciar agente local
pnpm run start:local
```

> **Nota:** Si usas Node.js en lugar de Bun, podrías necesitar configuración extra para módulos ESM. Se recomienda encarecidamente usar Bun.

## ⚙️ Configuración

El archivo `.env` en `neural-agent/` controla los parámetros locales:

```env
# Activar modo local
USE_LOCAL_AI=true

# URL de Ollama (por defecto es localhost:11434)
OLLAMA_SERVER_URL=http://localhost:11434

# Modelo a utilizar
OLLAMA_MODEL=deepseek-r1-8b:latest
# OLLAMA_MODEL=qwen2.5:0.5b (para PCs más lentas)
```

## 📊 Beneficios

| Característica | Modo Cloud (Railway) | Modo Local (Tu PC) |
|----------------|----------------------|--------------------|
| **Costo**      | $$$ (OpenAI API)     | **$0 (Gratis)**    |
| **Privacidad** | Datos van a OpenAI   | **100% Privado**   |
| **Velocidad**  | Rápido               | Depende de tu GPU  |
| **Setup**      | Simple               | Requiere Ollama    |

## 🛠️ Troubleshooting

**Error: "Connection refused"**
- Asegúrate de que Ollama esté corriendo: `ollama serve`

**Error: "Model not found"**
- Ejecuta `ollama list` para ver tus modelos
- Ejecuta `ollama pull <nombre-modelo>` si falta

**Lentitud extrema**
- DeepSeek R1 8B requiere ~12GB RAM/VRAM.
- Si va lento, cambia `OLLAMA_MODEL` a `qwen2.5:1.5b` o `llama3.2`.
