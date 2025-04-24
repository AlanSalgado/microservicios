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
window.$ = window.jQuery = $;

const DataTable = ({ 
  data, 
  columns, 
  options = {}, 
  onRowClick = null,
  className = 'display responsive nowrap',
  id = 'data-table' 
}) => {
  const tableRef = useRef(null);
  const tableInstance = useRef(null);

  useEffect(() => {
    // Configuración predeterminada
    const defaultOptions = {
      responsive: true,
      data: data || [],
      columns: columns || [],
      dom: 'Bfrtip', // Botones, filtro, procesando, tabla, información, paginación
      buttons: [
        'copy', 'csv', 'excel', 'pdf', 'print'
      ]
    };

    // Combinar opciones predeterminadas con opciones personalizadas
    const tableOptions = {...defaultOptions, ...options};

    // Inicializar DataTable
    if (!tableInstance.current) {
      tableInstance.current = $(tableRef.current).DataTable(tableOptions);
      
      // Agregar evento click a las filas si se proporciona
      if (onRowClick) {
        $(tableRef.current).on('click', 'tbody tr', function() {
          const rowData = tableInstance.current.row(this).data();
          onRowClick(rowData);
        });
      }
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
  }, [data, columns, options, onRowClick]);

  return (
    <div className="datatable-container">
      <table ref={tableRef} id={id} className={className} style={{ width: '100%' }}></table>
    </div>
  );
};

export default DataTable;