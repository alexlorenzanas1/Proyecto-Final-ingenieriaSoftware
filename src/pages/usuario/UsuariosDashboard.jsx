import React, { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { UserPlusIcon, UserMinusIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import Header from "../../components/ui/Header";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import api from "../../services/api";

export default function UsuariosDashboard() {
  const [formData, setFormData] = useState({ nombreUsuario: "" });
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false); 

  const cargarUsuarios = async (nombreUsuario = "") => {
    setCargando(true);
    try {
      const body = nombreUsuario ? { nombreUsuario } : {};
      const res = await api.post("/Usuarios/ConsultarUsuarios", body);
      setUsuarios(res.data);
      setBusquedaRealizada(true); 
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    await cargarUsuarios(formData.nombreUsuario);
  };

  const usuarioModules = [
    {
      titulo: "Actualizar Usuario",
      icono: <UserCircleIcon className="w-10 h-10 text-[#01ff09] transform transition-transform duration-300 group-hover:scale-110" />,
      ruta: "/usuarios/actualizar",
    },
    {
      titulo: "Eliminar Usuario",
      icono: <UserMinusIcon className="w-10 h-10 text-[#01ff09] transform transition-transform duration-300 group-hover:scale-110" />,
      ruta: "/usuarios/eliminar",
    },
    {
      titulo: "Crear Usuario",
      icono: <UserPlusIcon className="w-10 h-10 text-[#01ff09] transform transition-transform duration-300 group-hover:scale-110" />,
      ruta: "/usuarios/crear",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black p-6">

      <h2 className="text-xl font-semibold mb-6">👤 Gestión de Usuarios</h2>

      {/* Tarjetas de acciones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {usuarioModules.map((module, idx) => (
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

      {/* Formulario de consulta */}
      <Header titulo="Consultar Usuarios" fechaHora={new Date()} />

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nombre de Usuario"
              name="nombreUsuario"
              value={formData.nombreUsuario}
              onChange={handleChange}
            />
            <div className="flex justify-end">
              <Button type="submit">Consultar Usuario</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Resultados de usuarios */}
      {cargando ? (
        <p className="text-gray-600 mt-4">Cargando usuarios...</p>
      ) : (
        <>
          {busquedaRealizada && (
            <>
              {usuarios.length > 0 ? (
                <div className="mt-6 overflow-x-auto">
                  <table className="min-w-full table-auto bg-white text-black rounded-lg">
                    <thead>
                      <tr className="bg-[#01ff09] text-white">
                        <th className="px-4 py-2">Nombre</th>
                        <th className="px-4 py-2">Usuario</th>
                        <th className="px-4 py-2">Rol</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuarios.map((usuario, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="px-4 py-2">{usuario.primerNombre} {usuario.segundoNombre}</td>
                          <td className="px-4 py-2">{usuario.nombreUsuario}</td>
                          <td className="px-4 py-2">{usuario.rol}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="mt-4 text-gray-600">No se encontraron usuarios.</p>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
