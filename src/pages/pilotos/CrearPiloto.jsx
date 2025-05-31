import { useState } from "react";
import { Card, CardContent } from "../../components/ui/card"; 
import Header from "../../components/ui/Header";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import api from "../../services/api"; 
import { useNavigate } from "react-router-dom"; 

export default function CrearPiloto() {
  const navigate = useNavigate(); // Hook para navegación

  const [formData, setFormData] = useState({
    idEstado: 1,
    idHorario: 1,
    primerNombre: "",
    segundoNombre: "",
    primerApellido: "",
    segundoApellido: "",
    cui: "",
    tipoLicencia: "",
    numeroLicencia: "",
    vencimientoLicencia: "",
    horasActivo: "",
    correo: "",
    telefono: "",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState(""); // Mensaje para el modal
  const [formVisible, setFormVisible] = useState(false); // Estado para controlar la visibilidad del formulario

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Realizar la solicitud a la API para crear el piloto
      const res = await api.post("/Pilotos/CrearPilotos", formData);
      console.log("Piloto creado: ", res.data); // Mostrar la respuesta del backend

      // Si la creación del piloto es exitosa, mostramos el modal
      setModalMessage("El piloto ha sido creado correctamente.");
      setModalOpen(true);
    } catch (error) {
      console.error("Error al crear el piloto:", error);
      setModalMessage("Error al crear el piloto.");
      setModalOpen(true); // Mostrar modal de error
    }
  };

  return (
    <div className="p-6">
      {/* Botón para regresar */}
      <button
        onClick={() => navigate("/pilotos/dashboard")}
        className="mb-6 px-4 py-2 bg-[#01ff09] text-black rounded-xl font-semibold hover:bg-[#00e607] transition"
      >
        ⬅️ Regresar
      </button>

      {/* Header de la página */}
      <Header titulo="Crear Piloto" fechaHora={new Date()} />

      {/* Botón para desplegar/contraer el formulario */}
      <Button onClick={() => setFormVisible(!formVisible)}>
        {formVisible ? "Ocultar Formulario" : "Crear Nuevo Piloto"}
      </Button>

      {/* Formulario dentro de una tarjeta, solo visible si formVisible es true */}
      {formVisible && (
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Primer Nombre" name="primerNombre" value={formData.primerNombre} onChange={handleChange} />
              <Input label="Segundo Nombre" name="segundoNombre" value={formData.segundoNombre} onChange={handleChange} />
              <Input label="Primer Apellido" name="primerApellido" value={formData.primerApellido} onChange={handleChange} />
              <Input label="Segundo Apellido" name="segundoApellido" value={formData.segundoApellido} onChange={handleChange} />
              <Input label="CUI" name="cui" value={formData.cui} onChange={handleChange} />
              <Input label="Tipo de Licencia" name="tipoLicencia" value={formData.tipoLicencia} onChange={handleChange} />
              <Input label="Número de Licencia" name="numeroLicencia" value={formData.numeroLicencia} onChange={handleChange} />
              <Input label="Vencimiento de Licencia" name="vencimientoLicencia" type="date" value={formData.vencimientoLicencia} onChange={handleChange} />
              <Input label="Horas Activo" name="horasActivo" type="number" value={formData.horasActivo} onChange={handleChange} />
              <Input label="Correo" name="correo" value={formData.correo} onChange={handleChange} />
              <Input label="Teléfono" name="telefono" value={formData.telefono} onChange={handleChange} />
              <div className="flex justify-end">
                <Button type="submit">Crear Piloto</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Modal de resultados */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Resultado de la Creación">
        <p>{modalMessage}</p>
        <Button onClick={() => setModalOpen(false)}>Cerrar</Button>
      </Modal>
    </div>
  );
}

