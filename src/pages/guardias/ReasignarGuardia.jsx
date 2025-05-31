import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { Card, CardContent } from "../../components/ui/card";
import Header from "../../components/ui/Header";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import api from "../../services/api";

export default function ReasignarGuardia() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    IdHorario: "",  // ID del horario para la reasignación
    IdEstacion: "", // ID de la estación para la reasignación
    CUI: "",        // CUI del guardia que se reasignará
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [assignedGuard, setAssignedGuard] = useState(null); // Guardar información del guardia asignado

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (!formData.IdHorario || !formData.IdEstacion || !formData.CUI) {
      setModalMessage("⚠️ Todos los campos son obligatorios para reasignar.");
      setModalOpen(true);
      return;
    }

    try {
      const res = await api.post("/Guardias/ReasignarGuardia", formData);

      if (res.data.guardiaAsignado) {
        setAssignedGuard(res.data.guardiaAsignado);
        setModalMessage("⚠️ La estación está ocupada. El guardia asignado es:");
      } else {
        setAssignedGuard(null);
        setModalMessage("✅ El guardia ha sido reasignado correctamente.");
      }

      setModalOpen(true);
    } catch (error) {
      console.error("Error al reasignar el guardia:", error);
      setModalMessage("⚠️ Error al reasignar el guardia.");
      setModalOpen(true);
    }
  };

  return (
    <div className="p-6">

      {/* Header de la página */}
      <Header titulo="Reasignar Guardia" fechaHora={new Date()} />

      {/* Botón de regresar */}
      <div className="mb-4">
        <Button onClick={() => navigate("/guardias")}>⬅️ Regresar</Button>
      </div>

      {/* Formulario dentro de una tarjeta */}
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="ID del Horario"
              name="IdHorario"
              type="number"
              value={formData.IdHorario}
              onChange={handleChange}
            />
            <Input
              label="ID de la Estación"
              name="IdEstacion"
              type="number"
              value={formData.IdEstacion}
              onChange={handleChange}
            />
            <Input
              label="CUI del Guardia"
              name="CUI"
              value={formData.CUI}
              onChange={handleChange}
            />
            <div className="flex justify-end">
              <Button type="submit">Reasignar Guardia</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Modal de resultados */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Resultado de la Reasignación"
      >
        <p>{modalMessage}</p>

        {assignedGuard && (
          <div className="mt-4 text-left space-y-2">
            <p><strong>Nombre:</strong> {assignedGuard.primerNombre} {assignedGuard.segundoNombre} {assignedGuard.primerApellido} {assignedGuard.segundoApellido}</p>
            <p><strong>CUI:</strong> {assignedGuard.cui}</p>
            <p><strong>Estación:</strong> {assignedGuard.idEstacion}</p>
            <p><strong>Horario:</strong> {assignedGuard.idHorario}</p>
          </div>
        )}

        <div className="flex justify-end mt-4">
          <Button onClick={() => setModalOpen(false)}>Cerrar</Button>
        </div>
      </Modal>
    </div>
  );
}