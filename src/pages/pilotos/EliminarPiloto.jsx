import { useState } from "react";
import { Card, CardContent } from "../../components/ui/card"; 
import Header from "../../components/ui/Header";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import api from "../../services/api"; 
import { useNavigate } from "react-router-dom"; 

export default function EliminarPiloto() {
  const navigate = useNavigate(); // Hook para navegación

  const [formData, setFormData] = useState({
    CUI: "", // El CUI es obligatorio para eliminar un piloto
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
      // Realizar la solicitud a la API para eliminar el piloto
      const res = await api.post("/Pilotos/EliminarPilotos", formData);
      console.log("Piloto eliminado: ", res.data); // Mostrar la respuesta del backend

      // Si la eliminación del piloto es exitosa, mostramos el modal
      setModalMessage("El piloto ha sido eliminado correctamente.");
      setModalOpen(true);
    } catch (error) {
      console.error("Error al eliminar el piloto:", error);
      setModalMessage("Error al eliminar el piloto.");
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
      <Header titulo="Eliminar Piloto" fechaHora={new Date()} />

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
            <div className="flex justify-end">
              <Button type="submit">Eliminar Piloto</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Modal de resultados */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Resultado de la Eliminación"
      >
        <p>{modalMessage}</p>
        <Button onClick={() => setModalOpen(false)}>Cerrar</Button>
      </Modal>
    </div>
  );
}

