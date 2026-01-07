import { useEffect, useState } from 'react';
import api from '../utils/api';

const BuyerDashboard = () => {
    const [interests, setInterests] = useState([]);

    useEffect(() => {
        const fetchInterests = async () => {
            try {
                const { data } = await api.get('/interests/buyer');
                setInterests(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchInterests();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-primary mb-8">My Interests</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller Contact</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {interests.map((interest) => (
                            <tr key={interest._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{interest.asset.title}</div>
                                    <div className="text-sm text-gray-500">${interest.asset.price}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${interest.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                            interest.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'}`}>
                                        {interest.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {interest.status === 'accepted' ? (
                                        <div>
                                            <div className="font-medium text-gray-900">{interest.seller.fullName}</div>
                                            <div>{interest.seller.email}</div>
                                        </div>
                                    ) : (
                                        <span className="italic text-gray-400">Hidden until accepted</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {interests.length === 0 && <div className="p-8 text-center text-gray-500">You haven't shown interest in any assets yet.</div>}
            </div>
        </div>
    );
};

export default BuyerDashboard;
