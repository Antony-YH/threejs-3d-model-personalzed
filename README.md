# WebGL Experience - Visor de Animaciones 3D con Mixamo

Este es un proyecto web interactivo que he desarrollado para visualizar y controlar un modelo 3D animado utilizando la librería **Three.js**. Los modelos y animaciones en formato FBX fueron obtenidos de **Mixamo**.

En esta aplicación, he diseñado una interfaz moderna de estilo *Glassmorphism* (efecto cristal) que flota sobre un entorno 3D tipo estudio fotográfico. El objetivo principal ha sido lograr transiciones suaves entre múltiples movimientos interactuando a través del teclado y de una interfaz gráfica de usuario (GUI).

## ✨ Características Principales

* **Carga Optimizada de Recursos:** Implementé la separación entre el modelo base (malla/skin) y los esqueletos de animación. Esto hace que el proyecto sea mucho más ligero.
* **Transiciones Suaves (Crossfade):** He programado un cambio fluido entre animaciones usando `fadeIn` y `fadeOut`, evitando saltos bruscos en el renderizado del esqueleto.
* **Control por Teclado:** Se pueden activar 5 movimientos distintos presionando las teclas numéricas del `1` al `5`.
* **Interfaz de Usuario (UI) Sincronizada:** Al cambiar una animación, tanto el menú lateral de cristal como el panel superior derecho de configuración (`lil-gui`) se actualizan dinámicamente para reflejar el estado actual.
* **Iluminación Cinemática:** El entorno de la escena (escenario gris mate) cuenta con luces principales y luces de recorte (*Rim Lights* en blanco frío) para crear un alto contraste y definir perfectamente la silueta del personaje.
* **Monitor de Rendimiento:** Inclusión de la herramienta `Stats` para verificar los FPS de la ejecución en tiempo real.

## 📂 Estructura del Proyecto

El código fuente está organizado de la siguiente manera:

```text
📁 root
├── 📁 assets
│   ├── 📁 build
│   │   ├── 📄 three.core.js
│   │   └── 📄 three.module.js
│   ├── 📁 css
│   │   └── 📄 main.css
│   ├── 📁 img
│   │   └── 📄 favicon.png
│   ├── 📁 js
│   │   └── 📄 main.js (Lógica principal de Three.js y control de animaciones)
│   ├── 📁 jsm (Addons de Three.js: OrbitControls, FBXLoader, lil-gui, stats)
│   └── 📁 models
│       └── 📁 fbx
│           ├── 📄 Brooklyn Uprock.fbx
│           ├── 📄 Dancing.fbx
│           ├── 📄 Fall Flat.fbx
│           ├── 📄 Kettlebell Swing.fbx
│           ├── 📄 Punching Bag.fbx
│           ├── 📄 Samba Dancing.fbx
│           └── 📄 personaje_base.fbx (Modelo principal con la malla)
├── 📄 index.html (Estructura base, import maps y UI con Bootstrap 5)
└── 📄 README.md
```

## 🎮 Controles y Uso

Una vez que la aplicación carga, la animación por defecto es Brooklyn Uprock. Puedes rotar la cámara arrastrando el ratón y hacer zoom con la rueda del ratón (OrbitControls).

Para cambiar las animaciones de manera suave, presiona las siguientes teclas:

* 1 - Brooklyn Uprock

* 2 - Kettlebell Swing

* 3 - Dancing

* 4 - Punching Bag

* 5 - Fall Flat

Nota: También puedes usar el panel desplegable de Configuración 3D ubicado en la esquina superior derecha.


## 🚀 Instalación y Ejecución Local

Debido a las políticas de seguridad de los navegadores web (CORS) con la importación de módulos y la carga de archivos externos (como los .fbx), este proyecto debe ejecutarse a través de un servidor local, no abriendo el index.html directamente.

Opciones de ejecución:

VS Code: Instala la extensión Live Server, haz clic derecho sobre index.html y selecciona "Open with Live Server".

Python: Si tienes Python instalado, abre una terminal en la raíz del proyecto y ejecuta:

* **Bash**
* **python -m http.server**

* **Node.js: Usando un paquete como http-server:**

* **Bash**
* **npx http-server**


## 🛠️ Tecnologías Utilizadas

HTML5 / CSS3

Bootstrap 5 (Para la estructuración de la interfaz)

JavaScript (ES6 Modules)

Three.js (WebGL Rendering)

lil-gui (Interfaz de variables)

Mixamo (Modelos y animaciones 3D)

## Programador

Desarrollado por: Antonio Yáñez Hernández.
Materia: Graficacion
Estudiante de Ingeniería en Sistemas Computacionales | Tecnológico Nacional de México