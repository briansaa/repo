# NEXUS AI - Red de Síntesis Neural Avanzada

NEXUS AI es una plataforma SaaS premium para la generación de imágenes mediante inteligencia artificial, diseñada para ofrecer una experiencia inmersiva y de alta fidelidad.

## 🚀 Características Principales

- **AI Studio:** Interfaz avanzada para la síntesis de imágenes con presets tácticos y gestión de sesiones.
- **Mando Central:** Panel de administración robusto para el monitoreo de tráfico neural, usuarios y actividad en tiempo real.
- **Arquitectura Solaris:** Sistema optimizado para procesamiento distribuido y baja latencia.
- **Estética Glassmorphism:** Diseño visual de vanguardia con efectos de cristal y animaciones fluidas.

## 🛠️ Tecnologías

- **Frontend:** React 19, Material UI, Framer Motion, Vite.
- **Backend:** Django, Django REST Framework, PostgreSQL (o SQLite por defecto).
- **IA:** Integración con clústeres de generación latente (AETERNA v5.0 CORE).

## ⚙️ Configuración del Sistema

### Requisitos Previos
- Node.js (v18+)
- Python (3.10+)
- Git

### Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/nexus-ai.git
   cd nexus-ai
   ```

2. **Configuración del Backend:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```

3. **Configuración del Frontend:**
   ```bash
   cd ../repo
   npm install
   npm run dev
   ```

## 📜 Licencia

© 2026 AETERNA CORP. Todos los derechos reservados.
