# ⚒️ Documentación ⚒️

Este es un repositorio simple sobre HTML, CSS, SASS y JavaScript en el cual se desarrollara un aplicativo que le permitira al usuario la administación de tareas.

## Comenzando 🚀

Para clonar este repositorio dirígete a la carpeta en la que quieres guardarlo y ejecuta el siguiente comando en la terminal

```
git clone https://github.com/CristianDavid313/ToDoApp.git
```

## Estructura del código 📢

* En el archivo **index.html** encontrarás la estructura básica de todo el aplicativo y cómo está organizada.

* En la carpeta **css** encontrarás los estilos tanto en CSS como en SASS.

* En la carpeta **js** encontrarás la lógica que permite guardar los datos en LocalStorage, lo cual permite a su vez no depender de una base de datos para el almacenamiento de las tareas.

## Características principales ⚒️

* Gracias a **LocalStorage** podemos almacenar los datos de manera local sin necesidad de una base de datos.

* Las tareas pueden ser marcadas como completadas y el usuario es capaz de filtrar entre **Todas las tareas**, **Pendientes** y **Completadas**.

* En caso de necesitarlo, el usuario puede modificar las tareas o eliminarlas si así lo requiere.

* En caso de agregar un campo vacío, el aplicativo mostrará una alerta en la cual se mostrará el mensaje **Debes escribir algo**.

## Flujo de trabajo ⚒️

* Agregar una tarea (función **addAgenda**):

Cuando el usuario agrega una tarea, se crea un nuevo **li** en el DOM que contiene:

Un botón de check (para marcar como completada).
Un párrafo **p** con el texto de la tarea.
Botones para editar y eliminar la tarea.

* Carga de tareas (función **getAgenda**):

Al cargar la página, el navegador recupera las tareas que ya habían sido almacenadas en **LocalStorage**.

Si hay tareas guardadas, se cargan y se mostraran en el DOM. Si no, no habra ningún tipo de información disponible.

* Editar una tarea (función **editarTarea**):

Al hacer clic en el botón de editar, el texto de la tarea puede ser modificado.

El nuevo texto se guarda en **LocalStorage**.

* Eliminar una tarea (función **eliminarDeLocalStorage**):

Al hacer clic en el botón de eliminar, la tarea se elimina tanto del DOM como de **LocalStorage**.