import React from 'react';
import { QuotationJSON } from '../types';

interface QuotationCardProps {
  data: QuotationJSON;
}

const QuotationCard: React.FC<QuotationCardProps> = ({ data }) => {
  const total = data.items.reduce((acc, item) => acc + (item.cantidad * item.precio_unitario), 0);
  const deposit = total * 0.5;

  return (
    <div className="mt-4 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden max-w-md mx-auto">
      <div className="bg-blue-600 px-4 py-3 flex justify-between items-center">
        <h3 className="text-white font-bold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
          Cotización Generada
        </h3>
        <span className="bg-blue-500 text-xs text-white px-2 py-1 rounded">Oficial</span>
      </div>
      
      <div className="p-4">
        <div className="space-y-3">
          {data.items.map((item, index) => (
            <div key={index} className="flex justify-between items-start border-b border-slate-100 pb-2 last:border-0">
              <div className="pr-2">
                <div className="font-medium text-sm text-slate-800">{item.descripcion}</div>
                <div className="text-xs text-slate-500">ID: {item.sku_id} | Cant: {item.cantidad}</div>
              </div>
              <div className="text-sm font-bold text-slate-700 whitespace-nowrap">
                ${(item.cantidad * item.precio_unitario).toLocaleString('es-CO')}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-200 bg-slate-50 -mx-4 px-4 pb-2">
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-slate-600">Total Pedido</span>
                <span className="text-lg font-bold text-slate-900">${total.toLocaleString('es-CO')}</span>
            </div>
            <div className="flex justify-between items-center text-blue-700">
                <span className="text-sm font-medium">Anticipo (50%)</span>
                <span className="text-md font-bold">${deposit.toLocaleString('es-CO')}</span>
            </div>
        </div>
        
        <div className="mt-4 text-center">
             <button 
                onClick={() => alert("Función de pago simulada: Redirigiendo a pasarela de pagos...")}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
             >
                Pagar Anticipo
             </button>
             <p className="text-[10px] text-slate-400 mt-2 text-center">
                {data.mensaje_cierre}
             </p>
        </div>
      </div>
    </div>
  );
};

export default QuotationCard;
