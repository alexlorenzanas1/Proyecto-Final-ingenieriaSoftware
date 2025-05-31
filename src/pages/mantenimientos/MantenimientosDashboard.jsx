import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { WrenchScrewdriverIcon, ClockIcon } from "@heroicons/react/24/solid";
import Header from "../../components/ui/Header";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import api from "../../services/api";

export default function MantenimientosDashboard() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ Placa: "" });
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);

  const cargarHistorial = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      const body = formData.Placa ? { Placa: formData.Placa } : {};
      const res = await api.post("/Buses/HistorialMantenimientos", body);
      setHistorial(res.data);
      setBusquedaRealizada(true);
    } catch (error) {
      console.error("Error al cargar historial de mantenimientos:", error);
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const mantenimientosModules = [
    {
      titulo: "Mandar a Mantenimiento",
      icono: <WrenchScrewdriverIcon className="w-10 h-10 text-[#01ff09] transition-transform duration-300 group-hover:scale-110" />,
      ruta: "/mantenimientos/mandaramantenimiento",
    },
  ];

  const handleNavigate = (e, ruta) => {
    e.stopPropagation(); // 🚫 evitar que se propague al formulario
    navigate(ruta);
  };

  return (
    <div className="min-h-screen bg-white text-black p-6">

      {/* Título principal */}
      <h2 className="text-xl font-semibold mb-6">🛠️ Gestión de Mantenimientos</h2>

      {/* Tarjetas de acciones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {mantenimientosModules.map((module, idx) => (
          <div key={idx} className="cursor-pointer" onClick={(e) => handleNavigate(e, module.ruta)}>
            <Card className="flex items-center justify-between p-6 rounded-2xl border border-[#01ff09] shadow-xl group hover:shadow-2xl transition-shadow">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{module.titulo}</h3>
              </div>
              <div>{module.icono}</div>
            </Card>
          </div>
        ))}
      </div>

      {/* Formulario de búsqueda */}
      <Header titulo="Consultar Historial de Mantenimientos" fechaHora={new Date()} />

      <Card className="mb-8">
        <CardContent>
          <form onSubmit={cargarHistorial} className="space-y-4">
            <Input
              label="Placa del Bus"
              name="Placa"
              value={formData.Placa}
              onChange={handleChange}
            />
            <div className="flex justify-end">
              <Button type="submit">Consultar Historial</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Tabla de resultados */}
      {cargando ? (
        <p className="text-gray-600 mt-4">Cargando historial de mantenimientos...</p>
      ) : (
        <>
          {busquedaRealizada && (
            <>
              {historial.length > 0 ? (
                <div className="mt-6 overflow-x-auto">
                  <table className="min-w-full table-auto bg-white text-black rounded-lg">
                    <thead>
                      <tr className="bg-[#01ff09] text-white">
                        <th className="px-4 py-2">Placa</th>
                        <th className="px-4 py-2">Fecha de Ingreso</th>
                        <th className="px-4 py-2">Fecha de Salida</th>
                        <th className="px-4 py-2">Descripción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historial.map((mantenimiento, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="px-4 py-2">{mantenimiento.placa}</td>
                          <td className="px-4 py-2">{mantenimiento.fechaIngreso}</td>
                          <td className="px-4 py-2">{mantenimiento.fechaSalida}</td>
                          <td className="px-4 py-2">{mantenimiento.descripcion}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="mt-4 text-gray-600">No se encontraron mantenimientos registrados.</p>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
