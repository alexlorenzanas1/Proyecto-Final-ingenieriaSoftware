import React, { useState } from "react";
import { Card } from "../../components/ui/card";
import { PencilIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/ui/Header";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import api from "../../services/api";

export default function RutasDashboard() {
  const navigate = useNavigate();

  const rutasModules = [
    {
      titulo: "Actualizar Ruta",
      icono: <PencilIcon className="w-10 h-10 text-[#01ff09] transform transition-transform duration-300 group-hover:scale-110" />,
      ruta: "/rutas/actualizar",
    },
    {
      titulo: "Crear Ruta",
      icono: <PlusCircleIcon className="w-10 h-10 text-[#01ff09] transform transition-transform duration-300 group-hover:scale-110" />,
      ruta: "/rutas/crear",
    },
  ];

  const [formData, setFormData] = useState({ nombre: "" });
  const [rutas, setRutas] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);

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
      const body = formData.nombre ? { nombre: formData.nombre } : {};
      const res = await api.post("/Rutas/ConsuntarRutaConMunicipalidad", body);
      setRutas(res.data);
      setMensaje("Rutas encontradas correctamente.");
    } catch (error) {
      console.error("Error al obtener las rutas:", error);
      setMensaje("Error al obtener las rutas.");
    } finally {
      setBusquedaRealizada(true);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black p-6">

      <h2 className="text-xl font-semibold mb-6">🛣️ Gestión de Rutas</h2>

      {/* Tarjetas de acciones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {rutasModules.map((module, idx) => (
          <Link key={idx} to={module.ruta}>
            <Card className="flex items-center justify-between p-6 rounded-2xl border border-[#01ff09] shadow-xl group hover:shadow-2xl transition-shadow">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{module.titulo}</h3>
              </div>
              <div>{module.icono}</div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Sección de búsqueda de rutas */}
      <Header titulo="Consultar Rutas" fechaHora={new Date()} />

      <Card>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Nombre de la Ruta"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
          />
          <div className="flex justify-end">
            <Button type="submit">Buscar Ruta</Button>
          </div>
        </form>
      </Card>

      {/* Mensajes de estado */}
      {mensaje && <p className="mt-4 text-gray-600">{mensaje}</p>}

      {/* Tabla de resultados */}
      {busquedaRealizada && rutas.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <h3 className="font-semibold mb-4">Resultados de Rutas:</h3>
          <table className="min-w-full table-auto bg-white text-black rounded-lg">
            <thead>
              <tr className="bg-[#01ff09] text-white">
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Municipalidad</th>
              </tr>
            </thead>
            <tbody>
              {rutas.map((ruta, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-4 py-2">{ruta.nombre}</td>
                  <td className="px-4 py-2">{ruta.municipalidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Si no se encuentran rutas */}
      {busquedaRealizada && rutas.length === 0 && (
        <p className="mt-4 text-gray-600">No se encontraron rutas.</p>
      )}

    </div>
  );
}

