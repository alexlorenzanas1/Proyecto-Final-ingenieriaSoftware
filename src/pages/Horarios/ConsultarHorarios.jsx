import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/solid";
import Header from "../../components/ui/Header";
import Button from "../../components/ui/Button";
import api from "../../services/api";

export default function ConsultarHorarios() {
  const navigate = useNavigate();

  const [horarios, setHorarios] = useState([]);
  const [modalMessage, setModalMessage] = useState("");
  const [cargando, setCargando] = useState(false);

  const horariosModules = [
    {
      titulo: "Consultar Horarios x Estaciones x Rutas",
      icono: (
        <ClipboardDocumentListIcon className="w-10 h-10 text-[#01ff09] transition-transform duration-300 group-hover:scale-110" />
      ),
      ruta: "/horarios/consultar",
    },
  ];

  const handleNavigate = (e, ruta) => {
    e.stopPropagation();
    navigate(ruta);
  };

  const consultarHorarios = async () => {
    setCargando(true);
    try {
      const res = await api.post("/Horarios/ConsultarHorarios", {});
      setHorarios(res.data);
      setModalMessage("✅ Horarios consultados correctamente.");
    } catch (error) {
      console.error("Error al consultar los horarios:", error);
      setModalMessage("❌ Error al consultar los horarios.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header principal */}
      <Header titulo="🕑 Gestión de Horarios" fechaHora={new Date()} />

      {/* Tarjetas de acciones */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {horariosModules.map((module, idx) => (
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

      {/* Header de formulario */}
      <Header titulo="Consultar Horarios" fechaHora={new Date()} />

      {/* Botón de consulta */}
      <Card className="mb-8">
        <CardContent>
          <div className="flex justify-end">
            <Button onClick={consultarHorarios}>Consultar Horarios Disponibles</Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de resultados */}
      {cargando ? (
        <p className="text-gray-600 mt-4">Cargando horarios...</p>
      ) : horarios.length > 0 ? (
        <div className="mt-6 overflow-x-auto">
          <h3 className="font-semibold mb-4">Horarios Disponibles:</h3>
          <table className="min-w-full table-auto bg-white text-black rounded-lg">
            <thead>
              <tr className="bg-[#01ff09] text-white">
                <th className="px-4 py-2">ID Horario</th>
                <th className="px-4 py-2">Descripción</th>
                <th className="px-4 py-2">Hora de Inicio</th>
                <th className="px-4 py-2">Hora de Fin</th>
              </tr>
            </thead>
            <tbody>
              {horarios.map((horario, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-4 py-2">{horario.idHorario}</td>
                  <td className="px-4 py-2">{horario.descripcion}</td>
                  <td className="px-4 py-2">{horario.horaInicio}</td>
                  <td className="px-4 py-2">{horario.horaFin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-4 text-gray-600">No se encontraron horarios.</p>
      )}

      {/* Mensaje de respuesta */}
      {modalMessage && <p className="mt-4 text-gray-600">{modalMessage}</p>}
    </div>
  );
}
