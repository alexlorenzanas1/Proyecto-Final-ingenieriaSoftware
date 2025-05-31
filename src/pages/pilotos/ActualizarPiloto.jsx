import { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import Header from "../../components/ui/Header";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import api from "../../services/api"; 
import { useNavigate } from "react-router-dom"; 

export default function ActualizarPiloto() {
  const navigate = useNavigate(); // Hook para navegar

  const [formData, setFormData] = useState({
    CUI: "", // El CUI es obligatorio para actualizar un piloto
    IdEstado: 1,
    IdHorario: 1,
    TipoLicencia: "",
    NumeroLicencia: "",
    VencimientoLicencia: "",
    HorasActivo: "",
    correo: "",
    telefono: "",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState(""); // Mensaje para el modal

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
      // Realizar la solicitud a la API para actualizar el piloto
      const res = await api.post("/Pilotos/ActualizarPilotos", formData);
      console.log("Piloto actualizado: ", res.data);  // Mostrar la respuesta del backend

      // Si la actualización del piloto es exitosa, mostramos el modal
      setModalMessage("El piloto ha sido actualizado correctamente.");
      setModalOpen(true);
    } catch (error) {
      console.error("Error al actualizar el piloto:", error);
      setModalMessage("Error al actualizar el piloto.");
      setModalOpen(true); // Mostrar modal de error
    }
  };

  return (
    <div className="p-6">
      {/* Botón de regresar */}
      <button
        onClick={() => navigate("/pilotos/dashboard")}
        className="mb-6 px-4 py-2 bg-[#01ff09] text-black rounded-xl font-semibold hover:bg-[#00e607] transition"
      >
        ⬅️ Regresar
      </button>

      {/* Header de la página */}
      <Header titulo="Actualizar Piloto" fechaHora={new Date()} />

      {/* Formulario dentro de una tarjeta */}
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="CUI del Piloto"
              name="CUI"
              value={formData.CUI}
              onChange={handleChange}
            />
            <Input
              label="Tipo de Licencia"
              name="TipoLicencia"
              value={formData.TipoLicencia}
              onChange={handleChange}
            />
            <Input
              label="Número de Licencia"
              name="NumeroLicencia"
              value={formData.NumeroLicencia}
              onChange={handleChange}
            />
            <Input
              label="Vencimiento de Licencia"
              name="VencimientoLicencia"
              type="date"
              value={formData.VencimientoLicencia}
              onChange={handleChange}
            />
            <Input
              label="Horas Activo"
              name="HorasActivo"
              type="number"
              value={formData.HorasActivo}
              onChange={handleChange}
            />
            <Input
              label="Correo"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
            />
            <Input
              label="Teléfono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
            />
            <div className="flex justify-end">
              <Button type="submit">Actualizar Piloto</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Modal de resultados */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Resultado de la Actualización">
        <p>{modalMessage}</p>
        <Button onClick={() => setModalOpen(false)}>Cerrar</Button>
      </Modal>
    </div>
  );
}