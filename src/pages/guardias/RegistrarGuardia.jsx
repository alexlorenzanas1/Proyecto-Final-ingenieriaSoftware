import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import Header from "../../components/ui/Header";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import api from "../../services/api";

export default function RegistrarGuardia() {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    IdEstacion: 1,
    IdEstado: 1,
    IdHorario: 1,
    PrimerNombre: "",
    SegundoNombre: "",
    PrimerApellido: "",
    SegundoApellido: "",
    CUI: "",
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

    // Validaciones básicas
    if (!formData.PrimerNombre || !formData.PrimerApellido || !formData.CUI) {
      setModalMessage("⚠️ Por favor complete al menos el Primer Nombre, Primer Apellido y CUI.");
      setModalOpen(true);
      return;
    }

    try {
      const res = await api.post("/Guardias/RegistrarGuardia", formData);
      console.log("Guardia registrado: ", res.data);
      setModalMessage("✅ El guardia ha sido registrado correctamente.");
      setModalOpen(true);
    } catch (error) {
      console.error("Error al registrar el guardia:", error);
      setModalMessage("⚠️ Error al registrar el guardia.");
      setModalOpen(true);
    }
  };

  return (
    <div className="p-6">

      {/* Header de la página */}
      <Header titulo="Registrar Guardia" fechaHora={new Date()} />

      {/* Botón de regresar */}
      <div className="mb-4">
        <Button onClick={() => navigate("/guardias")}>⬅️ Regresar</Button>
      </div>

      {/* Formulario dentro de una tarjeta */}
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Primer Nombre"
              name="PrimerNombre"
              value={formData.PrimerNombre}
              onChange={handleChange}
            />
            <Input
              label="Segundo Nombre"
              name="SegundoNombre"
              value={formData.SegundoNombre}
              onChange={handleChange}
            />
            <Input
              label="Primer Apellido"
              name="PrimerApellido"
              value={formData.PrimerApellido}
              onChange={handleChange}
            />
            <Input
              label="Segundo Apellido"
              name="SegundoApellido"
              value={formData.SegundoApellido}
              onChange={handleChange}
            />
            <Input
              label="CUI"
              name="CUI"
              value={formData.CUI}
              onChange={handleChange}
            />
            <div className="flex justify-end">
              <Button type="submit">Registrar Guardia</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Modal de resultados */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Resultado de la Registración"
      >
        <p>{modalMessage}</p>
        <div className="flex justify-end mt-4">
          <Button onClick={() => setModalOpen(false)}>Cerrar</Button>
        </div>
      </Modal>
    </div>
  );
}
