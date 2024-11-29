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

  // Botón "check"
  const checked = document.createElement("button");
  checked.innerHTML = '<i class="fa-regular fa-square"></i>';
  checked.classList.add("check-btn");
  checked.addEventListener("click", () => {
    newAgenda.classList.toggle("completed");
    checked.innerHTML = newAgenda.classList.contains("completed")
      ? '<i class="fa-solid fa-check-square"></i>'
      : '<i class="fa-regular fa-square"></i>';
  });

  // Crear nodo de texto para la tarea
  const textoTarea = document.createTextNode(agendaEntrada.value);

  // Botón "delete"
  const deleted = document.createElement("button");
  deleted.innerHTML = '<i class="fas fa-trash"></i>';
  deleted.classList.add("delete-btn");
  deleted.addEventListener("click", () => {
    eliminarDeLocalStorage(agendaEntrada.value);
    newAgenda.remove();
  });

  // Botón "edit"
  const edit = document.createElement("button");
  edit.innerHTML = '<i class="fas fa-edit"></i>';
  edit.classList.add("edit-btn");
  edit.addEventListener("click", () => editarTarea(newAgenda));

  // Añadir elementos al <li>
  newAgenda.appendChild(checked);
  newAgenda.appendChild(textoTarea);
  newAgenda.appendChild(deleted);
  newAgenda.appendChild(edit);

  // Agregar tarea a la lista
  agendaLista.appendChild(newAgenda);

  // Guardar en localStorage
  almacenamientoLocal(agendaEntrada.value);

  // Limpiar entrada
  agendaEntrada.value = "";
}

function editarTarea(tarea) {
  // Obtener el texto de la tarea sin los botones
  const textoActual = tarea.childNodes[0].nodeValue.trim();

  // Crear un input para editar
  const inputEdicion = document.createElement("input");
  inputEdicion.type = "text";
  inputEdicion.value = textoActual;
  inputEdicion.classList.add("edit-input");

  // Botón para guardar
  const guardar = document.createElement("button");
  guardar.innerHTML = '<i class="fas fa-save"></i>';
  guardar.classList.add("save-btn");

  // Reemplazar el contenido de la tarea con el input y el botón guardar
  tarea.innerHTML = ""; // Limpiar el contenido actual
  tarea.appendChild(inputEdicion);
  tarea.appendChild(guardar);

  // Guardar cambios al hacer clic en el botón guardar
  guardar.addEventListener("click", () => {
    const nuevoTexto = inputEdicion.value.trim();

    if (nuevoTexto === "") {
      alert("La tarea no puede estar vacía");
      return;
    }

    // Actualizar localStorage
    actualizarTextoLocalStorage(textoActual, nuevoTexto);

    // Restaurar el contenido original con el texto actualizado
    tarea.innerHTML = nuevoTexto;
    tarea.classList.remove("completed"); // Opcional: quitar completado

    // Volver a añadir los botones de acción
    const checked = document.createElement("button");
    checked.innerHTML = '<i class="fas fa-check"></i>';
    checked.classList.add("check-btn");
    checked.addEventListener("click", () =>
      tarea.classList.toggle("completed")
    );

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

    tarea.appendChild(checked);
    tarea.appendChild(deleted);
    tarea.appendChild(edit);
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