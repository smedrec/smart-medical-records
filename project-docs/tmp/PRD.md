# smedrec-app - Product Requirements Document

## 1. Executive Summary
**Product Vision**: Create an integrated healthcare registry enabling holistic patient care across disciplines and languages.  
**Goals**:  
1. Centralize client health data with custom forms  
2. Streamline therapist-assistant collaboration  
3. Support 50+ languages by launch  
4. Achieve HIPAA/GDPR compliance  

**Target Audience**:  
- Licensed therapists (primary users)  
- Medical assistants (secondary users)  
- Multilingual healthcare organizations  

**Key Value Propositions**:  
✓ Unified client health profiles  
✓ No-code form builder for assessments  
✓ Real-time translation workflow  
✓ Role-based access controls  

**Success Metrics**:  
- 80% therapist onboarding completion  
- <2s average API response time  
- 90% form template adoption rate  

**Timeline**:  
- Phase 1 (Core MVP): 3 months  
- Phase 2 (Intl+Customization): 5 months  
- Full Launch: Q1 2026  

## 2. Problem Statement
**Current Challenges**:  
- 68% therapists use 3+ disconnected systems (EMR, spreadsheets, notes)  
- Limited multilingual support in existing solutions  
- No standardized holistic assessment templates  

**Market Opportunity**:  
- $12B global behavioral health market growing at 7.3% CAGR  
- 300% increase in cross-border teletherapy since 2020  

**User Needs**:  
- "I need one system that shows client's medical AND social history" - Therapist survey  
- "Spend 3hrs/day translating forms manually" - EU clinic manager  

**Business Goals**:  
- Capture 15% of multilingual therapy market in 24 months  
- $29/user/month subscription model  

**Competitive Edge**:  
- vs SimplePractice: Better customization  
- vs TherapyNotes: Superior internationalization  

## 3. Product Scope  
**Core Features**:  
1. Therapist Portal (License verification, client assignment)  
2. Assistant Dashboard (Bulk data entry, alerts)  
3. Client 360° Profile (Medical history + social determinants)  
4. Form Builder (Drag-and-drop, 30+ field types)  
5. i18n Engine (Right-to-left support, dynamic content loading)  

**Personas**:  
- Dr. Paula (Psychiatrist needing cross-disciplinary views)  
- Alex (Medical assistant managing 200+ clients)  
- Maria (Patient with complex comorbidities)  

**Out of Scope**:  
- Real-time video conferencing  
- Insurance billing modules  
- Mobile app (web-first approach)  

**Future Roadmap**:  
- AI-powered care recommendations  
- Wearable device integration  

## 4. Technical Requirements  
**Architecture**:  
- Next.js 15 App Router (Frontend)  
- Node.js + Hono (BFF Layer)  
- PostgreSQL (Primary DB)  
- Redis (Caching layer)  

**Key Dependencies**:  
- react-hook-form + Zod for form validation  
- i18next for translations  
- TanStack Table for data grids  

**Performance**:  
- LCP <1.2s  
- API latency <800ms p95  

**Security**:  
- OAuth2 + SAML integration  
- AES-256 encryption at rest  
- HIPAA-compliant audit logs  

**Scalability**:  
- Horizontal scaling via Kubernetes  
- 10k concurrent user target  

## 5. Feature Specifications  
### Feature 5.1: Therapist Management  
**User Story**:  
"As clinic director, I need to verify licenses before granting system access"  

**Acceptance Criteria**:  
- License number validation against 10+ country databases  
- PDF certificate upload with OCR verification  
- Role-based permissions (owner/practitioner/assistant)  

**Tech Constraints**:  
- Depends on national license APIs  
- Requires WebAssembly for OCR  

**Priority**: P0  
**Effort**: 3 dev-weeks  

### Feature 5.2: Custom Form Builder  
**User Story**:  
"As pediatric therapist, I want to create sensory processing assessments without coding"  

**Acceptance Criteria**:  
- Drag-and-drop interface with 30+ components  
- Conditional logic builder  
- PDF/CSV export templates  

**Dependencies**:  
- React Flow for visual editor  
- JSPDF for exports  

**Priority**: P1  
**Effort**: 5 dev-weeks  

## 6. Non-Functional Requirements  
**Accessibility**:  
- WCAG 2.1 AA compliance  
- Screen reader testing with JAWS  

**Browser Support**:  
- Chrome, Safari, Firefox (latest 2 versions)  

**Compliance**:  
- GDPR Article 30 records  
- HIPAA BA agreements  

**Intl Requirements**:  
- RTL language support  
- Date/number formatting per locale  

## 7. Implementation Plan  
**Phase 1 (Core Profile)**:  
- Week 1-6: Auth system + basic profile  
- Week 7-12: Form builder MVP  

**Phase 2 (Intl)**:  
- Week 13-18: i18n implementation  
- Week 19-20: Security audit  

**Testing Strategy**:  
- Cypress E2E tests for critical paths  
- Lokalise for translation validation  

**Launch Criteria**:  
- Penetration test report cleared  
- 500+ pre-registered users  

## 8. Success Metrics  
**KPIs**:  
- 70% weekly active therapists  
- <5% form abandonment rate  

**Feedback Loops**:  
- In-app NPS surveys  
- Quarterly user interviews  

**Iteration Cadence**:  
- Bi-weekly sprint releases  
- Major version every quarter  
