import React, { useEffect, useRef } from 'react';
import $ from 'jquery';

// Importar los estilos y scripts de DataTables
// import 'datatables.net-dt/css/jquery.dataTables.min.css';
import 'datatables.net-responsive-dt/css/responsive.dataTables.min.css';
import 'datatables.net-buttons-dt/css/buttons.dataTables.min.css';
import 'datatables.net';
import 'datatables.net-responsive';
import 'datatables.net-buttons';
import 'datatables.net-buttons/js/buttons.html5.min.js';
import 'datatables.net-buttons/js/buttons.print.min.js';
import 'datatables.net-buttons/js/buttons.colVis.min.js';
import 'jszip'; 
import 'pdfmake/build/pdfmake';
import 'pdfmake/build/vfs_fonts';
window.$ = window.jQuery = $;

const DataTable = ({ 
  data, 
  columns, 
  options = {}, 
  className = 'display responsive nowrap',
  id = 'data-table' 
}) => {
  const tableRef = useRef(null);
  const tableInstance = useRef(null);

  useEffect(() => {
    function format(rowData) {
      // Verifica si hay datos de detalles
      const detailsList = rowData.details;
      if (!detailsList || !Array.isArray(detailsList) || detailsList.length === 0) {
        return '<p>No hay información adicional disponible.</p>';
      }
    
      const rows = detailsList.map((detail, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${detail.phone || '-'}</td>
          <td>${detail.address || '-'}</td>
          <td>${detail.last_login || '-'}</td>
        </tr>
      `).join('');
    
      return `
        <table class="table table-sm table-bordered" style="width: 100%; margin-bottom: 10px;">
          <thead>
            <tr>
              <th>#</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Último Acceso</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      `;
    }

    // Configuración predeterminada
    const defaultOptions = {
      responsive: true,
      data: data || [],
      columns: columns || [],
      dom: 'Bfrtip', // Botones, filtro, procesando, tabla, información, paginación
      buttons: [
        {
          extend: 'copy',
          text: 'Copiar',
          className: 'btn btn-primary btn-sm'
        },
        {
          extend: 'csv',
          text: 'CSV',
          className: 'btn btn-primary btn-sm'
        },
        {
          extend: 'excel',
          text: 'Excel',
          className: 'btn btn-primary btn-sm'
        },
        {
          extend: 'pdf',
          text: 'PDF',
          className: 'btn btn-primary btn-sm'
        },
        {
          extend: 'print',
          text: 'Imprimir',
          className: 'btn btn-primary btn-sm'
        }
      ]
    };

    // Combinar opciones predeterminadas con opciones personalizadas
    const tableOptions = {...defaultOptions, ...options};

    // Inicializar DataTable
    if (!tableInstance.current) {
      tableInstance.current = $(tableRef.current).DataTable(tableOptions);
    
      // Configurar evento para expandir/colapsar filas hijas
      $(tableRef.current).on('click', 'td.dt-control', function() {
        const tr = $(this).closest('tr');
        const row = tableInstance.current.row(tr);
        
        if (row.child.isShown()) {
          // Si la fila hija ya está visible, ocultarla
          row.child.hide();
          tr.removeClass('shown');
        } else {
          // Si la fila hija está oculta, mostrarla
          const rowData = row.data();
          if (rowData && rowData.details) {
            row.child(format(rowData)).show();
            tr.addClass('shown');
          }
        }
      });     
    } else {
      // Actualizar datos cuando cambian
      tableInstance.current.clear();
      if (data && data.length > 0) {
        tableInstance.current.rows.add(data);
      }
      tableInstance.current.draw();
    }

    // Limpiar al desmontar
    return () => {
      if (tableInstance.current) {
        tableInstance.current.destroy();
        tableInstance.current = null;
      }
    };
  }, [data, columns, options]);

  return (
    <div className="datatable-container">
      <table ref={tableRef} id={id} className={className} style={{ width: '100%' }}></table>
    </div>
  );
};

export default DataTable;