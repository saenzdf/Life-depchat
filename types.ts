export interface Product {
  id: number;
  name: string;
  price: number;
  category: 'uniform' | 'clothing' | 'accessory';
}

export interface Attribute {
  name: string;
  value: string;
  extraPrice: number;
}

export interface QuotationItem {
  sku_id: string | number;
  descripcion: string;
  cantidad: number;
  precio_unitario: number;
}

export interface QuotationJSON {
  accion: string;
  cliente_confirmado: boolean;
  items: QuotationItem[];
  mensaje_cierre: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  quotation?: QuotationJSON; // Only present if the model returns a valid JSON block
  timestamp: Date;
}