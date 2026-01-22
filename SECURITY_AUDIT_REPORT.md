# Security Audit Report - NeuralMarket
**Date:** 2026-01-22T05:14:17.630Z
**Standard:** Institutional-Grade (Jan 2026)
**Scanner:** Custom SAST Engine

## Security Score: C

## Executive Summary
Total Issues Found: **86**
- CRITICAL: 2
- HIGH: 4
- MEDIUM: 80

## Detailed Findings

### 1. [HIGH] Public Exposure of Private Env Var (WEB-002)
- **File:** `app/actions/executeTrade.ts:145`
- **Snippet:** `NEXT_PUBLIC_SUPABASE_ANON_KEY...`
- **Recommendation:** Review line 145. Ensure secrets are environment variables and inputs are validated.

### 2. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `app/actions/executeTrade.ts:21`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 21. Ensure secrets are environment variables and inputs are validated.

### 3. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `app/actions/executeTrade.ts:78`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 78. Ensure secrets are environment variables and inputs are validated.

### 4. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `app/actions/executeTrade.ts:98`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 98. Ensure secrets are environment variables and inputs are validated.

### 5. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `app/actions/executeTrade.ts:100`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 100. Ensure secrets are environment variables and inputs are validated.

### 6. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `app/actions/executeTrade.ts:105`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 105. Ensure secrets are environment variables and inputs are validated.

### 7. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `app/actions/executeTrade.ts:113`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 113. Ensure secrets are environment variables and inputs are validated.

### 8. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `app/actions/executeTrade.ts:167`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 167. Ensure secrets are environment variables and inputs are validated.

### 9. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `app/actions/getMarkets.ts:26`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 26. Ensure secrets are environment variables and inputs are validated.

### 10. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `app/actions/getMarkets.ts:32`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 32. Ensure secrets are environment variables and inputs are validated.

### 11. [HIGH] Public Exposure of Private Env Var (WEB-002)
- **File:** `app/actions/getTrades.ts:7`
- **Snippet:** `NEXT_PUBLIC_SUPABASE_ANON_KEY...`
- **Recommendation:** Review line 7. Ensure secrets are environment variables and inputs are validated.

### 12. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `app/actions/trade.ts:20`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 20. Ensure secrets are environment variables and inputs are validated.

### 13. [HIGH] Public Exposure of Private Env Var (WEB-002)
- **File:** `app/agents/page.tsx:9`
- **Snippet:** `NEXT_PUBLIC_SUPABASE_ANON_KEY...`
- **Recommendation:** Review line 9. Ensure secrets are environment variables and inputs are validated.

### 14. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `components/debug/TestIntentButton.tsx:48`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 48. Ensure secrets are environment variables and inputs are validated.

### 15. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `components/debug/TestIntentButton.tsx:83`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 83. Ensure secrets are environment variables and inputs are validated.

### 16. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `components/market-detail/TradePanel.tsx:59`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 59. Ensure secrets are environment variables and inputs are validated.

### 17. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `components/markets/MarketCard.tsx:85`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 85. Ensure secrets are environment variables and inputs are validated.

### 18. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `hooks/useAgentActions.ts:89`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 89. Ensure secrets are environment variables and inputs are validated.

### 19. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `hooks/useAgentActions.ts:104`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 104. Ensure secrets are environment variables and inputs are validated.

### 20. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `hooks/useAgentActions.ts:141`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 141. Ensure secrets are environment variables and inputs are validated.

### 21. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `hooks/useAgentActions.ts:176`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 176. Ensure secrets are environment variables and inputs are validated.

### 22. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `hooks/useAgentActions.ts:201`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 201. Ensure secrets are environment variables and inputs are validated.

### 23. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `hooks/useAgentActions.ts:228`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 228. Ensure secrets are environment variables and inputs are validated.

### 24. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `lib/dflow.ts:32`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 32. Ensure secrets are environment variables and inputs are validated.

### 25. [CRITICAL] Hardcoded Private Key (SEC-001)
- **File:** `lib/kalshi.ts:62`
- **Snippet:** `-----BEGIN PRIVATE KEY-----...`
- **Recommendation:** Review line 62. Ensure secrets are environment variables and inputs are validated.

### 26. [HIGH] Public Exposure of Private Env Var (WEB-002)
- **File:** `lib/supabase.ts:5`
- **Snippet:** `NEXT_PUBLIC_SUPABASE_ANON_KEY...`
- **Recommendation:** Review line 5. Ensure secrets are environment variables and inputs are validated.

### 27. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `neural-agent/src/agent.ts:110`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 110. Ensure secrets are environment variables and inputs are validated.

### 28. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `neural-agent/src/agent.ts:111`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 111. Ensure secrets are environment variables and inputs are validated.

### 29. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `neural-agent/src/agent.ts:112`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 112. Ensure secrets are environment variables and inputs are validated.

### 30. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `neural-agent/src/agent.ts:133`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 133. Ensure secrets are environment variables and inputs are validated.

### 31. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/create_demo_agents.ts:46`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 46. Ensure secrets are environment variables and inputs are validated.

### 32. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/create_demo_agents.ts:47`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 47. Ensure secrets are environment variables and inputs are validated.

### 33. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/create_demo_agents.ts:48`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 48. Ensure secrets are environment variables and inputs are validated.

### 34. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/create_demo_agents.ts:49`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 49. Ensure secrets are environment variables and inputs are validated.

### 35. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/create_demo_agents.ts:64`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 64. Ensure secrets are environment variables and inputs are validated.

### 36. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/create_demo_agents.ts:65`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 65. Ensure secrets are environment variables and inputs are validated.

### 37. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/create_demo_agents.ts:81`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 81. Ensure secrets are environment variables and inputs are validated.

### 38. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/create_demo_agents.ts:82`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 82. Ensure secrets are environment variables and inputs are validated.

### 39. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/create_demo_agents.ts:89`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 89. Ensure secrets are environment variables and inputs are validated.

### 40. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/create_demo_agents.ts:93`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 93. Ensure secrets are environment variables and inputs are validated.

### 41. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/create_demo_agents.ts:97`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 97. Ensure secrets are environment variables and inputs are validated.

### 42. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/create_demo_agents.ts:98`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 98. Ensure secrets are environment variables and inputs are validated.

### 43. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/genesis_protocol.ts:28`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 28. Ensure secrets are environment variables and inputs are validated.

### 44. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/genesis_protocol.ts:29`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 29. Ensure secrets are environment variables and inputs are validated.

### 45. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/genesis_protocol.ts:30`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 30. Ensure secrets are environment variables and inputs are validated.

### 46. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/genesis_protocol.ts:37`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 37. Ensure secrets are environment variables and inputs are validated.

### 47. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/genesis_protocol.ts:41`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 41. Ensure secrets are environment variables and inputs are validated.

### 48. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/genesis_protocol.ts:49`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 49. Ensure secrets are environment variables and inputs are validated.

### 49. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/genesis_protocol.ts:50`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 50. Ensure secrets are environment variables and inputs are validated.

### 50. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/genesis_protocol.ts:51`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 51. Ensure secrets are environment variables and inputs are validated.

### 51. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/genesis_protocol.ts:55`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 55. Ensure secrets are environment variables and inputs are validated.

### 52. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/genesis_protocol.ts:58`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 58. Ensure secrets are environment variables and inputs are validated.

### 53. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/genesis_protocol.ts:68`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 68. Ensure secrets are environment variables and inputs are validated.

### 54. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/initialize_devnet.ts:14`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 14. Ensure secrets are environment variables and inputs are validated.

### 55. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/initialize_devnet.ts:15`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 15. Ensure secrets are environment variables and inputs are validated.

### 56. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/initialize_devnet.ts:37`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 37. Ensure secrets are environment variables and inputs are validated.

### 57. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/initialize_devnet.ts:43`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 43. Ensure secrets are environment variables and inputs are validated.

### 58. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/initialize_devnet.ts:44`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 44. Ensure secrets are environment variables and inputs are validated.

### 59. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/initialize_devnet.ts:46`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 46. Ensure secrets are environment variables and inputs are validated.

### 60. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/initialize_devnet.ts:55`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 55. Ensure secrets are environment variables and inputs are validated.

### 61. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/initialize_devnet.ts:56`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 56. Ensure secrets are environment variables and inputs are validated.

### 62. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/initialize_devnet.ts:64`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 64. Ensure secrets are environment variables and inputs are validated.

### 63. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/initialize_devnet.ts:73`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 73. Ensure secrets are environment variables and inputs are validated.

### 64. [CRITICAL] Hardcoded Private Key (SEC-001)
- **File:** `scripts/sast_scanner.js:13`
- **Snippet:** `-----BEGIN PRIVATE KEY-----...`
- **Recommendation:** Review line 13. Ensure secrets are environment variables and inputs are validated.

### 65. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/verify_integrity.ts:11`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 11. Ensure secrets are environment variables and inputs are validated.

### 66. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/verify_integrity.ts:12`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 12. Ensure secrets are environment variables and inputs are validated.

### 67. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/verify_integrity.ts:29`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 29. Ensure secrets are environment variables and inputs are validated.

### 68. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/verify_integrity.ts:32`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 32. Ensure secrets are environment variables and inputs are validated.

### 69. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/verify_integrity.ts:46`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 46. Ensure secrets are environment variables and inputs are validated.

### 70. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/verify_integrity.ts:49`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 49. Ensure secrets are environment variables and inputs are validated.

### 71. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/verify_integrity.ts:51`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 51. Ensure secrets are environment variables and inputs are validated.

### 72. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/verify_integrity.ts:53`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 53. Ensure secrets are environment variables and inputs are validated.

### 73. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/verify_integrity.ts:59`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 59. Ensure secrets are environment variables and inputs are validated.

### 74. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/verify_integrity.ts:64`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 64. Ensure secrets are environment variables and inputs are validated.

### 75. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/verify_integrity.ts:66`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 66. Ensure secrets are environment variables and inputs are validated.

### 76. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/verify_integrity.ts:69`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 69. Ensure secrets are environment variables and inputs are validated.

### 77. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/verify_integrity.ts:76`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 76. Ensure secrets are environment variables and inputs are validated.

### 78. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/verify_integrity.ts:78`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 78. Ensure secrets are environment variables and inputs are validated.

### 79. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/verify_integrity.ts:83`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 83. Ensure secrets are environment variables and inputs are validated.

### 80. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/verify_integrity.ts:88`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 88. Ensure secrets are environment variables and inputs are validated.

### 81. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/verify_integrity.ts:90`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 90. Ensure secrets are environment variables and inputs are validated.

### 82. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/verify_integrity.ts:95`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 95. Ensure secrets are environment variables and inputs are validated.

### 83. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/verify_integrity.ts:101`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 101. Ensure secrets are environment variables and inputs are validated.

### 84. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/verify_integrity.ts:103`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 103. Ensure secrets are environment variables and inputs are validated.

### 85. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/verify_integrity.ts:107`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 107. Ensure secrets are environment variables and inputs are validated.

### 86. [MEDIUM] Console Log in Production (WEB-003)
- **File:** `scripts/verify_integrity.ts:108`
- **Snippet:** `console.log(...`
- **Recommendation:** Review line 108. Ensure secrets are environment variables and inputs are validated.


## Manual Audit Notes (Architectural Review)
- **Encryption:** Checked for RSA-PSS usage in Kalshi Client.
- **Access Control:** Verified private key management in server-side only files.
- **Dependencies:** Checked sensitive packages.
