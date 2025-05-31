import { useState, useEffect } from "react";
import api from "../../services/api";
import { Card, CardContent } from "../../components/ui/card";
import Header from "../../components/ui/Header";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { useNavigate } from "react-router-dom";

export default function ActualizarRuta() {
  const navigate = useNavigate(); // Hook para navegación

  const [formData, setFormData] = useState({ IdRuta: "", IdMunicipalidad: 1, Nombre: "" });
  const [rutas, setRutas] = useState([]); // Para cargar y mostrar las rutas disponibles
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Cargar rutas disponibles al cargar el componente
  const cargarRutas = async () => {
    try {
      const res = await api.post("/Rutas/ConsuntarRutaConMunicipalidad", {}); // Llamar al endpoint para obtener las rutas
      setRutas(res.data); // Guardar las rutas en el estado
    } catch (error) {
      console.error("Error al obtener rutas", error);
    }
  };

  useEffect(() => {
    cargarRutas(); // Obtener las rutas al montar el componente
  }, []);

  // Función para manejar el cambio de los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Función para manejar el formulario de actualización de ruta
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/Rutas/ActualizarRuta", formData); // Enviar los datos para actualizar la ruta
      if (res.status === 200) {
        setModalMessage("✅ Ruta actualizada correctamente.");
      } else {
        setModalMessage("❌ No se pudo actualizar la ruta.");
      }
      setModalOpen(true); // Mostrar el modal con el resultado
      cargarRutas(); // Refrescar la lista de rutas
    } catch (error) {
      console.error("Error al actualizar la ruta:", error);
      setModalMessage("⚠️ Error al conectar con el servidor.");
      setModalOpen(true); // Mostrar modal de error
    }
  };

  return (
    <div className="p-6">
      {/* Botón de regresar */}
      <button
        onClick={() => navigate("/rutas/dashboard")}
        className="mb-6 px-4 py-2 bg-[#01ff09] text-black rounded-xl font-semibold hover:bg-[#00e607] transition"
      >
        ⬅️ Regresar
      </button>

      {/* Header de la página */}
      <Header titulo="Actualizar Ruta" fechaHora={new Date()} />

      {/* Formulario para seleccionar la ruta a actualizar */}
      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold mb-4">Seleccione la Ruta a Actualizar</h3>
          <select
            name="IdRuta"
            value={formData.IdRuta}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          >
            <option value="">Seleccione una ruta</option>
            {rutas.map((ruta) => (
              <option key={ruta.idRuta} value={ruta.idRuta}>
                {ruta.nombre}
              </option>
            ))}
          </select>

          {/* Si se seleccionó una ruta, permitir actualización de su nombre y municipalidad */}
          {formData.IdRuta && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nombre de la Ruta"
                name="Nombre"
                value={formData.Nombre}
                onChange={handleChange}
              />
              <Input
                label="ID Municipalidad"
                name="IdMunicipalidad"
                type="number"
                value={formData.IdMunicipalidad}
                onChange={handleChange}
              />
              <div className="flex justify-end">
                <Button type="submit">Actualizar Ruta</Button>
              </div>
            </form>
          )}
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

