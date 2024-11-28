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
  newAgenda.innerText = agendaEntrada.value;
  newAgenda.classList.add("item");

  // Botón "check"
  const checked = document.createElement("button");
  checked.innerHTML = '<i class="fas fa-check"></i>';
  checked.classList.add("check-btn");
  checked.addEventListener("click", () =>
    newAgenda.classList.toggle("completed")
  );

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

  newAgenda.appendChild(checked);
  newAgenda.appendChild(deleted);
  newAgenda.appendChild(edit);

  agendaLista.appendChild(newAgenda);
  almacenamientoLocal(agendaEntrada.value);

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
    newAgenda.innerText = data.texto;
    newAgenda.classList.add("item");
    if (data.completada) newAgenda.classList.add("completed");

    // Botón "check"
    const checked = document.createElement("button");
    checked.innerHTML = '<i class="fas fa-check"></i>';
    checked.classList.add("check-btn");
    checked.addEventListener("click", () => {
      newAgenda.classList.toggle("completed");
      actualizarEstadoLocalStorage(data.texto);
    });

    // Botón "delete"
    const deleted = document.createElement("button");
    deleted.innerHTML = '<i class="fas fa-trash"></i>';
    deleted.classList.add("delete-btn");
    deleted.addEventListener("click", () => {
      eliminarDeLocalStorage(data.texto);
      newAgenda.remove();
    });

    // Botón "edit"
    const edit = document.createElement("button");
    edit.innerHTML = '<i class="fas fa-edit"></i>';
    edit.classList.add("edit-btn");
    edit.addEventListener("click", () => editarTarea(newAgenda));

    // Añadir botones al elemento de la tarea
    newAgenda.appendChild(checked);
    newAgenda.appendChild(deleted);
    newAgenda.appendChild(edit);

    // Agregar la tarea a la lista
    agendaLista.appendChild(newAgenda);
  });
}

function actualizarEstadoLocalStorage(texto) {
  let datos = JSON.parse(localStorage.getItem("datos"));

  datos = datos.map((item) => {
    if (item.texto === texto) {
      return { ...item, completada: !item.completada };
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