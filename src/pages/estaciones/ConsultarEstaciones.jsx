import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { PencilSquareIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import Header from "../../components/ui/Header";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import api from "../../services/api";

export default function ConsultarEstaciones() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ idRuta: "", nombre: "" });
  const [estaciones, setEstaciones] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const estacionesModules = [
    {
      titulo: "Actualizar Estación",
      icono: (
        <PencilSquareIcon className="w-10 h-10 text-[#01ff09] transition-transform duration-300 group-hover:scale-110" />
      ),
      ruta: "/estaciones/actualizar",
    },
    {
      titulo: "Registrar Estación",
      icono: (
        <PlusCircleIcon className="w-10 h-10 text-[#01ff09] transition-transform duration-300 group-hover:scale-110" />
      ),
      ruta: "/estaciones/registrar",
    },
  ];

  const handleNavigate = (e, ruta) => {
    e.stopPropagation();
    navigate(ruta);
  };

  const consultarEstaciones = async () => {
    setCargando(true);
    try {
      const body = formData.idRuta || formData.nombre ? formData : {};
      const res = await api.post("/Estaciones/ConsultarEstaciones", body);
      setEstaciones(res.data);
      setMensaje("✅ Estaciones consultadas correctamente.");
    } catch (error) {
      console.error("Error al consultar estaciones:", error);
      setMensaje("❌ Error al consultar las estaciones.");
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="p-6">
      {/* Header principal */}
      <Header titulo="🏛️ Gestión de Estaciones" fechaHora={new Date()} />

      {/* Tarjetas de acciones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {estacionesModules.map((module, idx) => (
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
      </div>

      {/* Header de formulario */}
      <Header titulo="Consultar Estaciones" fechaHora={new Date()} />

      {/* Formulario de Consulta */}
      <section>
        <Card className="mb-8">
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                consultarEstaciones();
              }}
              className="space-y-4"
            >
              <Input
                label="ID de Ruta"
                name="idRuta"
                type="number"
                value={formData.idRuta}
                onChange={handleChange}
              />
              <Input
                label="Nombre de la Estación"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
              />
              <div className="flex justify-end">
                <Button type="submit">Consultar Estaciones</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>

      {/* Mensaje de resultado */}
      {mensaje && <p className="mt-4 text-gray-600">{mensaje}</p>}

      {/* Tabla de resultados */}
      {cargando ? (
        <p className="text-gray-600 mt-4">Cargando estaciones...</p>
      ) : estaciones.length > 0 ? (
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full table-auto bg-white text-black rounded-lg">
            <thead>
              <tr className="bg-[#01ff09] text-white">
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">ID Ruta</th>
                <th className="px-4 py-2">Dirección</th>
              </tr>
            </thead>
            <tbody>
              {estaciones.map((estacion, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-4 py-2">{estacion.nombre}</td>
                  <td className="px-4 py-2">{estacion.idRuta}</td>
                  <td className="px-4 py-2">
                    {estacion.direccion || "No asignada"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-4 text-gray-600">No se encontraron estaciones.</p>
      )}
    </div>
  );
}
