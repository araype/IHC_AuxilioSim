**Product Name:** AuxilioSim (Simulador Interactivo de Primeros Auxilios en el Hogar)  
**Status:** In Review / Ready for Engineering & UI Implementation  
**Target Platform:** Mobile-First WebApp (Responsive Touchscreen / Progressive Web App - PWA)  
**Primary Language:** Spanish (ES-LA / ES-ES)  

---

## 1. Executive Summary & Product Vision

### 1.1 Problem Statement
En situaciones de accidentes domésticos (quemaduras por líquidos hirviendo, atragantamientos en comidas o cortes con hemorragia), las personas comunes suelen reaccionar con pánico, titubeo o aplicando mitos nocivos tradicionales (hielo directo, pasta dental, vinagre o pomadas grasas). La lectura de manuales o guías estáticas no genera memoria muscular ni prepara emocionalmente al usuario para tomar decisiones en los primeros **15 segundos críticos**.

### 1.2 Product Vision
**AuxilioSim** es una webapp interactiva de entrenamiento de respuesta rápida que transforma el aprendizaje de primeros auxilios en simulaciones táctiles en primera persona de alta fidelidad. A través de microinteracciones hápticas, cronómetros de estrés y feedback clínico inmediato (basado en estándares ERC, AHA y Cruz Roja), entrena la memoria procedimental de cualquier miembro del hogar en menos de 60 segundos por escenario.

---

## 2. Target Audience & Personas

* **Primary Persona - "Padre/Madre Previsor" (30–48 años):** Desea proteger a sus hijos y mayores ante accidentes cotidianos en la cocina o comedor; necesita instrucciones claras, libres de jerga médica compleja y sin miedo a equivocarse.
* **Secondary Persona - "Joven Independiente o Cuidador" (18–35 años):** Vive solo o comparte piso; busca aprendizaje gamificado, interactivo y en formato móvil instantáneo sin necesidad de instalar apps pesadas.
* **Tertiary Persona - "Docente o Monitor de Capacitación":** Utiliza simuladores web rápidos para verificar la retención procedimental de alumnos o empleados en protocolos de salud y seguridad.

---

## 3. Product Goals & Key Success Metrics (OKRs / KPIs)

### 3.1 Business & Impact Goals
* Dotar a la población de reflejos inmediatos de soporte vital básico en el entorno doméstico.
* Erradicar activamente los 5 mitos lesivos más frecuentes en quemaduras y asfixia.
* Convertirse en la herramienta web referente de microcapacitación recomendada por instituciones médicas.

### 3.2 Key Metrics (KPIs)
* **Tiempo de Decisión (Time-to-Action):** < 15 segundos desde el inicio del incidente hasta la primera acción correcta.
* **Tasa de Desmitificación:** > 95% de usuarios que rechazan hielo/dentífrico tras 2 sesiones.
* **Tasa de Retención Procedimental:** > 85% de aprobación en auditorías de checklist AHA a los 7 días de práctica.
* **Task Completion Rate:** > 80% de finalización en los 3 escenarios esenciales.

---

## 4. Information Architecture & Core User Flow

```
[ Hub de Escenarios (Progreso, Triage, Ajustes) ]
         │
         ├──► [ Escenario 01: Quemadura en la Cocina ]
         │         ├─ Triage inicial y detección de síntomas
         │         ├─ Advertencia activa antimito (Regla de oro)
         │         ├─ Interacción táctil: Apertura de grifo y flujo continuo (15-20 min)
         │         └─ Llamada 112/911 o inspección dérmica
         │
         ├──► [ Escenario 02 / Módulo Práctica: Maniobra de Heimlich ]
         │         ├─ Reconocimiento del signo universal de asfixia
         │         ├─ Guía anatómica (2 dedos sobre el ombligo)
         │         └─ Gatillo cinemático táctil (Swipe vertical 85-100 N en "J")
         │
         ├──► [ Escenario 03: Corte y Botiquín ]
         │         ├─ Apertura aséptica del botiquín doméstico
         │         └─ Presión directa hemostática con gasa y elevación
         │
         └──► [ Dashboard de Resultados & Feedback Clínico ]
                   ├─ Biomarcadores y tiempo de reacción cuantitativo
                   ├─ Checklist de procedimientos acreditados (AHA/Cruz Roja)
                   ├─ Microaprendizaje preventivo accionable (+XP)
                   └─ Exportación de certificado / compartir informe
```

---

## 5. Functional Requirements (FR)

### FR-01: Hub de Escenarios y Gestión de Perfil
* **FR-01.1:** Mostrar el porcentaje mensual de preparación del hogar (ej. 65%) con acceso a historial de entrenamientos.
* **FR-01.2:** Catálogo de escenarios con insignias de severidad clínica (Triage Nivel 1 a 3) y estado de completitud.
* **FR-01.3:** Configuración de inmersión accesible:
  * Toggle *Instrucciones por voz* (locución asistida paso a paso).
  * Toggle *Modo estrés / Límite de tiempo (15s)* con feedback háptico.
  * Acceso al modal tutorial de gestos táctiles (toque, swipe, pulsación prolongada).

### FR-02: Escenario Quemadura Térmica (Cocina)
* **FR-02.1:** HUD en tiempo real con cronómetro regresivo, nivel de dolor tisular (escala 0-10) y temperatura local (°C).
* **FR-02.2:** Hotspot interactivo sobre el grifo monomando con retroalimentación sonora de agua corriendo.
* **FR-02.3:** Botón de acción con interacción mantenida (*Long-press*) para simular la irrigación continua con barra de llenado 0-100%.
* **FR-02.4:** Cuadro de alerta clínica visible (*"Regla de Oro: No uses remedios caseros"*) sancionando implícitamente el uso de pasta dental, hielo o grasas.
* **FR-02.5:** Acciones secundarias inmediatas: Inspección de flictenas y botón de enlace directo con llamada a servicios de emergencia.

### FR-03: Módulo de Maniobras Críticas (Atragantamiento / Hemorragia)
* **FR-03.1:** Selector por pestañas entre maniobras de desobstrucción (Heimlich) y contención de hemorragias.
* **FR-03.2:** Guía anatómica vectorial que indique el vector de fuerza exacto (adentro y arriba, en forma de "J").
* **FR-03.3:** Componente táctil de empuje cinemático:
  * Detección de velocidad y desplazamiento vertical de gesto (*Swipe up*).
  * Validación en rango óptimo (85 a 100 Newtons). Si el gesto es insuficiente (< 80 N), solicitar repetición con feedback explicativo.
* **FR-03.4:** Registro de maniobra validada hacia el resumen de métricas.

### FR-04: Retroalimentación Diagnóstica y Gamificación
* **FR-04.1:** Tarjeta de impacto clínico con resumen de efectividad del enfriamiento o desobstrucción.
* **FR-04.2:** Comparativa visual entre la meta clínica (< 15.0 s) y el tiempo real del usuario.
* **FR-04.3:** Desglose auditado de procedimientos (protocolos Cruz Roja / AHA) con sistema de puntos y experiencia (+100 pts, +150 pts).
* **FR-04.4:** Tarjeta de microaprendizaje correctivo/preventivo (ej. "retirar anillos y pulseras oportunamente").
* **FR-04.5:** Botón para generar tarjeta compartible en redes o mensajería (WhatsApp/Telegram).

---
