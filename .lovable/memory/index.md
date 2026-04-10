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
7 estados de assinatura: free, monthly_active, annual_active, gift_active, expired, cancelled_with_access, cancelled_expired.
Monetização 100% fechada. Pendente apenas integração IAP (RevenueCat) para mobile.

## Memories
- [**🏛 Product Bible**](mem://product-bible) — Complete product document: identity, course, beta, arcanos vivos, monetization, admin, mobile, stack, status
- [Design tokens](mem://design/tokens) — Full color system: gold, crimson, mystic surfaces, HSL variables
- [Animation levels](mem://design/animation-levels) — Per-screen animation intensity (leve/média/alta/cinematográfica) + performance rules
- [Motion language](mem://design/motion-language) — Microanimation specs per element: buttons, cards, quiz, progress, premium, journeymap
- [Lesson structure](mem://features/lesson-layers) — 5-layer pedagogical model with skip logic
- [Editorial guideline](mem://features/editorial-guideline) — Rider-Waite-Smith como base simbólica principal
- [Arcano editorial model](mem://features/arcano-editorial-model) — 17-field standardized structure for all 22 Major Arcana
- [Arcano Vivo system](mem://features/arcano-vivo-system) — 5 phases, 3 intensity levels, body/voice/gesture specs
- [Arcano Vivo screen](mem://features/arcano-vivo-screen) — Reusable component architecture for lesson screens
- [Final monetization](mem://features/final-monetization) — Plans, 7 states, flows, admin, revenue, pending IAP
- [Subscription states](mem://features/subscription-states) — 7 states with access matrix, UI display, CTAs, admin view
- [Restore & reactivation](mem://features/restore-reactivation) — Restore purchase flow, expired/cancelled handling
- [Gift access logic](mem://features/gift-access-logic) — Codes + manual grant, validation rules, admin controls
- [Official plans](mem://features/official-plans) — Gratuito, Mensal R$29,90, Anual R$197, Presenteado
- [Beta setup](mem://features/beta-setup) — Auth flow, DB tables, beta badge, feedback, bottom nav
- [Mobile monetization](mem://features/mobile-monetization) — IAP strategy: RevenueCat, receipt validation, webhooks
- [Inclusive language](mem://constraints/inclusive-language) — Plataforma para qualquer pessoa, não apenas mulheres
