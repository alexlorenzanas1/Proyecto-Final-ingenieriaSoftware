import { useState } from "react";
import { Card, CardContent } from "../../components/ui/card"; 
import Header from "../../components/ui/Header";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function AsignarBuses() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    IdEstado: 1,
    IdRuta: "",
    IdPiloto: "",
    Placa: "",
    Marca: "",
    Modelo: "",
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

    try {
      // Realizar la solicitud a la API para asignar el bus
      const res = await api.post("/Buses/AsignarBus", formData);
      console.log("Bus asignado: ", res.data); // Mostrar la respuesta del backend

      // Si la asignación es exitosa, mostramos el modal
      setModalMessage("El bus ha sido asignado correctamente.");
      setModalOpen(true);
    } catch (error) {
      console.error("Error al asignar el bus:", error);
      setModalMessage("Error al asignar el bus.");
      setModalOpen(true); // Mostrar modal de error
    }
  };

  return (
    <div className="p-6">
      {/* Botón para regresar */}
      <button
        onClick={() => navigate("/buses")}
        className="mb-6 px-4 py-2 bg-[#01ff09] text-black rounded-xl font-semibold hover:bg-[#00e607] transition"
      >
        ⬅️ Regresar
      </button>

      {/* Header de la página */}
      <Header titulo="Asignar Bus" fechaHora={new Date()} />

      {/* Formulario dentro de una tarjeta */}
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Id Ruta"
              name="IdRuta"
              type="number"
              value={formData.IdRuta}
              onChange={handleChange}
            />
            <Input
              label="Id Piloto"
              name="IdPiloto"
              type="number"
              value={formData.IdPiloto}
              onChange={handleChange}
            />
            <Input
              label="Placa"
              name="Placa"
              value={formData.Placa}
              onChange={handleChange}
            />
            <Input
              label="Marca"
              name="Marca"
              value={formData.Marca}
              onChange={handleChange}
            />
            <Input
              label="Modelo"
              name="Modelo"
              value={formData.Modelo}
              onChange={handleChange}
            />
            <div className="flex justify-end">
              <Button type="submit">Asignar Bus</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Modal de resultados */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Resultado de la Asignación">
        <p>{modalMessage}</p>
        <Button onClick={() => setModalOpen(false)}>Cerrar</Button>
      </Modal>
    </div>
  );
}
