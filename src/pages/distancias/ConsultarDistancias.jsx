import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { PencilSquareIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import Header from "../../components/ui/Header";
import Button from "../../components/ui/Button";
import api from "../../services/api";

export default function ConsultarDistancias() {
  const navigate = useNavigate();
  const [distancias, setDistancias] = useState([]);
  const [modalMessage, setModalMessage] = useState("");

  const distanciasModules = [
    {
      titulo: "Actualizar Distancia",
      icono: (
        <PencilSquareIcon className="w-10 h-10 text-[#01ff09] transition-transform duration-300 group-hover:scale-110" />
      ),
      ruta: "/distancias/actualizar",
    },
    {
      titulo: "Registrar Distancia",
      icono: (
        <PlusCircleIcon className="w-10 h-10 text-[#01ff09] transition-transform duration-300 group-hover:scale-110" />
      ),
      ruta: "/distancias/registrar",
    },
  ];

  const handleNavigate = (e, ruta) => {
    e.stopPropagation();
    navigate(ruta);
  };

  const handleSubmit = async () => {
    try {
      const res = await api.post("/Distancias/ConsultarDistancias", {});
      setDistancias(res.data || []);
      setModalMessage("✅ Distancias consultadas correctamente.");
    } catch (error) {
      console.error("Error al consultar las distancias:", error);
      setModalMessage("❌ Error al consultar las distancias.");
    }
  };

  return (
    <div className="p-6">
      {/* Header principal */}
      <Header titulo="✏️ Gestión de Distancias" fechaHora={new Date()} />

      {/* Tarjetas de acciones */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {distanciasModules.map((module, idx) => (
          <div
            key={idx}
            className="cursor-pointer"
            onClick={(e) => handleNavigate(e, module.ruta)}
          >
            <Card className="flex items-center justify-between p-6 rounded-2xl border border-[#01ff09] shadow-xl group hover:shadow-2xl transition-shadow">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{module.titulo}</h3>
              </div>
              <div>{module.icono}</div>
            </Card>
          </div>
        ))}
      </section>

      {/* Header de sección */}
      <Header titulo="Consultar Distancias" fechaHora={new Date()} />

      {/* Botón para consultar */}
      <Card className="mb-8">
        <CardContent>
          <div className="flex justify-end">
            <Button onClick={handleSubmit}>Consultar Distancias Registradas</Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de resultados */}
      {distancias.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <h3 className="font-semibold mb-4">Distancias Disponibles:</h3>
          <table className="min-w-full table-auto bg-white text-black rounded-lg">
            <thead>
              <tr className="bg-[#01ff09] text-white">
                <th className="px-4 py-2">Ruta</th>
                <th className="px-4 py-2">Inicio</th>
                <th className="px-4 py-2">Fin</th>
                <th className="px-4 py-2">Recorrido (km)</th>
              </tr>
            </thead>
            <tbody>
              {distancias.map((d, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-4 py-2">{d.ruta || "-"}</td>
                  <td className="px-4 py-2">{d.estacionInicio || "-"}</td>
                  <td className="px-4 py-2">{d.estacionFin || "-"}</td>
                  <td className="px-4 py-2">{d.recorrido || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalMessage && <p className="mt-4 text-gray-600">{modalMessage}</p>}
    </div>
  );
}