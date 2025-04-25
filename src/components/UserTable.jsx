import React, { useState } from 'react';
import DataTable from './DataTable';
import { users } from '../data/users';
import $ from 'jquery';

const UserTable = () => {

  // Definir las columnas
  const columns = [
    {
      className: 'dt-control',
      orderable: false,
      data: null,
      defaultContent: '<span> </span>',
      title: '_', 
    },
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
          <div class="d-flex justify-content-center gap-2">
            <!-- Botón Editar -->
            <button class="btn btn-warning btn-sm d-flex align-items-center edit-btn">
              <svg class="me-1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Editar
            </button>

            <!-- Botón Activar/Desactivar -->
            <button class="btn btn-sm d-flex align-items-center toggle-btn 
              ${data.status ? 'btn-success' : 'btn-danger'}">
              <svg class="me-1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                <path d="${data.status ? 'M16 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0' : 'M8 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0'}"/>
                <path d="M2 6m0 6a6 6 0 0 1 6 -6h8a6 6 0 0 1 6 6v0a6 6 0 0 1 -6 6h-8a6 6 0 0 1 -6 -6z"/>
              </svg>
              ${data.status ? 'Desactivar' : 'Activar'}
            </button>
          </div>

        `;
      }
    }
  ];

  // Opciones adicionales para DataTables
  // Configuración personalizada para esta tabla específica
  const options = {
    pageLength: 5,
    lengthMenu: [5, 10, 25, 50],
    order: [[1, 'asc']],
    drawCallback: function() {
      // Agregar event listeners a los botones después de que la tabla se ha renderizado
      const table = this.api();
      
      // Botón de editar
      $('.edit-btn').off('click').on('click', function(e) {
        e.stopPropagation();
        const rowData = table.row($(this).closest('tr')).data();
        alert(`Editando: ${rowData.name}`);
        // Aquí se puede abrir un modal o redirigir a una página de edición
      });
      
      // Botón de cambiar estado
      $('.toggle-btn').off('click').on('click', function(e) {
        e.stopPropagation();
        const rowData = table.row($(this).closest('tr')).data();
        alert(`Cambiando estado de: ${rowData.name}`);
        // Aquí se puede abrir un modal o cambiar el estado
      });
    }
  };

  return (
    <div className="user-table-container">
      <h2>Tabla de Usuarios</h2>
      
      <DataTable 
        data={users} 
        columns={columns} 
        options={options}
        id="users-table"
      />
      
    </div>
  );
};

export default UserTable;