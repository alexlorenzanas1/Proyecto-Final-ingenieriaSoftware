import { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import Header from "../../components/ui/Header";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import api from "../../services/api"; 
import { useNavigate } from "react-router-dom"; 

export default function CrearRuta() {
  const navigate = useNavigate(); // Hook para navegación

  const [formData, setFormData] = useState({
    IdMunicipalidad: 1, // Valor predeterminado
    Nombre: "",
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
      const res = await api.post("/Rutas/CrearRuta", formData);

      if (res.status === 200) {
        setModalMessage("✅ Ruta creada exitosamente.");
      } else {
        setModalMessage("❌ No se pudo crear la ruta.");
      }

      setModalOpen(true); // Mostrar el modal con el resultado
      setFormData({ IdMunicipalidad: 1, Nombre: "" }); // Limpiar el formulario
    } catch (err) {
      console.error("Error al crear la ruta:", err);
      setModalMessage("⚠️ Error al conectar con el servidor.");
      setModalOpen(true); // Mostrar modal de error
    }
  };

  return (
    <div className="p-6">
      {/* Botón para regresar */}
      <button
        onClick={() => navigate("/rutas/dashboard")}
        className="mb-6 px-4 py-2 bg-[#01ff09] text-black rounded-xl font-semibold hover:bg-[#00e607] transition"
      >
        ⬅️ Regresar
      </button>

      {/* Header de la página */}
      <Header titulo="Crear Ruta" fechaHora={new Date()} />

      {/* Formulario dentro de una tarjeta */}
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nombre de la Ruta"
              name="Nombre"
              value={formData.Nombre}
              onChange={handleChange}
            />
            <Input
              label="ID de la Municipalidad"
              name="IdMunicipalidad"
              type="number"
              value={formData.IdMunicipalidad}
              onChange={handleChange}
            />
            <div className="flex justify-end">
              <Button type="submit">Crear Ruta</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Modal de resultados */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Resultado de la Creación"
      >
        <p>{modalMessage}</p>
        <Button onClick={() => setModalOpen(false)}>Cerrar</Button>
      </Modal>
    </div>
  );
}
