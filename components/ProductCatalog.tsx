import React from 'react';
import { CATALOG_DATA, ATTRIBUTES_DATA } from '../constants';

const ProductCatalog: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto p-4 bg-white border-l border-slate-200 shadow-xl w-full md:w-80 flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-1">Catálogo Maestro</h2>
        <p className="text-xs text-slate-500 mb-4">Lista de referencia rápida</p>
        
        <div className="space-y-3">
          {CATALOG_DATA.map((product) => (
            <div key={product.id} className="flex justify-between items-center border-b border-slate-100 pb-2">
              <div>
                <div className="text-sm font-medium text-slate-700">{product.name}</div>
                <div className="text-xs text-slate-400">ID: {product.id}</div>
              </div>
              <div className="text-sm font-bold text-blue-600">
                ${product.price.toLocaleString('es-CO')}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-md font-bold text-slate-800 mb-3">Extras / Atributos</h3>
        <div className="bg-slate-50 rounded-lg p-3 space-y-2">
          {ATTRIBUTES_DATA.map((attr, idx) => (
            <div key={idx} className="flex justify-between text-xs">
              <span className="text-slate-600">{attr.name} ({attr.value})</span>
              <span className="font-semibold text-green-600">+${attr.extraPrice.toLocaleString('es-CO')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCatalog;
