/* eslint-disable no-undef */
import React, { useState } from 'react';
import DataTable from './DataTable';
import { users } from '../data/users';
import $ from 'jquery';

const UserTable = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  // Definir las columnas
  const columns = [
    { title: 'ID', data: 'id' },
    { title: 'Nombre', data: 'name' },
    { title: 'Email', data: 'email' },
    { title: 'Rol', data: 'role' },
    { 
      title: 'Estado', 
      data: 'status',
      render: function(data) {
        if (data) {
          return '<span style="background-color: #dcfce7; color: #166534; padding: 3px 8px; border-radius: 4px; font-size: 0.75rem;">Activo</span>';
        } else {
          return '<span style="background-color: #fee2e2; color: #991b1b; padding: 3px 8px; border-radius: 4px; font-size: 0.75rem;">Inactivo</span>';
        }
      }
    },
    { title: 'Fecha Creación', data: 'created_at' },
    {
      title: 'Acciones',
      data: null,
      render: function(data, type, row) {
        return `
          <div style="display: flex; gap: 8px; justify-content: center;">
            <button class="edit-btn" style="background-color: #eab308; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; display: flex; align-items: center; font-size: 0.75rem;">
              <svg style="width: 16px; height: 16px; margin-right: 4px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Editar
            </button>
            <button class="toggle-btn" style="background-color: ${data.status ? '#22c55e' : '#ef4444'}; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; display: flex; align-items: center; font-size: 0.75rem;">
              <svg style="width: 16px; height: ISBN16px; margin-right: 4px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="${data.status ? 'M16 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0' : 'M8 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0'}"></path>
                <path d="M2 6m0 6a6 6 0 0 1 6 -6h8a6 6 0 0 1 6 6v0a6 6 0 0 1 -6 6h-8a6 6 0 0 1 -6 -6z"></path>
              </svg>
              ${data.status ? 'Desactivar' : 'Activar'}
            </button>
          </div>
        `;
      }
    }
  ];

  // Opciones adicionales para DataTables
  const options = {
    // Configuración personalizada para esta tabla específica
    pageLength: 5,
    lengthMenu: [5, 10, 25, 50],
    order: [[0, 'asc']], // Ordenar por ID ascendente por defecto
    drawCallback: function() {
      // Agregar event listeners a los botones después de que la tabla se ha renderizado
      const table = this.api();
      
      // Botón de editar
      $('.edit-btn').off('click').on('click', function(e) {
        e.stopPropagation();
        const rowData = table.row($(this).closest('tr')).data();
        alert(`Editando: ${rowData.name}`);
        // Aquí podrías abrir un modal o redirigir a una página de edición
      });
      
      // Botón de cambiar estado
      $('.toggle-btn').off('click').on('click', function(e) {
        e.stopPropagation();
        const rowData = table.row($(this).closest('tr')).data();
        alert(`Cambiando estado de: ${rowData.name}`);
        // Aquí implementarías la lógica para cambiar el estado
      });
    }
  };

  // Manejador para el clic en una fila
  const handleRowClick = (rowData) => {
    setSelectedUser(rowData);
  };

  return (
    <div className="user-table-container">
      <h2>Tabla de Usuarios</h2>
      
      <DataTable 
        data={users} 
        columns={columns} 
        options={options}
        onRowClick={handleRowClick}
        id="users-table"
      />
      
      {selectedUser && (
        <div style={{ marginTop: 20, padding: 15, backgroundColor: '#f3f4f6', borderRadius: 8 }}>
          <h3>Usuario Seleccionado</h3>
          <p><strong>Nombre:</strong> {selectedUser.name}</p>
          <p><strong>Email:</strong> {selectedUser.email}</p>
          <p><strong>Rol:</strong> {selectedUser.role}</p>
        </div>
      )}
    </div>
  );
};

export default UserTable;