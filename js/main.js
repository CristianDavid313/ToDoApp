// Constantes
const agendaEntrada = document.querySelector(".entrada");
const agendaEnviar = document.querySelector(".enviar");
const agendaLista = document.querySelector(".lista");
const agendaFiltro = document.getElementById("filter");

// Eventos
agendaEnviar.addEventListener("click", addAgenda);
document.addEventListener("DOMContentLoaded", getAgenda);
agendaFiltro.addEventListener("change", filtrarTareas);

// Funciones
function addAgenda(event) {
  event.preventDefault();

  if (agendaEntrada.value === "") {
    alert("Debes escribir algo");
    return;
  }

  const newAgenda = document.createElement("li");
  newAgenda.classList.add("item");

  // Crear el texto de la tarea
  const taskText = document.createElement("p");
  taskText.innerText = agendaEntrada.value;

  // Botón "check"
  const checked = document.createElement("button");
  checked.innerHTML = '<i class="fa-regular fa-square"></i>';
  checked.classList.add("check-btn");
  checked.addEventListener("click", () =>
    newAgenda.classList.toggle("completed")
  );

  // Botón "edit"
  const edit = document.createElement("button");
  edit.innerHTML = '<i class="fas fa-edit"></i>';
  edit.classList.add("edit-btn");
  edit.addEventListener("click", () => editarTarea(newAgenda));

  // Botón "delete"
  const deleted = document.createElement("button");
  deleted.innerHTML = '<i class="fas fa-trash"></i>';
  deleted.classList.add("delete-btn");
  deleted.addEventListener("click", () => {
    eliminarDeLocalStorage(agendaEntrada.value);
    newAgenda.remove();
  });

  // Añadir botones al <li>
  newAgenda.appendChild(checked);
  // Añadir la tarea al <li>
  newAgenda.appendChild(taskText);
  newAgenda.appendChild(edit);
  newAgenda.appendChild(deleted);

  // Agregar la tarea a la lista
  agendaLista.appendChild(newAgenda);

  // Forzar la recalificación de estilos
  window.getComputedStyle(newAgenda);

  // Almacenaje local para persistencia
  almacenamientoLocal(agendaEntrada.value);
  agendaEntrada.value = "";
}

function editarTarea(tarea) {
  // Obtener el texto actual de la tarea
  const textoActual = tarea.querySelector("p").innerText.trim();

  // Crear un input para editar el texto
  const inputEdicion = document.createElement("input");
  inputEdicion.type = "text";
  inputEdicion.value = textoActual;
  inputEdicion.classList.add("edit-input");

  // Crear un botón para guardar los cambios
  const guardar = document.createElement("button");
  guardar.innerHTML = '<i class="fas fa-save"></i>';
  guardar.classList.add("save-btn");

  // Limpiar el contenido de la tarea para reemplazarlo por el input y el botón de guardar
  tarea.innerHTML = ""; // Limpiar el contenido actual de la tarea

  // Añadir el input de edición y el botón guardar
  tarea.appendChild(inputEdicion);
  tarea.appendChild(guardar);

  // Guardar los cambios al hacer clic en el botón guardar
  guardar.addEventListener("click", () => {
    const nuevoTexto = inputEdicion.value.trim();

    if (nuevoTexto === "") {
      alert("La tarea no puede estar vacía");
      return;
    }

    // Actualizar el texto en LocalStorage
    actualizarTextoLocalStorage(textoActual, nuevoTexto);

    // Crear los elementos necesarios para la tarea actualizada
    const pNuevoTexto = document.createElement("p");
    pNuevoTexto.innerText = nuevoTexto;

    // Crear los botones para la tarea
    const checked = document.createElement("button");
    checked.innerHTML = '<i class="fas fa-check"></i>';
    checked.classList.add("check-btn");
    checked.addEventListener("click", () => tarea.classList.toggle("completed"));

    const deleted = document.createElement("button");
    deleted.innerHTML = '<i class="fas fa-trash"></i>';
    deleted.classList.add("delete-btn");
    deleted.addEventListener("click", () => {
      eliminarDeLocalStorage(nuevoTexto);
      tarea.remove();
    });

    const edit = document.createElement("button");
    edit.innerHTML = '<i class="fas fa-edit"></i>';
    edit.classList.add("edit-btn");
    edit.addEventListener("click", () => editarTarea(tarea));

    // Limpiar la tarea y añadir los elementos actualizados
    tarea.innerHTML = "";  // Limpiar el contenido de la tarea
    tarea.appendChild(checked);  // Botón de "check"
    tarea.appendChild(pNuevoTexto);  // Texto de la tarea actualizado
    tarea.appendChild(edit);  // Botón de "editar"
    tarea.appendChild(deleted);  // Botón de "eliminar"
  });
}

function actualizarTextoLocalStorage(textoActual, nuevoTexto) {
  let datos = JSON.parse(localStorage.getItem("datos")) || [];

  datos = datos.map((item) =>
    item.texto === textoActual ? { ...item, texto: nuevoTexto } : item
  );

  localStorage.setItem("datos", JSON.stringify(datos));
}

function almacenamientoLocal(data) {
  let datos = JSON.parse(localStorage.getItem("datos")) || [];
  datos.push({ texto: data, completada: false });
  localStorage.setItem("datos", JSON.stringify(datos));
}

function getAgenda() {
  let datos = JSON.parse(localStorage.getItem("datos")) || [];

  datos.forEach((data) => {
    const newAgenda = document.createElement("li");
    newAgenda.classList.add("item");

    // Botón "check"
    const checked = document.createElement("button");
    checked.innerHTML = data.completada
      ? '<i class="fa-solid fa-check-square"></i>'
      : '<i class="fa-regular fa-square"></i>';
    checked.classList.add("check-btn");

    // Crear una etiqueta <p> para contener el texto de la tarea
    const taskText = document.createElement("p");
    taskText.innerText = data.texto;

    // Botón "edit"
    const edit = document.createElement("button");
    edit.innerHTML = '<i class="fas fa-edit"></i>';
    edit.classList.add("edit-btn");
    edit.addEventListener("click", () => editarTarea(newAgenda));

    // Botón "delete"
    const deleted = document.createElement("button");
    deleted.innerHTML = '<i class="fas fa-trash"></i>';
    deleted.classList.add("delete-btn");
    deleted.addEventListener("click", () => {
      eliminarDeLocalStorage(data.texto);
      newAgenda.remove();
    });

    // Añadir los elementos al <li> en el orden solicitado
    newAgenda.appendChild(checked); // Botón check
    newAgenda.appendChild(taskText); // Texto de la tarea dentro de <p>
    newAgenda.appendChild(edit); // Botón edit
    newAgenda.appendChild(deleted); // Botón delete

    // Si la tarea está completada, agregar la clase 'completed' al <li>
    if (data.completada) newAgenda.classList.add("completed");

    // Evento para alternar entre los estados e íconos del botón "check"
    checked.addEventListener("click", () => {
      newAgenda.classList.toggle("completed");

      // Cambiar ícono según el estado de la tarea
      if (newAgenda.classList.contains("completed")) {
        checked.innerHTML = '<i class="fa-solid fa-check-square"></i>';
        actualizarEstadoLocalStorage(data.texto, true); // Guardar estado como completado
      } else {
        checked.innerHTML = '<i class="fa-regular fa-square"></i>';
        actualizarEstadoLocalStorage(data.texto, false); // Guardar estado como no completado
      }
    });

    // Agregar la tarea a la lista
    agendaLista.appendChild(newAgenda);
  });
}

function actualizarEstadoLocalStorage(texto, estadoCompletado) {
  let datos = JSON.parse(localStorage.getItem("datos")) || [];

  datos = datos.map((item) => {
    if (item.texto === texto) {
      return { ...item, completada: estadoCompletado };
    }
    return item;
  });

  localStorage.setItem("datos", JSON.stringify(datos));
}

function eliminarDeLocalStorage(texto) {
  let datos = JSON.parse(localStorage.getItem("datos"));
  datos = datos.filter((item) => item.texto !== texto);
  localStorage.setItem("datos", JSON.stringify(datos));
}

function filtrarTareas() {
  const filtro = agendaFiltro.value;
  const tareas = agendaLista.querySelectorAll(".item");

  tareas.forEach((tarea) => {
    if (filtro === "todas") {
      tarea.style.display = "flex";
    } else if (filtro === "pendiente") {
      tarea.style.display = tarea.classList.contains("completed")
        ? "none"
        : "flex";
    } else if (filtro === "completada") {
      tarea.style.display = tarea.classList.contains("completed")
        ? "flex"
        : "none";
    }
  });
}
