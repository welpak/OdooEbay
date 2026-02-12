import React, { useEffect, useState } from 'react';
import { Package, Link as LinkIcon, AlertTriangle } from 'lucide-react';
import { ProductMapping } from '../types';
import { fetchMappings } from '../services/api';

const ProductMappings: React.FC = () => {
    const [mappings, setMappings] = useState<ProductMapping[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchMappings();
                setMappings(data);
            } catch (e) {
                console.error(e);
            }
            setIsLoading(false);
        };
        load();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Product Mappings</h2>
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                    {mappings.length} Active Mappings
                </span>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3">Odoo Product</th>
                            <th className="px-6 py-3">eBay SKU</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Last Synced</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                             <tr><td colSpan={4} className="p-6 text-center">Loading...</td></tr>
                        ) : (
                            mappings.length > 0 ? mappings.map((m) => (
                                <tr key={m.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-gray-100 rounded text-gray-500">
                                                <Package size={16} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{m.odooName}</p>
                                                <p className="text-xs text-gray-400">ID: {m.odooProductId}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-gray-700">{m.ebaySku}</td>
                                    <td className="px-6 py-4">
                                        {m.status === 'Synced' && (
                                            <span className="inline-flex items-center text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full border border-green-200">
                                                <LinkIcon size={12} className="mr-1" /> Synced
                                            </span>
                                        )}
                                        {m.status === 'OutOfSync' && (
                                             <span className="inline-flex items-center text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded-full border border-amber-200">
                                             <AlertTriangle size={12} className="mr-1" /> Out of Sync
                                         </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-gray-400">
                                        {new Date(m.lastSyncedAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={4} className="p-6 text-center text-gray-400">No mappings found.</td></tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductMappings;