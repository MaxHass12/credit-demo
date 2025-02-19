import React from 'react';

const TableComponent = ({ data }) => {
  return (
    <div style={{ display: 'flex', padding: '8px' }}>
      <table
        style={{
          border: '1px solid black',
          borderCollapse: 'collapse',
          fontSize: '14px',
          width: 'auto',
        }}
      >
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} style={{ border: '1px solid black' }}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  style={{ border: '1px solid black', padding: '4px 8px' }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
