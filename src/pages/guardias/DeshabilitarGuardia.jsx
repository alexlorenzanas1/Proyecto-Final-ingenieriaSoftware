import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import Header from "../../components/ui/Header";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import api from "../../services/api";

export default function DeshabilitarGuardia() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    CUI: "", // CUI obligatorio
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.CUI) {
      setModalMessage("⚠️ Por favor ingrese el CUI del guardia a deshabilitar.");
      setModalOpen(true);
      return;
    }

    try {
      const res = await api.post("/Guardias/DeshabilitarGuardias", formData);
      console.log("Guardia deshabilitado: ", res.data);
      setModalMessage("✅ El guardia ha sido deshabilitado correctamente.");
      setModalOpen(true);
    } catch (error) {
      console.error("Error al deshabilitar el guardia:", error);
      setModalMessage("⚠️ Error al deshabilitar el guardia.");
      setModalOpen(true);
    }
  };

  return (
    <div className="p-6">

      {/* Header de la página */}
      <Header titulo="Deshabilitar Guardia" fechaHora={new Date()} />

      {/* Botón de regresar */}
      <div className="mb-4">
        <Button onClick={() => navigate("/guardias")}>⬅️ Regresar</Button>
      </div>

      {/* Formulario dentro de una tarjeta */}
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="CUI del Guardia"
              name="CUI"
              value={formData.CUI}
              onChange={handleChange}
            />
            <div className="flex justify-end">
              <Button type="submit">Deshabilitar Guardia</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Modal de resultados */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Resultado de la Deshabilitación"
      >
        <p>{modalMessage}</p>
        <div className="flex justify-end mt-4">
          <Button onClick={() => setModalOpen(false)}>Cerrar</Button>
        </div>
      </Modal>
    </div>
  );
}
