# Project Memory

## Core
Dark mystic theme: black bg, gold primary, crimson secondary. Cinzel headings, Inter body, Cormorant Garamond accent.
Tarot learning platform with gamification (Duolingo-inspired, not childish). Premium, feminine, symbolic.
Lessons use 5-layer pedagogy: main (required) → deepDive → extras → exercise → quiz. Students advance without consuming optional content.
Base simbólica: Rider-Waite-Smith. Leituras arquetípicas, psicológicas e esotéricas. Coerência em todas as lições.
Arcanos use ArcanoMaiorEditorial type (17 fields). Files in src/data/arcanos/. 3/22 complete.
CSS-only animations (no Framer Motion). Prefer transform/opacity. Respect prefers-reduced-motion.
Motion = revelação. Elementos entram de baixo (reveal). Easing: cubic-bezier(0.16,1,0.3,1). Loops só em elementos focais.
FREE_ARCANO_IDS = [0]. Only O Louco is free. All other arcanos, modules and features require premium subscription.
Planos: Gratuito (O Louco + Fundamentos) | Mensal R$29,90 | Anual R$197 (45% off) | Presenteado. Sem vitalício, sem trial, sem ads.

## Memories
- [Design tokens](mem://design/tokens) — Full color system: gold, crimson, mystic surfaces, HSL variables
- [Animation levels](mem://design/animation-levels) — Per-screen animation intensity (leve/média/alta/cinematográfica) + performance rules
- [Motion language](mem://design/motion-language) — Microanimation specs per element: buttons, cards, quiz, progress, premium, journeymap
- [Lesson structure](mem://features/lesson-layers) — 5-layer pedagogical model with skip logic
- [Modules](mem://features/modules) — 10 learning modules from Fundamentos to Prática Guiada
- [Editorial guideline](mem://features/editorial-guideline) — Rider-Waite-Smith como base simbólica principal
- [Arcano editorial model](mem://features/arcano-editorial-model) — 17-field standardized structure for all 22 Major Arcana
- [Premium model](mem://features/premium-model) — Official free vs premium tier: O Louco free, everything else premium
- [Official plans](mem://features/official-plans) — Final 4-tier: Gratuito, Mensal R$29,90, Anual R$197, Presenteado
- [Access control logic](mem://features/access-control-logic) — 5 states, permissions matrix, unlock/lock, gift validation, restore purchase
- [Gift access logic](mem://features/gift-access-logic) — Codes + manual grant, validation rules, admin controls, redemption history
- [Commercial architecture](mem://features/commercial-architecture) — Access tiers, gift codes, subscription states, admin metrics, pricing
- [Mobile monetization](mem://features/mobile-monetization) — IAP strategy for App Store/Google Play: receipt validation, RevenueCat, webhooks
- [Monetization](mem://features/monetization) — Subscription plans, pricing, premium states, and subscription management screens
- [Inclusive language](mem://constraints/inclusive-language) — Plataforma para qualquer pessoa, não apenas mulheres
